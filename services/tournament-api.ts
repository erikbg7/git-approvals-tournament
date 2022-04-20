import type { GitlabUser } from '../models/gitlab';
import type { UserWithApprovals } from '../models/tournament';

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
