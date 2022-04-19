import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Button, Text, Heading, VStack } from '@chakra-ui/react';
import type { GitlabUser } from '../models/gitlab';

type Props = {
  members: GitlabUser[];
  onTournamentStart(members: GitlabUser[], projects: string[]): void;
};

const Members = ({ members, onTournamentStart }: Props) => {
  const { query } = useRouter();
  const [selectedMembers, setSelectedMembers] = React.useState<GitlabUser[]>([]);

  const projects = query.projects as string;
  const projectsIds = projects.split(',');

  const handleSelectedMember = (member: GitlabUser) => () => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  return (
    <VStack
      as={motion.div}
      justifyContent={'center'}
      transition="0.5s linear"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Heading as={'h1'}>Members</Heading>
      <Heading as={'h2'} size={'md'}>
        Select the tournament participants:
      </Heading>
      {members.map((member) => {
        const isSelected = !!selectedMembers.find((m) => m.id === member.id);

        return (
          <Button disabled={isSelected} key={member.id} onClick={handleSelectedMember(member)}>
            {member.name}
          </Button>
        );
      })}

      <Text>{selectedMembers.length} members selected</Text>

      <Button onClick={() => onTournamentStart(selectedMembers, projectsIds)}>
        Start approvals counting
      </Button>
    </VStack>
  );
};

export { Members };
