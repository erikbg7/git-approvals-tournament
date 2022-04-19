export type GitlabGroup = {
  id: number;
  name: string;
};

export type GitlabProject = {
  id: number;
  name: string;
};

export type GitlabUser = {
  id: number;
  name: string;
};

export type GitlabApprovalEvent = {
  author: GitlabUser;
};
