import React from 'react';
import { Button } from '@chakra-ui/react';
import {
  PROVIDERS,
  QueryParams,
  TournamentOrganization,
  TournamentProject,
  TournamentProvider,
} from '../../models/tournament';
import Link from 'next/link';

type Props = {
  id: number;
  name: string;
  pathname: string;
  provider: TournamentProvider;
};

const OrganizationCard: React.FC<Props> = ({ id, pathname, provider, name }) => {
  const organization = { id, name } as TournamentOrganization;

  return (
    <Link key={id} href={{ pathname, query: buildQuery(provider, organization) }}>
      <Button p={10} color={'#fc6d26'} fontSize={'xl'} fontWeight={'bold'}>
        {name}
      </Button>
    </Link>
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

export default React.memo(OrganizationCard);
