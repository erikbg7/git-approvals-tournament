import React from 'react';
import { Box, Heading, SlideFade } from '@chakra-ui/react';
import { STEP_CONFIG, STEPS } from '../steps';

type Props = {
  step: typeof STEPS[keyof typeof STEPS];
  children: React.ReactNode;
};

const AnimatedStep: React.FC<Props> = ({ step, children }) => {
  const { title, subtitle } = STEP_CONFIG[step];

  return (
    <Box
      pt={{ base: 0, md: 6 }}
      pb={8}
      height={'full'}
      width={'full'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={{ base: 'center', md: 'start' }}
      alignItems={'center'}
    >
      <SlideFade in offsetY={20} delay={0.2}>
        <Heading as={'h1'} fontSize={{ base: '5xl' }}>
          {title}
        </Heading>
        <Heading as={'h2'} size={'md'} color={'whiteAlpha.700'}>
          {subtitle}
        </Heading>
        {children}
      </SlideFade>
    </Box>
  );
};

export { AnimatedStep };
