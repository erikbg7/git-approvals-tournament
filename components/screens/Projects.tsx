import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Button, Heading, VStack } from '@chakra-ui/react';
import type { GitlabProject } from '../../models/gitlab';

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
      <Heading as={'h2'} size={'md'} color={'whiteAlpha.700'}>
        Select the projects from which to read the approvals:
      </Heading>
      <br />
      {projects.map((project) => (
        <Button
          key={project.id}
          disabled={projectsIds.includes(project.id.toString())}
          onClick={() => setProjectsIds((ids) => [...ids, project.id.toString()])}
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
      {!!projectsIds.length && (
        <Link
          href={{
            pathname,
            query: { organization: query.organization, projects: projectsIds.join(',') },
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
            disabled={!projectsIds.length}
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

export { Projects };
