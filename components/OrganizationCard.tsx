import React from 'react';
import { Button } from '@chakra-ui/react';
import type { GitlabGroup } from '../models/gitlab';

const OrganizationCard: React.FC<GitlabGroup> = ({ id, name }) => {
  return (
    <Button p={10} color={'#fc6d26'} fontWeight={'bold'}>
      {name}
    </Button>
  );
};

export { OrganizationCard };
