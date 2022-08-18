import React from 'react';
import { Circle, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

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

export { Step };
