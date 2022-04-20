import { GitlabUser } from './gitlab';

export type QueryParams = {
  organization?: string;
  projects?: string;
  error?: string;
  results?: string;
};

export type UserWithApprovals = {
  approvals: number;
} & GitlabUser;
