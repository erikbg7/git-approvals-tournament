import React from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import { Divider, VStack } from '@chakra-ui/react';

import type {
  QueryParams,
  TournamentOrganization,
  TournamentProject,
  TournamentProvider,
  TournamentUser,
} from '../../models/tournament';
import { Stepper } from '../../components/stepper/Stepper';
import { ErrorAlert } from '../../components/ErrorAlert';
import { createTournament } from '../../services/tournament-api';
import { Members, Organizations, Projects } from '../../components/steps';
import { AnimatedStep } from '../../components/layout/AnimatedStep';
import { STEPS, getCurrentStep } from '../../components/steps';

type Props = {
  organizations: TournamentOrganization[];
  projects: TournamentProject[];
  members: TournamentUser[];
};

const Provider: React.FC<Props> = ({ organizations = [], projects = [], members = [] }) => {
  const router = useRouter();
  const query = router.query as QueryParams;
  const step = getCurrentStep(query);

  return (
    <VStack
      height={'80vh'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'start'}
      textAlign={'center'}
      p={6}
    >
      <Stepper />
      <Divider />
      {step === STEPS.ORGANIZATION && (
        <AnimatedStep step={step}>
          <Organizations organizations={organizations} />
        </AnimatedStep>
      )}
      {step === STEPS.PROJECTS && (
        <AnimatedStep step={step}>
          <Projects projects={projects} />
        </AnimatedStep>
      )}
      {step === STEPS.MEMBERS && (
        <AnimatedStep step={step}>
          <Members members={members} />
        </AnimatedStep>
      )}
      {step === STEPS.ERROR && (
        <AnimatedStep step={step}>
          <ErrorAlert />
        </AnimatedStep>
      )}
    </VStack>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token = await getToken(context);
    const params = context.query as QueryParams;
    const provider = context?.params?.provider as TournamentProvider;

    const step = getCurrentStep(params);
    const tournament = createTournament({ provider, token });

    if (step === STEPS.ERROR) {
      return { props: {} };
    }

    if (!tournament.isSessionActive) {
      return {
        redirect: { permanent: false, destination: '/' },
        props: {},
      };
    }

    if (step === STEPS.ORGANIZATION) {
      const organizations = await tournament.getOrganizations();
      return { props: { organizations } };
    }

    if (step === STEPS.PROJECTS) {
      const projects = await tournament.getProjects(params.organization || '');
      return { props: { projects } };
    }

    if (step === STEPS.MEMBERS) {
      const projectIds = params.projects?.split(',');
      const members = await tournament.getMembers(projectIds || []);
      return { props: { members } };
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
