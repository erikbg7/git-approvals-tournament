import React from 'react';
import { useRouter } from 'next/router';
import { GitlabUser } from '../services/gitlab-api';
import { Button, Text, Heading, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Members = ({ members }: { members: GitlabUser[] }) => {
  const { pathname, query } = useRouter();
  const [selectedMembers, setSelectedMembers] = React.useState<GitlabUser[]>([]);

  const projects = query.projects as string;
  const projectsIds = projects.split(',');

  return (
    <VStack
      as={motion.div}
      justifyContent={'center'}
      height={'100vh'}
      transition="0.5s linear"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Heading as={'h1'}>Members</Heading>
      <Heading as={'h2'} size={'md'}>
        Select the tournament participants:
      </Heading>
      {members.map((member) => (
        <Button key={member.id} onClick={() => setSelectedMembers((prev) => [...prev, member])}>
          {member.name}
        </Button>
        // <Link key={member.id} href={{ pathname }}>
        //   <a>{member.name}</a>
        // </Link>
      ))}

      <Text>{selectedMembers.length} members selected</Text>

      <Button
        onClick={() => {
          console.warn({ selectedMembers });

          fetch('/api/counter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              projects: projectsIds,
              members: selectedMembers,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.warn({ data }));
        }}
      >
        Start approvals counting
      </Button>
    </VStack>
  );
};

export { Members };
