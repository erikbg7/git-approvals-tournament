import React, { ReactNode, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Router, { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import { VStack } from '@chakra-ui/react';

import type {
  QueryParams,
  TournamentOrganization,
  TournamentProject,
  TournamentUser,
} from '../../models/tournament';
import { Members, Organizations, Projects, Results } from '../../components/screens';
import { Steps } from '../../components/Stepper';
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
  const [tournamentMembers, setTournamentMembers] = useState<TournamentUser[]>([]);

  useEffect(() => setTournamentMembers([]), []);

  const provider = query?.provider;
  const hasOrganization = !!query.organization;
  const hasProjects = !!query.projects;
  const hasError = !!query.error;
  const hasResults = !!query.results;

  const { organization: paramOrganization, projects: paramProjects, results: paramResults } = query;

  useEffect(() => {
    const cleanUp = () => !hasResults && setTournamentMembers([]);
    Router.events.on('routeChangeComplete', cleanUp);
    return () => {
      Router.events.off('routeChangeComplete', cleanUp);
    };
  }, [hasResults]);

  const handleTournamentStart = (members: TournamentUser[]) => setTournamentMembers(members);

  const showSteps = !tournamentMembers || (tournamentMembers && !hasResults);

  return (
    <VStack height={'80vh'} display={'flex'} alignItems={'center'} justifyContent={'start'} p={6}>
      {showSteps && <Steps resolve={!!tournamentMembers.length} />}
      {paramProjects && hasResults && (
        <Results users={tournamentMembers} projects={paramProjects} />
      )}
      {!hasResults && !hasOrganization && <Organizations organizations={organizations} />}
      {!hasResults && hasOrganization && !hasProjects && <Projects projects={projects} />}
      {!hasResults && hasOrganization && hasProjects && (
        <Members members={members} onTournamentStart={handleTournamentStart} />
      )}
      {hasError && <ErrorAlert />}
    </VStack>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token = await getToken(context);
    const params = context.query as QueryParams;
    const provider = context?.params?.provider as 'github' | 'gitlab';

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
      const projectIdsList = params.projects.split(',');
      const members = await tournament.getMembers(projectIdsList);
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
