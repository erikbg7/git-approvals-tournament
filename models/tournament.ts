import { GitlabUser } from './gitlab';

export type QueryParams = {
  organization?: string;
  projects?: string;
  error?: string;
};

export type UserWithApprovals = {
  approvals: number;
} & GitlabUser;
