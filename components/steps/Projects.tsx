import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { PROVIDERS } from '../../models/tournament';
import type { TournamentProject } from '../../models/tournament';
import ProjectCard from '../cards/ProjectCard';
import { MotionLinkButton } from '../MotionLinkButton';

const Projects = ({ projects }: { projects: TournamentProject[] }) => {
  const { pathname, query } = useRouter();
  const [chosenProjects, setChosenProjects] = useState<TournamentProject[]>([]);

  const { provider } = query;
  const projectsQuery =
    provider === PROVIDERS.GITLAB
      ? projects.map((p) => p.id).join(',')
      : projects.map((p) => p.name).join(',');

  const isDisabled = (projectId: number) => !!chosenProjects.find((p) => p.id === projectId);

  const handleChosenProject = useCallback((project: TournamentProject) => {
    setChosenProjects((prev) => [...prev, project]);
  }, []);

  return (
    <>
      {projects.map((project) => (
        <ProjectCard
          id={project.id}
          disabled={isDisabled(project.id)}
          onClick={handleChosenProject}
          name={project.name}
        />
      ))}
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
