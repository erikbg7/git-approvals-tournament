import React from 'react';
import { Button } from '@chakra-ui/react';
import type { TournamentOrganization } from '../models/tournament';

const OrganizationCard: React.FC<TournamentOrganization> = ({ name }) => {
  return (
    <Button p={10} color={'#fc6d26'} fontWeight={'bold'}>
      {name}
    </Button>
  );
};

export { OrganizationCard };
