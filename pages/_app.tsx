import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ProgressBar } from '../components/layout/ProgressBar';
import { NavBar } from '../components/layout/NavBar';

const colors = {
  base: {
    primary: '#9147FF',
    primaryLight: '#9C64EF',
  },
};

const config = {
  initialColorMode: 'dark',
};

const shadows = {
  outline: 'none',
};

const styles = {
  global: {
    body: {
      bg: '#0e0e10',
    },
    colorScheme: {
      purple: {
        bg: '#0e0e10',
        color: '#9147FF',
      },
    },
  },
};

const theme = extendTheme({ colors, config, styles, shadows });

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider resetCSS theme={theme}>
        <ProgressBar />
        <NavBar>
          <Component {...pageProps} />
        </NavBar>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
