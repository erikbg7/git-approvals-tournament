import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Heading, VStack, Text } from '@chakra-ui/react';
import type { GitlabGroup } from '../models/gitlab';

const Organizations = ({ organizations }: { organizations: GitlabGroup[] }) => {
  const { pathname } = useRouter();

  return (
    <VStack
      as={motion.div}
      justifyContent={'center'}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      // @ts-ignore
      transition={{ duration: 0.8, delay: 300 }}
    >
      <Heading as={'h1'}>Organizations</Heading>
      <Heading as={'h2'} size={'md'}>
        Choose an organization to participate in the tournament
      </Heading>
      {organizations.map((organization) => (
        <Link key={organization.id} href={{ pathname, query: { organization: organization.id } }}>
          <Text as={'a'} color={'blue.400'} fontSize={'xl'}>
            {organization.name}
          </Text>
        </Link>
      ))}
    </VStack>
  );
};

export { Organizations };
