import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Button, Heading, VStack } from '@chakra-ui/react';

import { PROVIDERS } from '../../models/tournament';
import type { QueryParams, TournamentProject, TournamentProvider } from '../../models/tournament';

const Projects = ({ projects }: { projects: TournamentProject[] }) => {
  const { pathname, query } = useRouter();
  const { provider } = query;

  const [chosenProjects, setChosenProjects] = React.useState<TournamentProject[]>([]);

  return (
    <VStack
      as={motion.div}
      justifyContent={'center'}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      // @ts-ignore
      transition={{ duration: 2.5 }}
      // transition={{ duration: 5.8, delay: 2000 }}
    >
      <Heading as={'h1'}>Projects</Heading>
      <Heading as={'h2'} size={'md'} color={'whiteAlpha.700'}>
        Select the projects from which to read the approvals:
      </Heading>
      <br />
      {projects.map((project) => (
        <Button
          key={project.id}
          disabled={!!chosenProjects.find((p) => p.id === project.id)}
          onClick={() => setChosenProjects((p) => [...p, project])}
          p={5}
          width={'80%'}
          color={'#fc6d26'}
          fontSize={'xl'}
          fontWeight={'bold'}
        >
          {project.name}
        </Button>
      ))}
      <br />
      {!!chosenProjects.length && (
        <Link
          href={{
            pathname,
            query: buildQuery(provider as TournamentProvider, query as QueryParams, chosenProjects),
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
            disabled={!chosenProjects.length}
            color={'#fc6d26'}
            borderColor={'#fc6d26'}
            variant={'outline'}
          >
            Done!
          </Button>
        </Link>
      )}
    </VStack>
  );
};

const buildQuery = (
  provider: TournamentProvider,
  query: QueryParams,
  projects: TournamentProject[]
): QueryParams => {
  return {
    provider,
    organization: query?.organization,
    projects:
      provider === PROVIDERS.GITLAB
        ? projects.map((p) => p.id).join(',')
        : projects.map((p) => p.name).join(','),
  };
};

export { Projects };
