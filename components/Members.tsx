import React from 'react';
import { useRouter } from 'next/router';
import { GitlabUser } from '../services/gitlab-api';
import { Heading, VStack } from '@chakra-ui/react';
import Link from 'next/link';

const Members = ({ members }: { members: GitlabUser[] }) => {
  const { pathname } = useRouter();
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);

  return (
    <VStack>
      <Heading as={'h1'}>Members</Heading>
      {members.map((member) => (
        <Link key={member.id} href={{ pathname }}>
          <a>{member.name}</a>
        </Link>
      ))}
    </VStack>
  );
};

export { Members };
