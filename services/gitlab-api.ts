export type GitlabGroup = { id: number; name: string };

export type GitlabProject = { id: number; name: string };

export type GitlabUser = { id: number; name: string };

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
  return groups.map((group: GitlabGroup) => ({
    id: group.id,
    name: group.name,
  }));
};

export async function getProjects(token: string, groupId: number): Promise<GitlabProject[]> {
  const projects = await fetcher(token, `/groups/${groupId}/projects`);
  return projects.map((project: GitlabProject) => ({
    id: project.id,
    name: project.name,
  }));
}

export const getAllProjectsMembers = async (token: string, projectIds: string[]) => {
  const membersRequests = projectIds.map(async (id: string) => {
    return fetcher(token, `/projects/${id}/members`);
  });

  let tournamentContestants: Record<string, GitlabUser> = {};
  const members = await Promise.all(membersRequests);

  console.warn({ members });

  // members[0].push({ id: 9999999999, name: 'test1' });
  // members[1].push({ id: 8888888888, name: 'test2' });

  const allProjectsMembers = members.flat(2);

  allProjectsMembers.forEach((member: GitlabUser) => {
    tournamentContestants[member.id] = member;
  });

  return Object.values(tournamentContestants);
};

export const getProjectEvents = async (token: string, projectId: string) => {
  const events = await fetcher(token, `/projects/${projectId}/events?action=approved`);
  return events;
};
