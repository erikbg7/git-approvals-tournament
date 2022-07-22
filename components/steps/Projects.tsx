import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { TournamentProvider } from '../../models/tournament';
import type { TournamentProject } from '../../models/tournament';
import ProjectCard from '../cards/ProjectCard';
import { MotionLinkButton } from '../MotionLinkButton';
import { Box } from '@chakra-ui/react';
import { getProjectsParam } from '../../utils/url';

const Projects = ({ projects }: { projects: TournamentProject[] }) => {
  const { pathname, query } = useRouter();
  const [chosenProjects, setChosenProjects] = useState<TournamentProject[]>([]);

  const provider = query.provider as TournamentProvider;
  const projectsQuery = getProjectsParam(chosenProjects, provider);

  const isDisabled = (projectId: number) => {
    return !!chosenProjects.find((p) => p.id === projectId);
  };

  const handleChosenProject = useCallback((project: TournamentProject) => {
    setChosenProjects((prev) => [...prev, project]);
  }, []);

  return (
    <>
      <Box my={10} textAlign={'center'}>
        {projects.map((project) => (
          <ProjectCard
            id={project.id}
            name={project.name}
            disabled={isDisabled(project.id)}
            onClick={handleChosenProject}
          />
        ))}
      </Box>
      {!!chosenProjects.length && (
        <MotionLinkButton
          text={'Done!'}
          href={{
            pathname,
            query: { ...query, projects: projectsQuery },
          }}
        />
      )}
    </>
  );
};

export { Projects };
