import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';
import type { TournamentUser } from '../../models/tournament';
import MemberCard from '../cards/MemberCard';
import { MotionLinkButton } from '../MotionLinkButton';

type Props = {
  members: TournamentUser[];
};

const Members = ({ members }: Props) => {
  const { query } = useRouter();

  const [selectedMembers, setSelectedMembers] = React.useState<TournamentUser[]>([]);
  const membersString = selectedMembers.map((m) => m.id).join(',');

  const isSelected = (memberId: number) => !!selectedMembers.find((m) => m.id === memberId);

  const handleSelectedMember = useCallback((member: TournamentUser) => {
    setSelectedMembers((prev) => [...prev, member]);
  }, []);

  return (
    <>
      <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} maxW={'xl'}>
        {members.map((member) => (
          <MemberCard
            id={member.id}
            name={member.name}
            disabled={isSelected(member.id)}
            onClick={handleSelectedMember}
          />
        ))}
      </Box>
      {!!selectedMembers.length && (
        <MotionLinkButton
          text={'Start approvals counting'}
          href={{
            pathname: '/tournament/results',
            query: { ...query, members: membersString },
          }}
        />
      )}
    </>
  );
};

export { Members };
