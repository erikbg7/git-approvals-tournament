import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
} from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AddIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import Image from 'next/image';

const NavSignButton = () => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  if (isLoading) {
    return null;
  }

  if (session) {
    const image = session?.user?.image;

    return (
      <Flex alignItems={'center'}>
        <Menu>
          <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
            minW={0}
            mx={4}
          >
            <Avatar
              ignoreFallback
              bg={'transparent'}
              size={'sm'}
              src={image || ''}
              color={'transparent'}
            />
          </MenuButton>
          <MenuList>
            <MenuItem>Settings</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <Button
      variant={'solid'}
      color={'white'}
      bgColor={'#fc6d26'}
      _hover={{ bgColor: '#e24329' }}
      size={'md'}
      mr={4}
      leftIcon={<AddIcon />}
      onClick={() => signIn('gitlab', { callbackUrl: '/tournament/gitlab' })}
    >
      Sign In with Gitlab
    </Button>
  );
};

const NavBar = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minHeight={'100vh'}>
      <Box bg={'#18181b'} color={'#EFEFF1'} px={4}>
        <Flex h={16} maxW={'7xl'} m={'auto'} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <NextLink href={'/'}>
              <Box>
                <Image src="/logo.svg" alt="logo" width="44" height="44" />
              </Box>
            </NextLink>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link
                as={'a'}
                href={'https://www.linkedin.com/in/erik-blanca-gomez-32455a162/'}
                isExternal
              >
                by Erik Blanca
              </Link>
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <NavSignButton />
          </Flex>
        </Flex>
      </Box>

      {children}
    </Box>
  );
};

export { NavBar };
