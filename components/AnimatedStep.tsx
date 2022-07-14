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
      <Heading as={'h2'} size={'md'} color={'whiteAlpha.700'}>{subtitle}
      </Heading>
      {children}
    </VStack>
  );
};

const CONTENT = {
  organization: {
    title: 'Organization',
    subtitle: 'Choose an organization to participate in the tournament',
  },
  project: {
    title: 'Project',
    subtitle: 'Select the projects from which to read the approvals:',
  },
  members: {
    title: 'Members',
    subtitle: 'Select the tournament participants:',
  },
};

export { AnimatedStep, CONTENT };
