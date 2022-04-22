import React, { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Router, { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import { VStack } from '@chakra-ui/react';

import type { GitlabGroup, GitlabProject, GitlabUser } from '../../models/gitlab';
import type { QueryParams } from '../../models/tournament';
import { Organizations } from '../../components/Organizations';
import { Projects } from '../../components/Projects';
import { Members } from '../../components/Members';
import { Results } from '../../components/Results';
import { Steps } from '../../components/Stepper';
import { getAllProjectsMembers, getOrganizations, getProjects } from '../../services/gitlab-api';
import { ErrorAlert } from '../../components/ErrorAlert';

type Props = {
  organizations: GitlabGroup[];
  projects: GitlabProject[];
  members: GitlabUser[];
};

const Index: React.FC<Props> = ({ organizations = [], projects = [], members = [] }) => {
  const router = useRouter();
  const query = router.query as QueryParams;
  const [tournamentMembers, setTournamentMembers] = useState<GitlabUser[]>([]);

  useEffect(() => setTournamentMembers([]), []);

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

  const handleTournamentStart = (members: GitlabUser[]) => setTournamentMembers(members);

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
    const accessToken = token?.accessToken as string;
    const params = context.query as QueryParams;
    const isSessionActive = token && accessToken;
    const hasError = !!params.error;

    if (hasError) {
      return { props: {} };
    }

    if (isSessionActive && !params.organization) {
      const organizations = (await getOrganizations(accessToken)) || [];
      return { props: { organizations } };
    }

    if (isSessionActive && params.organization && !params.projects) {
      const projects = await getProjects(accessToken, params.organization);
      return { props: { projects } };
    }

    if (isSessionActive && params.organization && params.projects) {
      const projectIdsList = params.projects.split(',');
      const members = await getAllProjectsMembers(accessToken, projectIdsList);
      return { props: { members: Array.from(members) } };
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
export default Index;
