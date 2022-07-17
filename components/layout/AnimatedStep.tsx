import React from 'react';
import { motion } from 'framer-motion';
import { Heading, VStack } from '@chakra-ui/react';

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const AnimatedStep: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <VStack
      as={motion.div}
      justifyContent={'center'}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
    >
      <Heading as={'h1'}>{title}</Heading>
      <Heading as={'h2'} size={'md'} color={'whiteAlpha.700'}>
        {subtitle}
      </Heading>
      {children}
    </VStack>
  );
};

export { AnimatedStep };
