import React from 'react';
import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';

import { OrganizationWarning } from '../OrganizationWarning';
import type { QueryParams, TournamentOrganization } from '../../models/tournament';
import OrganizationCard from '../cards/OrganizationCard';

const Organizations = ({ organizations }: { organizations: TournamentOrganization[] }) => {
  const { pathname, query } = useRouter();
  const { provider } = query as QueryParams;

  return (
    <>
      <Box my={20}>
        {organizations.map((organization) => (
          <OrganizationCard
            id={organization.id}
            name={organization.name}
            pathname={pathname}
            provider={provider}
          />
        ))}
      </Box>
      {provider === 'github' && <OrganizationWarning />}
    </>
  );
};

export { Organizations };
