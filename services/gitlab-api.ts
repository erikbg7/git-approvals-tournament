import { config } from '../config';
import type {
  TournamentOrganization,
  TournamentProject,
  TournamentUser,
  TournamentApprovalEvent,
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

const getAllProjectsMembers = async (token: string, projectIds: string[]) => {
  const membersRequests = projectIds.map((id: string) => {
    return request(token, `/projects/${id}/members`);
  });

  let tournamentContestants: Record<string, TournamentUser> = {};
  const members = await Promise.all(membersRequests);

  const allProjectsMembers = members.flat(2);

  console.warn({ allProjectsMembers });
  if (allProjectsMembers?.[0]?.error) {
    throw new Error('token expired');
  }

  allProjectsMembers.forEach((member: TournamentUser) => {
    tournamentContestants[member.id] = member;
  });

  const allMembers = Object.values(tournamentContestants);
  return Array.from(allMembers);
};

export const getProjectEvents = async (
  token: string,
  projectId: string
): Promise<TournamentApprovalEvent[]> => {
  const date = get15DaysBefore();
  const events = await request(
    token,
    `/projects/${projectId}/events?action=approved&after=${date}&per_page=100`
  );

  return events;
};

const getYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

const get15DaysBefore = () => {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() - 15);
  return getYYYYMMDD(newDate);
};

export { getOrganizations, getProjects, getAllProjectsMembers };
