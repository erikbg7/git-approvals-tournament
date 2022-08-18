import React from 'react';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Box, Button, Heading, Icon, Text } from '@chakra-ui/react';
import { FaGithub, FaGitlab } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

const Landing = () => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      textAlign={'center'}
      py={5}
      px={3}
      maxW={'xl'}
      m={'auto'}
    >
      <Heading as={'h1'} size={'3xl'} lineHeight={1.1}>
        <Text display={'block'}>Make work a challenge</Text>
        <Text display={'block'} color={'#FF7300'}>
          with approval tournaments
        </Text>
      </Heading>
      <Text lineHeight={1.5} mt={5} color={'gray.300'}>
        Log in with your Github or Gitlab account, choose the tournament organization, projects and
        contestants. Your team love it!
      </Text>
      <Box display={'flex'} flexDirection={'column'} mt={8}>
        <Button
          size={'lg'}
          mb={3}
          onClick={() => signIn('github', { callbackUrl: '/tournament/github' })}
        >
          <Icon as={FaGithub} w={6} h={6} mr={2} />
          Sign in with Github
        </Button>
        <Button
          size={'lg'}
          mb={3}
          onClick={() => signIn('gitlab', { callbackUrl: '/tournament/gitlab' })}
        >
          <Icon as={FaGitlab} w={6} h={6} mr={2} />
          Sign in with Gitlab
        </Button>
      </Box>
    </Box>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Git Approvers Tournament"
        description="A tournament to count user approvals on Github and Gitlab repositories."
      />
      <Landing />
    </>
  );
};

export default Home;
