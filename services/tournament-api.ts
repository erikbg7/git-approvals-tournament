import type { GitlabUser } from '../models/gitlab';
import type {
  TournamentOrganization,
  TournamentProject,
  TournamentUser,
  UserWithApprovals,
} from '../models/tournament';
import type { JWT } from 'next-auth/jwt';
import * as gitlabApi from './gitlab-api';
import * as githubApi from './github-api';

type TournamentClientConfig = {
  provider: 'gitlab' | 'github';
  token: JWT | null;
};

type TournamentClient = {
  isSessionActive: boolean;
  getOrganizations(): Promise<TournamentOrganization[]>;
  getProjects(organizationId: string): Promise<TournamentProject[]>;
  getMembers(projectsIds: string[]): Promise<TournamentUser[]>;
};

const PROVIDER_API = {
  ['gitlab']: gitlabApi,
  ['github']: githubApi,
};

const createTournament = (config: TournamentClientConfig): TournamentClient => {
  const { provider, token } = config;
  const accessToken = token?.accessToken as string;

  const api = PROVIDER_API[provider];

  return {
    isSessionActive: !!accessToken,
    getOrganizations: () => api.getOrganizations(accessToken),
    getProjects: (organizationId) => api.getProjects(accessToken, organizationId),
    getMembers: (projectsIds) => api.getAllProjectsMembers(accessToken, projectsIds),
  };
};

const getApprovalsByUser = (
  members: GitlabUser[],
  projects: string[]
): Promise<UserWithApprovals[]> => {
  return fetch('/api/counter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projects, members }),
  })
    .then((res) => res.json())
    .then((data) => data?.approvalsByUser);
};

export { getApprovalsByUser, createTournament };
