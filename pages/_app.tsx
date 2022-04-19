import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
import { ProgressBar } from '../components/ProgressBar';

const colors = {
  base: {
    primary: '#9147FF',
    primaryLight: '#9C64EF',
  },
};

const config = {
  initialColorMode: 'dark',
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

const theme = extendTheme({ colors, config, styles });

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider resetCSS theme={theme}>
        <ProgressBar />
        <AnimatePresence exitBeforeEnter initial={true}>
          <Component {...pageProps} />
        </AnimatePresence>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
