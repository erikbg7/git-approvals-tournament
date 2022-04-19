import React from 'react';
import type { NextPage } from 'next';
import { Button, Text, Flex, Heading, VStack, HStack } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

const Home: NextPage = () => {
  return (
    <Flex h={'100vh'} w={'100vw'} justifyContent={'center'}>
      <VStack>
        <HStack>
          <Text as={'p'} fontSize={'7xl'}>
            🏆
          </Text>
          <Heading as={'h1'}>
            <Text>Welcome to the Gitalb</Text>
            <Text>approvers tournament</Text>
          </Heading>
          <Text as={'p'} fontSize={'7xl'}>
            🏆
          </Text>
        </HStack>
        <Button onClick={() => signIn('gitlab', { callbackUrl: '/tournament' })}>
          Sign in with Gitlab
        </Button>
        <Heading as={'h2'} size={'md'}>
          What is this?
        </Heading>
        <Text>
          This is a minigame from the company that aims to increase the motivation of the team to
          review the open PRs.
        </Text>
        <Text>
          In order to achieve it, we will check who is the member of the team that approves and code
          reviews less, and find a funny punishment for him or her.
        </Text>
      </VStack>
    </Flex>
  );
};

export default Home;
