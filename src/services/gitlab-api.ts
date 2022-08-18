import { config } from '../config';
import type {
  TournamentOrganization,
  TournamentProject,
  TournamentUser,
} from '../models/tournament';
import { get15DaysBefore } from '../utils';

const buildHeaders = (token: string) => ({
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

const request = async (token: string, pathUrl: string) => {
  const url = `${config.gitlab.baseUrl}${pathUrl}`;
  const result = await fetch(url, buildHeaders(token));
  return result.json();
};

type GitlabOrganization = {
  id: number;
  name: string;
};

const getOrganizations = async (token: string): Promise<TournamentOrganization[]> => {
  const organizations = await request(token, '/groups');
  return organizations.map((org: GitlabOrganization) => ({
    id: org.id,
    name: org.name,
  }));
};

type GitlabProject = {
  id: string;
  name: string;
};

const getProjects = async (token: string, orgId: string): Promise<TournamentProject[]> => {
  const projects = await request(token, `/groups/${orgId}/projects`);
  return projects.map((project: GitlabProject) => ({
    id: project.id,
    name: project.name,
  }));
};

const getMembers = async (token: string, projectIds: string[]) => {
  const requests = projectIds.map((id: string) => {
    return request(token, `/projects/${id}/members`);
  });

  const uniqueMembers: Record<string, TournamentUser> = {};
  const results = await Promise.all(requests);

  results
    .filter((r) => !!r?.length)
    .flat(2)
    .map((m) => ({ id: m.id, name: m.name, avatarUrl: m.avatar_url }))
    .forEach((member) => (uniqueMembers[member.id] = member));

  return Array.from(Object.values(uniqueMembers));
};

type GitlabProjectEvent = {
  author: { id: number; name: string; username: string; avatar_url: string };
};

export const getProjectEvents = async (
  token: string,
  projectId: string
): Promise<GitlabProjectEvent[]> => {
  const date = get15DaysBefore();
  const events = await request(
    token,
    `/projects/${projectId}/events?action=approved&after=${date}&per_page=100`
  );

  return events;
};

export { getOrganizations, getProjects, getMembers };
