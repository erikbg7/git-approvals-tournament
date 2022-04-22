import type { GitlabGroup, GitlabUser, GitlabProject, GitlabApprovalEvent } from '../models/gitlab';

const getOptions = (token: string) => ({
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

const BASE_URL = 'https://gitlab.com/api/v4';
const fetcher = (token: string, pathUrl: string) =>
  fetch(BASE_URL.concat(pathUrl), getOptions(token)).then((res) => res.json());

export const getOrganizations = async (token: string): Promise<GitlabGroup[]> => {
  const groups = await fetcher(token, '/groups');
  if (groups?.error) {
    throw new Error(groups.error);
  }
  return groups.map((group: GitlabGroup) => ({ id: group.id, name: group.name }));
};

export async function getProjects(token: string, groupId: string): Promise<GitlabProject[]> {
  const projects = await fetcher(token, `/groups/${groupId}/projects`);
  return projects.map((project: GitlabProject) => ({ id: project.id, name: project.name }));
}

export const getAllProjectsMembers = async (token: string, projectIds: string[]) => {
  const membersRequests = projectIds.map(async (id: string) => {
    return fetcher(token, `/projects/${id}/members`);
  });

  let tournamentContestants: Record<string, GitlabUser> = {};
  const members = await Promise.all(membersRequests);

  const allProjectsMembers = members.flat(2);

  console.warn({ allProjectsMembers });
  if (allProjectsMembers?.[0]?.error) {
    throw new Error('token expired');
  }

  allProjectsMembers.forEach((member: GitlabUser) => {
    tournamentContestants[member.id] = member;
  });

  return Object.values(tournamentContestants);
};

export const getProjectEvents = async (
  token: string,
  projectId: string
): Promise<GitlabApprovalEvent[]> => {
  const date = get15DaysBefore();
  const events = await fetcher(
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
