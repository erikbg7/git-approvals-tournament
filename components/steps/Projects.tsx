import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';

import { PROVIDERS } from '../../models/tournament';
import type { QueryParams, TournamentProject, TournamentProvider } from '../../models/tournament';
import ProjectCard from '../cards/ProjectCard';

const Projects = ({ projects }: { projects: TournamentProject[] }) => {
  const { pathname, query } = useRouter();
  const [chosenProjects, setChosenProjects] = useState<TournamentProject[]>([]);

  const { provider } = query;
  const nextQuery = buildQuery(
    provider as TournamentProvider,
    query as QueryParams,
    chosenProjects
  );

  const isDisabled = (projectId: number) => !!chosenProjects.find((p) => p.id === projectId);

  const handleChosenProject = useCallback((project: TournamentProject) => {
    setChosenProjects((prev) => [...prev, project]);
  }, []);

  return (
    <>
      <br />
      {projects.map((project) => (
        <ProjectCard
          id={project.id}
          disabled={isDisabled(project.id)}
          onClick={handleChosenProject}
          name={project.name}
        />
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
