import { config } from '../config';
import {
  TournamentApprovalEvent,
  TournamentOrganization,
  TournamentProject,
  TournamentUser,
} from '../models/tournament';
import { get15DaysBefore } from '../utils';

const buildHeaders = (token: string) => ({
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
  },
});

const request = async (token: string, pathUrl: string) => {
  const url = pathUrl.startsWith('http') ? pathUrl : `${config.github.baseUrl}${pathUrl}`;
  const result = await fetch(url, buildHeaders(token));
  return result.json();
};

type GithubOrganization = {
  id: string;
  login: string;
};

const getOrganizations = async (token: string): Promise<TournamentOrganization[]> => {
  const organizations = await request(token, '/user/orgs');
  return organizations.map((org: GithubOrganization) => ({
    id: org.id,
    name: org.login,
  }));
};

type GithubProject = {
  id: string;
  name: string;
};

const getProjects = async (token: string, orgId: string): Promise<TournamentProject[]> => {
  const projects = await request(token, `/orgs/${orgId}/repos`);
  return projects.map((project: GithubProject) => ({
    id: project.id,
    name: project.name,
  }));
};

const getMembers = async (token: string, projectIds: string[]) => {
  const requests = projectIds.map((id: string) => {
    return request(token, `/repos/KanaryTM/${id}/collaborators`);
  });

  const uniqueMembers: Record<string, TournamentUser> = {};
  const results = await Promise.all(requests);

  results
    .filter((r) => !!r?.length)
    .flat(2)
    .map((m) => ({ id: m.id, name: m.login, avatarUrl: m.avatar_url }))
    .forEach((member) => (uniqueMembers[member.id] = member));

  return Array.from(Object.values(uniqueMembers));
};

export const getProjectEvents = async (
  token: string,
  organization: string,
  projectId: string
): Promise<TournamentApprovalEvent[]> => {
  const url = `/repos/${organization}/${projectId}/pulls`;
  const pullRequests: GithubPullRequest[] = await request(token, url);

  const approversByPullRequest: TournamentUser[][] = await Promise.all(
    pullRequests.map((pr) => getPullRequestApprovers(token, pr.url))
  );

  return approversByPullRequest.flat(1).map((approver) => ({
    author: approver,
  }));
};

type GithubUser = {
  id: number;
  login: string;
  avatar_url: string;
};

type GithubPullRequest = {
  number: number;
  url: string;
  state: 'open' | 'closed';
};

type GithubPrEvent = {
  state: 'APPROVED' | 'COMMENTED';
  user: GithubUser;
  submitted_at: string;
};

const getPullRequestApprovers = async (token: string, pullUrl: string) => {
  const events: GithubPrEvent[] = await request(token, `${pullUrl}/reviews`);
  const tournamentStart = new Date(get15DaysBefore()).getTime();
  const approvers: Record<string, TournamentUser> = {};

  events.map((e) => {
    if (e.state === 'APPROVED' && e.user && e.user.login) {
      const eventSubmission = new Date(e.submitted_at).getTime();
      if (eventSubmission >= tournamentStart) {
        approvers[e.user.login] = {
          id: e.user.id,
          name: e.user.login,
          avatarUrl: e.user?.avatar_url,
        };
      }
    }
  });

  return Object.values(approvers);
};

export { getOrganizations, getProjects, getMembers };
