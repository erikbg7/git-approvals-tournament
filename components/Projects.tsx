import React from 'react';
import { useRouter } from 'next/router';
import { GitlabProject } from '../services/gitlab-api';
import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Projects = ({ projects }: { projects: GitlabProject[] }) => {
  const { pathname, query } = useRouter();
  const [projectsIds, setProjectsIds] = React.useState<string[]>([]);

  return (
    <VStack
      as={motion.div}
      justifyContent={'center'}
      height={'100vh'}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      // @ts-ignore
      transition={{ duration: 2.5 }}
      // transition={{ duration: 5.8, delay: 2000 }}
    >
      <Heading as={'h1'}>Projects</Heading>
      <Heading as={'h2'} size={'md'}>
        Select the projects from which to read the approvals:
      </Heading>
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
