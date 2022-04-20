import React, { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import { Alert, AlertDescription, AlertIcon, AlertTitle, VStack, useToast } from '@chakra-ui/react';

import type { GitlabGroup, GitlabProject, GitlabUser } from '../../models/gitlab';
import type { QueryParams, UserWithApprovals } from '../../models/tournament';
import { Organizations } from '../../components/Organizations';
import { Projects } from '../../components/Projects';
import { Members } from '../../components/Members';
import { Results } from '../../components/Results';
import { Steps } from '../../components/Stepper';
import { getAllProjectsMembers, getOrganizations, getProjects } from '../../services/gitlab-api';

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

  // useEffect(() => { hasError && toast(buildErrorToast());}, []);

  const handleTournamentStart = (members: GitlabUser[]) => setTournamentMembers(members);
  const handleCleanUp = useCallback(() => setTournamentMembers([]), []);

  const showSteps = !tournamentMembers || (tournamentMembers && !hasResults);

  return (
    <VStack height={'100vh'} display={'flex'} alignItems={'center'} justifyContent={'start'} p={6}>
      {showSteps && <Steps resolve={!!tournamentMembers.length} />}
      {paramProjects && hasResults && (
        <Results users={tournamentMembers} onCleanUp={handleCleanUp} projects={paramProjects} />
      )}
      {!hasResults && !hasOrganization && <Organizations organizations={organizations} />}
      {!hasResults && hasOrganization && !hasProjects && <Projects projects={projects} />}
      {!hasResults && hasOrganization && hasProjects && (
        <Members members={members} onTournamentStart={handleTournamentStart} />
      )}
      {hasError && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Gitlab Error!</AlertTitle>
          <AlertDescription>There was an error processing the request.</AlertDescription>
        </Alert>
      )}
    </VStack>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token = await getToken(context);
    const accessToken = token?.accessToken as string;
    const params = context.query as QueryParams;
    const isSessionActive = token && accessToken;

    console.warn('isSessionActive', isSessionActive);

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
