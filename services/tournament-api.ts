import type { GitlabUser, UserWithApprovals } from '../models';

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

export { getApprovalsByUser };
