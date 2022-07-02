import type { UseToastOptions } from '@chakra-ui/react';
import type { UserWithApprovals } from '../models/tournament';

const sortByApprovalsAmount = (users: UserWithApprovals[]): UserWithApprovals[] => {
  return users.sort((a, b) => b.approvals - a.approvals);
};

const getYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

const get15DaysBefore = () => {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() - 45);
  return getYYYYMMDD(newDate);
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

export { sortByApprovalsAmount, buildErrorToast, get15DaysBefore };
