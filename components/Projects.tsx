import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Box, Button, Heading, VStack } from '@chakra-ui/react';
import type { GitlabProject } from '../models/gitlab';

type AvatarProps = {
  color?: string;
  iconFallback?: React.ReactNode;
  iconName: string;
  iconSize?: number;
  onClick: Function;
};

const Projects = ({ projects }: { projects: GitlabProject[] }) => {
  const { pathname, query } = useRouter();
  const [projectsIds, setProjectsIds] = React.useState<string[]>([]);

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
      <Heading as={'h2'} size={'md'}>
        Select the projects from which to read the approvals:
      </Heading>

      {projects.map((project) => (
        <Button
          disabled={projectsIds.includes(project.id.toString())}
          onClick={() => setProjectsIds((ids) => [...ids, project.id.toString()])}
        >
          {project.name}
        </Button>
      ))}
      <Link
        href={{
          pathname,
          query: { organization: query.organization, projects: projectsIds.join(',') },
        }}
      >
        <Button disabled={!projectsIds.length} colorScheme={'blue'} variant={'outline'}>
          Done!
        </Button>
      </Link>
    </VStack>
  );
};

export { Projects };
