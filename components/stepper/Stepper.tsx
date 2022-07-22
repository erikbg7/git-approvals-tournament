import React, { useEffect } from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Step } from './Step';
import { StepDivider } from './StepDivider';

type StepsProps = {
  resolve?: boolean;
};

const Stepper: React.FC<StepsProps> = ({ resolve = false }) => {
  const { query } = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);

  useEffect(() => {
    const hasOrganization = !!query.organization;
    const hasProjects = !!query.projects;

    if (hasProjects) {
      return setCurrentStep(3);
    }
    if (hasOrganization) {
      return setCurrentStep(2);
    }
    return setCurrentStep(1);
  });

  const isStep = (step: number) => step === currentStep;
  const isStepsAfter = (steps: number[]) => steps.every((step) => step < currentStep);
  const isStepDone = (step: number) => step < currentStep;

  return (
    <VStack mx={'auto'} my={5} display={{ base: 'none', sm: 'none', md: 'inherit' }}>
      <HStack w={'90vw'} maxW={'3xl'}>
        <Box display={'flex'} alignItems={'center'} mx={2} opacity={isStep(1) ? 1 : 0.5}>
          <Step label={'1'} isActive={isStep(1)} isCompleted={isStepsAfter([1])} />
          <Text fontSize={'lg'} fontWeight={'bold'} ml={2}>
            Organization
          </Text>
        </Box>
        <StepDivider isCompleted={isStepDone(1)} />
        <Box display={'flex'} alignItems={'center'} mx={2} opacity={isStep(2) ? 1 : 0.5}>
          <Step label={'2'} isActive={isStep(2)} isCompleted={isStepsAfter([2])} />
          <Text fontSize={'lg'} fontWeight={'bold'} ml={2}>
            Projects
          </Text>
        </Box>
        <StepDivider isCompleted={isStepDone(2)} />
        <Box display={'flex'} alignItems={'center'} mx={2} opacity={isStep(3) ? 1 : 0.5}>
          <Step label={'3'} isActive={isStep(3)} isCompleted={isStepsAfter([2]) && resolve} />
          <Text fontSize={'lg'} fontWeight={'bold'} ml={2}>
            Members
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
};

export { Stepper };
