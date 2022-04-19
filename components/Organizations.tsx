import React from 'react';
import { useRouter } from 'next/router';
import { GitlabGroup } from '../services/gitlab-api';
import { Heading, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Organizations = ({ organizations }: { organizations: GitlabGroup[] }) => {
  const { pathname } = useRouter();

  return (
    <VStack
      as={motion.div}
      justifyContent={'center'}
      height={'100vh'}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      // @ts-ignore
      transition={{ duration: 0.8, delay: 300 }}
    >
      <Heading as={'h1'}>Organizations</Heading>
      <Heading as={'h2'} size={'md'}>
        Choose and organization to participate in the tournament
      </Heading>
      {organizations.map((organization) => (
        <Link href={{ pathname, query: { organization: organization.id } }}>
          <a>{organization.name}</a>
        </Link>
      ))}
    </VStack>
  );
};

export { Organizations };
