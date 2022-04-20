import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

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
      onClick={() => signIn('gitlab', { callbackUrl: '/tournament' })}
    >
      Sign In with Gitlab
    </Button>
  );
};

const ClipLogo = () => {
  return (
    <svg width="42" height="42" className="tanuki-logo" viewBox="0 0 36 36">
      <path
        className="tanuki-shape tanuki-left-ear"
        fill="#e24329"
        d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"
      />
      <path
        className="tanuki-shape tanuki-right-ear"
        fill="#e24329"
        d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"
      />
      <path className="tanuki-shape tanuki-nose" fill="#e24329" d="M18,34.38 3,14 33,14 Z" />
      <path
        className="tanuki-shape tanuki-left-eye"
        fill="#fc6d26"
        d="M18,34.38 11.38,14 2,14 6,25Z"
      />
      <path
        className="tanuki-shape tanuki-right-eye"
        fill="#fc6d26"
        d="M18,34.38 24.62,14 34,14 30,25Z"
      />
      <path
        className="tanuki-shape tanuki-left-cheek"
        fill="#fca326"
        d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"
      />
      <path
        className="tanuki-shape tanuki-right-cheek"
        fill="#fca326"
        d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"
      />
    </svg>
  );
};

const NavBar = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={'#18181b'} color={'#EFEFF1'} px={4}>
        <Flex h={16} maxW={'7xl'} m={'auto'} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <NextLink href={'/'}>
              <Box>
                <ClipLogo />
              </Box>
            </NextLink>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link as={'a'}> by Erik Blanca </Link>
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <NavSignButton />
          </Flex>
        </Flex>
      </Box>

      {children}
    </>
  );
};

export { NavBar };
