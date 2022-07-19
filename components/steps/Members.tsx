import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Button, Box } from '@chakra-ui/react';
import type { TournamentUser } from '../../models/tournament';
import { AnimatedStep } from '../layout/AnimatedStep';
import { STEP_CONFIG, STEPS } from './index';

type Props = {
  members: TournamentUser[];
};

const Members = ({ members }: Props) => {
  const { query } = useRouter();
  const { provider } = query;
  const { title, subtitle } = STEP_CONFIG[STEPS.MEMBERS];

  const [selectedMembers, setSelectedMembers] = React.useState<TournamentUser[]>([]);

  const handleSelectedMember = (member: TournamentUser) => () => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  return (
    <>
      <br />
      <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} maxW={'xl'}>
        {members.map((member) => {
          const isSelected = !!selectedMembers.find((m) => m.id === member.id);

          return (
            <Button
              disabled={isSelected}
              key={member.id}
              onClick={handleSelectedMember(member)}
              m={1}
            >
              {member.name}
            </Button>
          );
        })}
      </Box>
      <br />
      {!!selectedMembers.length && (
        <Link
          href={{
            pathname: '/tournament/results',
            query: {
              provider,
              organization: query.organization,
              projects: query.projects,
              members: selectedMembers.map((m) => m.id).join(','),
            },
          }}
        >
          <Button
            as={motion.div}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            // @ts-ignore
            transition={{ duration: 0.1 }}
            padding={4}
            color={'#fc6d26'}
            borderColor={'#fc6d26'}
            variant={'outline'}
          >
            Start approvals counting
          </Button>
        </Link>
      )}
    </>
  );
};

export { Members };
