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
import { Stepper } from '../../components/stepper/Stepper';
import { ErrorAlert } from '../../components/ErrorAlert';
import { createTournament } from '../../services/tournament-api';
import { AnimatedStep } from '../../components/layout/AnimatedStep';
import { Members, Organizations, Projects } from '../../components/steps';
import { STEPS, STEP_CONFIG, getCurrentStep } from '../../components/steps';

type Props = {
  organizations: TournamentOrganization[];
  projects: TournamentProject[];
  members: TournamentUser[];
};

const Provider: React.FC<Props> = ({ organizations = [], projects = [], members = [] }) => {
  const router = useRouter();
  const query = router.query as QueryParams;
  const step = getCurrentStep(query);

  const { title, subtitle } = STEP_CONFIG[step];

  return (
    <VStack height={'80vh'} display={'flex'} alignItems={'center'} justifyContent={'start'} p={6}>
      <Stepper />
      <AnimatedStep title={title} subtitle={subtitle}>
        {step === STEPS.ORGANIZATION && <Organizations organizations={organizations} />}
        {step === STEPS.PROJECTS && <Projects projects={projects} />}
        {step === STEPS.MEMBERS && <Members members={members} />}
        {step === STEPS.ERROR && <ErrorAlert />}
      </AnimatedStep>
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
