import React from 'react';
import { motion } from 'framer-motion';
import { Heading, VStack } from '@chakra-ui/react';
import { STEP_CONFIG, STEPS } from '../steps';

type Props = {
  step: typeof STEPS[keyof typeof STEPS];
  children: React.ReactNode;
};

const AnimatedStep: React.FC<Props> = ({ step, children }) => {
  const { title, subtitle } = STEP_CONFIG[step];

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
