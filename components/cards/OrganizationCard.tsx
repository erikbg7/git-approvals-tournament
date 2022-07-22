import React from 'react';
import { Button } from '@chakra-ui/react';
import { QueryParams, TournamentOrganization } from '../../models/tournament';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getOrganizationParam } from '../../utils/url';

type Props = {
  id: number;
  name: string;
};

const OrganizationCard: React.FC<Props> = ({ id, name }) => {
  const { query } = useRouter();
  const { provider } = query as QueryParams;

  const organization = { id, name } as TournamentOrganization;
  const organizationQuery = getOrganizationParam(organization, provider);

  return (
    <Link key={id} href={{ query: { ...query, organization: organizationQuery } }}>
      <Button p={10} color={'#fc6d26'} fontSize={'xl'} fontWeight={'bold'}>
        {name}
      </Button>
    </Link>
  );
};

export default React.memo(OrganizationCard);
