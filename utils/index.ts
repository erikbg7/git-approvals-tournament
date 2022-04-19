import type { UseToastOptions } from '@chakra-ui/react';
import type { UserWithApprovals } from '../models/tournament';

const sortByApprovalsAmount = (users: UserWithApprovals[]): UserWithApprovals[] => {
  return users.sort((a, b) => b.approvals - a.approvals);
};

const buildErrorToast = (message?: string): UseToastOptions => {
  return {
    id: 'error-toast',
    title: 'Gitlab Error',
    description: message || 'There was an error processing the request.',
    status: 'error',
    duration: 5000,
    isClosable: true,
  };
};

export { sortByApprovalsAmount, buildErrorToast };
