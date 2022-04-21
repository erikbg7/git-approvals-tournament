import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Text, Heading, VStack, Box } from '@chakra-ui/react';
import type { GitlabUser } from '../models/gitlab';

type Props = {
  members: GitlabUser[];
  onTournamentStart(members: GitlabUser[]): void;
};

const Members = ({ members, onTournamentStart }: Props) => {
  const { pathname, query } = useRouter();
  const [selectedMembers, setSelectedMembers] = React.useState<GitlabUser[]>([]);

  const handleSelectedMember = (member: GitlabUser) => () => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  return (
    <VStack
      as={motion.div}
      justifyContent={'center'}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
    >
      <Heading as={'h1'}>Members</Heading>
      <Heading as={'h2'} size={'md'} color={'whiteAlpha.700'}>
        Select the tournament participants:
      </Heading>
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
            pathname,
            query: { organization: query.organization, projects: query.projects, results: true },
          }}
        >
          <Button
            as={motion.div}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            // @ts-ignore
            transition={{ duration: 0.1 }}
            // transition={{ duration: 0.5 }}
            padding={4}
            width={'50%'}
            onClick={() => onTournamentStart(selectedMembers)}
            color={'#fc6d26'}
            borderColor={'#fc6d26'}
            variant={'outline'}
          >
            Start approvals counting
          </Button>
        </Link>
      )}
    </VStack>
  );
};

export { Members };
