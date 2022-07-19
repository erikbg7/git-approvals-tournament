import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';

import { PROVIDERS } from '../../models/tournament';
import type { QueryParams, TournamentProject, TournamentProvider } from '../../models/tournament';
import { AnimatedStep } from '../layout/AnimatedStep';
import { STEP_CONFIG, STEPS } from './index';

const Projects = ({ projects }: { projects: TournamentProject[] }) => {
  const { pathname, query } = useRouter();
  const { provider } = query;
  const { title, subtitle } = STEP_CONFIG[STEPS.PROJECTS];

  const [chosenProjects, setChosenProjects] = React.useState<TournamentProject[]>([]);

  return (
    <>
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
        <Link href={{ pathname, query: nextQuery }}>
          <Button
            as={motion.div}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            // @ts-ignore
            transition={{ duration: 0.1 }}
            padding={4}
            width={'50%'}
            color={'#fc6d26'}
            borderColor={'#fc6d26'}
            variant={'outline'}
          >
            Done!
          </Button>
        </Link>
      )}
    </>
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
