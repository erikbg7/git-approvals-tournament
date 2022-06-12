export type TournamentOrganization = {
  id: number;
  name: string;
};

export type TournamentProject = {
  id: number;
  name: string;
};

export type TournamentUser = {
  id: number;
  name: string;
};

export type QueryParams = {
  provider: 'github' | 'gitlab';
  organization?: string;
  projects?: string;
  error?: string;
  results?: string;
};

export type UserWithApprovals = {
  approvals: number;
} & TournamentUser;

export type TournamentApprovalEvent = {
  author: TournamentUser;
};
