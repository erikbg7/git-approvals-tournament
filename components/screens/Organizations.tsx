import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Button, Heading, VStack } from '@chakra-ui/react';
import type { TournamentOrganization } from '../../models/tournament';
import { QueryParams } from '../../models/tournament';

const Organizations = ({ organizations }: { organizations: TournamentOrganization[] }) => {
  const { pathname, query } = useRouter();
  const { provider } = query as QueryParams;

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
      <Heading as={'h2'} size={'md'} color={'whiteAlpha.700'}>
        Choose an organization to participate in the tournament
      </Heading>
      <br />
      {organizations.map((organization) => (
        <Link
          key={organization.id}
          href={{ pathname, query: { provider, organization: organization.id } }}
        >
          <Button p={10} color={'#fc6d26'} fontSize={'xl'} fontWeight={'bold'}>
            {organization.name}
          </Button>
        </Link>
      ))}
    </VStack>
  );
};

export { Organizations };
