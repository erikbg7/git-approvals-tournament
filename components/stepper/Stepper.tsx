import React, { useEffect } from 'react';
import { HStack, Text, VStack } from '@chakra-ui/react';
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
    <VStack mx={'auto'} mb={20} mt={7} display={{ base: 'none', sm: 'none', md: 'inherit' }}>
      <HStack w={'90vw'} maxW={'3xl'}>
        <Step label={'1'} isActive={isStep(1)} isCompleted={isStepsAfter([1])} />
        <Text fontSize={'lg'} fontWeight={'bold'}>
          Organization
        </Text>
        <StepDivider isCompleted={isStepDone(1)} />
        <Step label={'2'} isActive={isStep(2)} isCompleted={isStepsAfter([2])} />
        <Text fontSize={'lg'} fontWeight={'bold'}>
          Projects
        </Text>
        <StepDivider isCompleted={isStepDone(2)} />
        <Step label={'3'} isActive={isStep(3)} isCompleted={isStepsAfter([2]) && resolve} />
        <Text fontSize={'lg'} fontWeight={'bold'}>
          Members
        </Text>
      </HStack>
    </VStack>
  );
};

export { Stepper };