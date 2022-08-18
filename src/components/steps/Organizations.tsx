import React from 'react';
import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';

import { OrganizationWarning } from '../OrganizationWarning';
import type { QueryParams, TournamentOrganization } from '../../models/tournament';
import OrganizationCard from '../cards/OrganizationCard';
import { PROVIDERS } from '../../models/tournament';

const Organizations = ({ organizations }: { organizations: TournamentOrganization[] }) => {
  const { query } = useRouter();
  const { provider } = query as QueryParams;

  return (
    <>
      <Box my={10}>
        {organizations.map((organization) => (
          <OrganizationCard id={organization.id} name={organization.name} />
        ))}
      </Box>
      {provider === PROVIDERS.GITHUB && <OrganizationWarning />}
    </>
  );
};

export { Organizations };
