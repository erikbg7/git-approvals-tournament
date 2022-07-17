import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';

import { OrganizationWarning } from '../OrganizationWarning';
import { AnimatedStep, CONTENT } from '../layout/AnimatedStep';
import { PROVIDERS } from '../../models/tournament';
import type {
  QueryParams,
  TournamentOrganization,
  TournamentProvider,
} from '../../models/tournament';

const Organizations = ({ organizations }: { organizations: TournamentOrganization[] }) => {
  const { pathname, query } = useRouter();
  const { provider } = query as QueryParams;

  return (
    <AnimatedStep title={CONTENT.organization.title} subtitle={CONTENT.organization.subtitle}>
      <br />
      {organizations.map((organization) => (
        <Link key={organization.id} href={{ pathname, query: buildQuery(provider, organization) }}>
          <Button p={10} color={'#fc6d26'} fontSize={'xl'} fontWeight={'bold'}>
            {organization.name}
          </Button>
        </Link>
      ))}
      <br />
      {provider === 'github' && <OrganizationWarning />}
    </AnimatedStep>
  );
};

const buildQuery = (
  provider: TournamentProvider,
  organization: TournamentOrganization
): QueryParams => {
  return {
    provider,
    organization: provider === PROVIDERS.GITLAB ? organization.id.toString() : organization.name,
  };
};

export { Organizations };
