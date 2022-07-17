import React from 'react';
import { Divider } from '@chakra-ui/react';

type StepDividerProps = {
  isCompleted: boolean;
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

export { StepDivider };
