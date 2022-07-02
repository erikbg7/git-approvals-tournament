import { config } from '../config';
import { TournamentApprovalEvent, TournamentProject, TournamentUser } from '../models/tournament';
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

const getOrganizations = async (token: string): Promise<any> => {
  const organizations = await request(token, '/user/orgs');
  return organizations.map((o = {} as any) => {
    if (o.id && o.login) {
      return { id: o.id, name: o.login };
    }
  });
};

const getProjects = async (token: string, groupId: string): Promise<any> => {
  const projects = await request(token, `/orgs/${groupId}/repos`);
  return projects.map((project: TournamentProject) => ({
    id: project.id,
    name: project.name,
  }));
};

const getMembers = async (token: string, projectIds: string[]) => {
  const requests = projectIds.map((id: string) => {
    return request(token, `/repos/KanaryTM/${id}/collaborators`);
  });

  const results = await Promise.all(requests);
  const members = results
    .filter((r) => !!r?.length)
    .flat(2)
    .map(getMemberFromGithubData) as TournamentUser[];

  let membersSet: Record<string, TournamentUser> = {};
  members.forEach((member) => (membersSet[member.id] = member));

  return Array.from(Object.values(membersSet));
};

const getMemberFromGithubData = (data: any): TournamentUser | void => {
  if (data?.id && data?.login) {
    return { id: data.id, name: data.login };
  }
};

export const getProjectEvents = async (token: string): Promise<TournamentApprovalEvent[]> => {
  // const events = await request(token, `/repos/KanaryTM/test-integration/pulls/1/reviews`);
  // const events = await request(token, `/repos/KanaryTM/${projectId}/events`);

  const pullRequests: GithubPullRequest[] = await request(
    token,
    `/repos/KanaryTM/test-integration/pulls`
  );

  console.log({ pullRequests });

  const pr = pullRequests[0];

  const approvers = await getPullRequestApprovers(token, pr.url);

  console.log({ approvers });

  // return events;

  // console.log({ events, l: events?.length });
  // console.log({ events: events[0].payload });
  // const a = events.map((e: any) => e?.actor?.login.concat('---').concat(e?.type));
  //
  // console.log({ a });

  // events.forEach((e: any) => console.log(e?.type));

  return [];
};

// /repos/{owner}/{repo}/events

// 'https://api.github.com/users/erikbg7/events{/privacy}',
//
// const url = 'https://api.github.com/search/repositories?q=user:erikbg7';
// const url = 'https://api.github.com/users/erikbg7/repos';
// const url = 'https://api.github.com/users/erikblanca/events';

// const url2 = 'https://api.github.com/orgs/'.concat(first.login, '/repos');
// const repos = await fetch(url2, getOptions(token)).then((res) => res.json());

type GithubUser = {
  id: number;
  login: string;
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
  const approvers: Record<string, string> = {};

  events.map((e) => {
    if (e.state === 'APPROVED' && e.user && e.user.login) {
      const eventSubmission = new Date(e.submitted_at).getTime();
      if (eventSubmission >= tournamentStart) {
        approvers[e.user.login] = e.user.login;
      }
    }
  });

  return Object.values(approvers);
};

export { getOrganizations, getProjects, getMembers };
