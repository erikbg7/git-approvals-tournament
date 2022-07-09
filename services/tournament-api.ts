import * as gitlabApi from './gitlab-api';
import * as githubApi from './github-api';
import { PROVIDERS } from '../models/tournament';

import type { JWT } from 'next-auth/jwt';
import type {
  TournamentOrganization,
  TournamentProject,
  TournamentProvider,
  TournamentUser,
  UserWithApprovals,
} from '../models/tournament';

type TournamentClientConfig = {
  provider: TournamentProvider;
  token: JWT | null;
};

type TournamentClient = {
  isSessionActive: boolean;
  getOrganizations(): Promise<TournamentOrganization[]>;
  getProjects(organizationId: string): Promise<TournamentProject[]>;
  getMembers(projectsIds: string[]): Promise<TournamentUser[]>;
};

const PROVIDER_API = {
  [PROVIDERS.GITLAB]: gitlabApi,
  [PROVIDERS.GITHUB]: githubApi,
};

// Maybe we should pass the params here as well to simplify the getServerSideProps function
// We are, in fact, not creating a tournament and reusing it, but creating a new one every time a page is rendered
const createTournament = (config: TournamentClientConfig): TournamentClient => {
  const { provider, token } = config;
  const accessToken = token?.accessToken as string;

  const api = PROVIDER_API[provider];

  return {
    isSessionActive: !!accessToken,
    getOrganizations: () => api.getOrganizations(accessToken),
    getProjects: (organizationId) => api.getProjects(accessToken, organizationId),
    getMembers: (projectsIds) => api.getMembers(accessToken, projectsIds),
  };
};

const getApprovalsByUser = (
  members: TournamentUser[],
  projects: string[],
  organization: string
): Promise<UserWithApprovals[]> => {
  return fetch('/api/counter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projects, members, organization }),
  })
    .then((res) => res.json())
    .then((data) => data?.approvalsByUser);
};

export { getApprovalsByUser, createTournament };
