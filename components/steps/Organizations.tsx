import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';

import { OrganizationWarning } from '../OrganizationWarning';
import { PROVIDERS } from '../../models/tournament';
import type {
  QueryParams,
  TournamentOrganization,
  TournamentProvider,
} from '../../models/tournament';
import { AnimatedStep } from '../layout/AnimatedStep';
import { STEP_CONFIG, STEPS } from './index';

const Organizations = ({ organizations }: { organizations: TournamentOrganization[] }) => {
  const { pathname, query } = useRouter();
  const { provider } = query as QueryParams;
  const { title, subtitle } = STEP_CONFIG[STEPS.ORGANIZATION];

  return (
    <AnimatedStep title={title} subtitle={subtitle}>
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
