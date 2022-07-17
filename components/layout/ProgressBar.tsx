import React, { useEffect, useState } from 'react';
import { Progress } from '@chakra-ui/react';
import Router from 'next/router';

const ProgressBar = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const start = () => setIsLoading(true);
    const end = () => setIsLoading(false);

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  if (isLoading) {
    return <Progress position={'absolute'} top={0} w={'100vw'} size="sm" isIndeterminate />;
  }

  return null;
};

export { ProgressBar };
