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

const getOrganizations = async (token: string): Promise<TournamentOrganization[]> => {
  const organizations = await request(token, '/groups');
  if (organizations?.error) {
    throw new Error(organizations.error);
  }
  return organizations.map((org: TournamentOrganization) => ({
    id: org.id,
    name: org.name,
  }));
};

const getProjects = async (token: string, groupId: string): Promise<TournamentProject[]> => {
  const projects = await request(token, `/groups/${groupId}/projects`);
  return projects.map((project: TournamentProject) => ({
    id: project.id,
    name: project.name,
  }));
};

const getMembers = async (token: string, projectIds: string[]) => {
  const requests = projectIds.map((id: string) => {
    return request(token, `/projects/${id}/members`);
  });

  const membersByProject = await Promise.all(requests);
  const members = membersByProject.flat(2);

  if (members?.[0]?.error) {
    throw new Error('token expired');
  }

  let membersSet: Record<string, TournamentUser> = {};
  members
    .map((m) => ({ name: m.name, id: m.id, avatarUrl: m.avatar_url }))
    .forEach((member: TournamentUser) => (membersSet[member.id] = member));

  return Array.from(Object.values(membersSet));
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
