import React from 'react';
import { useRouter } from 'next/router';
import { GitlabGroup } from '../services/gitlab-api';
import { Heading, VStack } from '@chakra-ui/react';
import Link from 'next/link';

const Organizations = ({ organizations }: { organizations: GitlabGroup[] }) => {
  const { pathname } = useRouter();

  return (
    <VStack>
      <Heading as={'h1'}>Organizations</Heading>
      {organizations.map((organization) => (
        <Link href={{ pathname, query: { organization: organization.id } }}>
          <a>{organization.name}</a>
        </Link>
      ))}
    </VStack>
  );
};

export { Organizations };
