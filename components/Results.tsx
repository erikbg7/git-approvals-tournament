import React from 'react';
import { VStack, HStack, Text } from '@chakra-ui/react';
import type { UserWithApprovals } from '../models/tournament';

type Props = {
  users: UserWithApprovals[];
};

const Results: React.FC<Props> = ({ users }) => {
  return (
    <VStack className="results">
      {users.map((user, index) => (
        <HStack key={index} className="result">
          <Text className="result-username">{user.name}</Text>
          <Text className="result-approvals">{user.approvals} approvals</Text>
        </HStack>
      ))}
    </VStack>
  );
};

export { Results };
