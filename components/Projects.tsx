import React from 'react';
import { useRouter } from 'next/router';
import { GitlabProject } from '../services/gitlab-api';
import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

const Projects = ({ projects }: { projects: GitlabProject[] }) => {
  const { pathname, query } = useRouter();
  const [projectsIds, setProjectsIds] = React.useState<string[]>([]);

  return (
    <VStack>
      <Heading as={'h1'}>Projects</Heading>
      {projects.map((project) => (
        <Button onClick={() => setProjectsIds((ids) => [...ids, project.id.toString()])}>
          {project.name}
        </Button>
      ))}
      <Link
        href={{
          pathname,
          query: { organization: query.organization, projects: projectsIds.join(',') },
        }}
      >
        <a>Select Contestants</a>
      </Link>
      <Text>{projectsIds.join(',') || 'no projects selected'}</Text>
    </VStack>
  );
};

export { Projects };
