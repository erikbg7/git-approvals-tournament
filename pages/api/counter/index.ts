// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { TournamentProvider, TournamentUser } from '../../../models/tournament';
import { getProjectEvents } from '../../../services/github-api';
import { getProjectEvents as getGitlabProjectEvents } from '../../../services/gitlab-api';

import { getToken, JWT } from 'next-auth/jwt';
import { PROVIDERS } from '../../../models/tournament';

type UserWithApprovals = { name: string; approvals: number };
type ApprovalsByUser = { approvalsByUser: UserWithApprovals[] };

const countGithubApprovals = async (req: NextApiRequest, token: JWT) => {
  const contestants: string[] = req.body?.members || [];
  const organization: string = req.body?.organization || '';
  const projectIds: string[] = req.body?.projects || [];

  let usersWithApprovals: Record<string, UserWithApprovals> = {};
  let contestantsIds: string[] = [...contestants];

  const requests = projectIds.map((projectId) =>
    getProjectEvents(token!.accessToken as string, organization, projectId)
  );

  const approversByProject = await Promise.all(requests);
  const approvers = approversByProject.flat();

  approvers.forEach((approver) => {
    const { author } = approver;

    if (contestantsIds.includes(author.id.toString())) {
      const approvals = usersWithApprovals[author?.name]?.approvals || 0;
      usersWithApprovals[author.name] = {
        name: author.name,
        approvals: approvals + 1,
      };
    }
  });

  return Array.from(Object.values(usersWithApprovals));
};

const countGitlabApprovals = async (req: NextApiRequest, token: JWT) => {
  const contestants: TournamentUser[] = req.body?.members || [];
  const projectIds: string[] = req.body?.projects || [];

  let usersWithApprovals: Record<string, UserWithApprovals> = {};
  let contestantsIds: string[] = [];

  contestants.forEach((contestant) => {
    contestantsIds.push(contestant.id.toString());
    usersWithApprovals[contestant.id.toString()] = { ...contestant, approvals: 0 };
  });

  const requests = projectIds.map((projectId) =>
    getGitlabProjectEvents(token.accessToken as string, projectId)
  );

  const eventsByProject = await Promise.all(requests);
  const events = eventsByProject.flat();

  events.forEach((event) => {
    const { author } = event;
    if (contestantsIds.includes(author.id.toString())) {
      const approvals = usersWithApprovals[author.id.toString()].approvals;
      usersWithApprovals[author.id.toString()].approvals = approvals + 1;
    }
  });

  return Array.from(Object.values(usersWithApprovals));
};

const COUNTING_ACTIONS = {
  [PROVIDERS.GITHUB]: countGithubApprovals,
  [PROVIDERS.GITLAB]: countGitlabApprovals,
};
const handler = async (req: NextApiRequest, res: NextApiResponse<ApprovalsByUser>) => {
  const token = await getToken({ req });
  const isValidSession = token && token.accessToken;

  if (isValidSession) {
    const provider = req.body?.provider as TournamentProvider;
    const approvalsByUser = await COUNTING_ACTIONS[provider](req, token);
    res.status(200).json({ approvalsByUser });
  }
};

export default handler;
