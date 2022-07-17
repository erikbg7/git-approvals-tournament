import React from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import { VStack } from '@chakra-ui/react';

import type {
  QueryParams,
  TournamentOrganization,
  TournamentProject,
  TournamentProvider,
  TournamentUser,
} from '../../models/tournament';
import { Members, Organizations, Projects } from '../../components/screens';
import { Stepper } from '../../components/Stepper';
import { ErrorAlert } from '../../components/ErrorAlert';
import { createTournament } from '../../services/tournament-api';

type Props = {
  organizations: TournamentOrganization[];
  projects: TournamentProject[];
  members: TournamentUser[];
};

const Provider: React.FC<Props> = ({ organizations = [], projects = [], members = [] }) => {
  const router = useRouter();
  const query = router.query as QueryParams;

  const { organization: paramOrganization, projects: paramProjects, error: paramError } = query;

  return (
    <VStack height={'80vh'} display={'flex'} alignItems={'center'} justifyContent={'start'} p={6}>
      <Stepper />
      {!paramOrganization && <Organizations organizations={organizations} />}
      {paramOrganization && !paramProjects && <Projects projects={projects} />}
      {paramOrganization && paramProjects && <Members members={members} />}
      {paramError && <ErrorAlert />}
    </VStack>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token = await getToken(context);
    const params = context.query as QueryParams;
    const provider = context?.params?.provider as TournamentProvider;

    const hasError = !!params?.error;
    const tournament = createTournament({ provider, token });

    if (hasError) {
      return { props: {} };
    }

    if (!tournament.isSessionActive) {
      return {
        redirect: { permanent: false, destination: '/' },
        props: {},
      };
    }

    if (!params.organization) {
      const organizations = (await tournament.getOrganizations()) || [];

      return {
        props: { organizations },
      };
    }

    if (params.organization && !params.projects) {
      const projects = await tournament.getProjects(params.organization);

      return {
        props: { projects },
      };
    }

    if (params.organization && params.projects) {
      const projectIds = params.projects.split(',');
      const members = await tournament.getMembers(projectIds);
      return {
        props: { members },
      };
    }

    return {
      redirect: { permanent: false, destination: '/' },
      props: {},
    };
  } catch (error) {
    return {
      redirect: { permanent: false, destination: '/tournament?error=gitlabError' },
      props: {},
    };
  }
};

export { getServerSideProps };
export default Provider;
