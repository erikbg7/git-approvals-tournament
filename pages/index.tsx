import React from 'react';
import type { NextPage } from 'next';
import { Button, Text, Heading, VStack, HStack } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

const Home: NextPage = () => {
  return (
    <VStack height={'100vh'} display={'flex'} alignItems={'center'} justifyContent={'start'} p={6}>
      <HStack my={10}>
        <Text as={'p'} fontSize={'7xl'}>
          🏆
        </Text>
        <Heading as={'h1'} textAlign={'center'}>
          <Text>Welcome to the Gitalb</Text>
          <Text>approvers tournament</Text>
        </Heading>
        <Text as={'p'} fontSize={'7xl'}>
          🏆
        </Text>
      </HStack>
      <VStack maxW={'2xl'} bgColor={'whiteAlpha.50'} p={6} borderRadius={8}>
        <Heading as={'h2'} size={'md'}>
          What is this?
        </Heading>
        <br />
        <Text fontSize={'lg'} color={'whiteAlpha.700'}>
          This is a minigame from the company that aims to increase the motivation of the team to
          review the open PRs.
        </Text>
        <Text fontSize={'lg'} color={'whiteAlpha.700'}>
          In order to achieve it, we will check who is the member of the team that approves and code
          reviews less, and find a funny punishment for him or her.
        </Text>
        <br />
        <Button
          variant={'outline'}
          borderColor={'#fc6d26'}
          onClick={() => signIn('gitlab', { callbackUrl: '/tournament/gitlab' })}
        >
          Sign in with Gitlab
        </Button>
      </VStack>
    </VStack>
  );
};

export default Home;
