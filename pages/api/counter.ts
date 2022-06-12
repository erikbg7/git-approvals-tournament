// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { TournamentUser } from '../../models/tournament';
import { getProjectEvents } from '../../services/gitlab-api';
import { getToken } from 'next-auth/jwt';

type UserWithApprovals = TournamentUser & { approvals: number };
type ApprovalsByUser = { approvalsByUser: UserWithApprovals[] };

const handler = async (req: NextApiRequest, res: NextApiResponse<ApprovalsByUser>) => {
  const token = await getToken({ req });
  const isValidSession = token && token.accessToken;

  const contestants: TournamentUser[] = req.body?.members || [];
  const projectIds: string[] = req.body?.projects || [];

  let usersWithApprovals: Record<string, UserWithApprovals> = {};
  let contestantsIds: string[] = [];

  contestants.forEach((contestant) => {
    contestantsIds.push(contestant.id.toString());
    usersWithApprovals[contestant.id.toString()] = { ...contestant, approvals: 0 };
  });

  if (isValidSession) {
    const requests = projectIds.map((projectId) =>
      getProjectEvents(token.accessToken as string, projectId)
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
  }

  const approvalsByUser = Array.from(Object.values(usersWithApprovals));
  res.status(200).json({ approvalsByUser });
};

export default handler;
