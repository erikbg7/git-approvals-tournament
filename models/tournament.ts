const PROVIDERS = {
  GITHUB: 'github',
  GITLAB: 'gitlab',
} as const;

type TournamentProvider = typeof PROVIDERS[keyof typeof PROVIDERS];

type TournamentOrganization = {
  id: number;
  name: string;
};

type TournamentProject = {
  id: number;
  name: string;
};

type TournamentUser = {
  id: number;
  name: string;
  avatarUrl?: string;
};

type QueryParams = {
  provider: TournamentProvider;
  organization?: string;
  projects?: string;
  error?: string;
};

type UserWithApprovals = {
  approvals: number;
} & TournamentUser;

type TournamentApprovalEvent = {
  author: TournamentUser;
};

export { PROVIDERS };
export type {
  QueryParams,
  TournamentApprovalEvent,
  TournamentOrganization,
  TournamentProject,
  TournamentProvider,
  TournamentUser,
  UserWithApprovals,
};
