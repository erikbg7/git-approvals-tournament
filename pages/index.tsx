import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Button, Text, Flex, Heading, VStack } from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getOrganizations, getProjects, GitlabProject } from '../services/gitlab-api';

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [projects, setProjects] = React.useState<GitlabProject[]>([]);

  //@ts-ignore
  const { accessToken } = session || {};

  // useEffect(() => {
  //   (async () => {
  //     if (status === 'authenticated' && accessToken) {
  //       const gitlabOrganizations = await getOrganizations(accessToken);
  //       const gitlabProjects = await getProjects(accessToken, gitlabOrganizations[0]);
  //       setProjects(gitlabProjects);
  //     }
  //   })();
  // }, [status, accessToken]);

  if (status === 'authenticated' && projects.length) {
    return (
      <div>
        {projects.map((p) => (
          <Text>{p.name}</Text>
        ))}
      </div>
    );
  }

  return (
    <Flex h={'100vh'} w={'100vw'} justifyContent={'center'}>
      <VStack>
        <Heading as={'h1'}>
          <Text>Welcome to the Gitalb</Text>
          <Text>approvers tournament</Text>
        </Heading>
        <Button onClick={() => signIn('gitlab')}>Sign in</Button>
      </VStack>
    </Flex>
  );
};

export default Home;
