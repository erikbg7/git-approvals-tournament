import React, { useEffect } from 'react';
import { CheckIcon } from '@chakra-ui/icons';
import { Circle, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

type StepDividerProps = {
  isCompleted: boolean;
};

type StepProps = {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
};

const Step: React.FC<StepProps> = ({ label, isActive, isCompleted }) => {
  return (
    <Circle
      size="40px"
      color="white"
      bg={isCompleted ? '#fc6d26' : 'whiteAlpha.300'}
      borderWidth={isActive || isCompleted ? 2 : 0}
      borderColor={'#fc6d26'}
      transition={'all 0.2s ease-in-out'}
    >
      <CheckIcon display={isCompleted ? 'inherit' : 'none'} />
      <Text display={!isCompleted ? 'inherit' : 'none'} fontSize={'lg'} fontWeight={'bold'}>
        {label}
      </Text>
    </Circle>
  );
};

const StepDivider: React.FC<StepDividerProps> = ({ isCompleted }) => {
  return (
    <Divider
      bgColor={isCompleted ? '#fc6d26' : 'whiteAlpha.300'}
      borderBottomWidth={2}
      orientation="horizontal"
      transition={'all 0.2s ease-in-out'}
    />
  );
};

type StepsProps = {
  resolve: boolean;
};

const Steps: React.FC<StepsProps> = ({ resolve }) => {
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

export { Steps };
