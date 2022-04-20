import React, { useCallback, useState } from 'react';
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
import { buildErrorToast, sortByApprovalsAmount } from '../../utils';
import { getApprovalsByUser } from '../../services/tournament-api';

type Props = {
  organizations: GitlabGroup[];
  projects: GitlabProject[];
  members: GitlabUser[];
};

const Index: React.FC<Props> = ({ organizations = [], projects = [], members = [] }) => {
  const toast = useToast();
  const { query } = useRouter();
  const [results, setResults] = useState<UserWithApprovals[]>([]);
  const [resolving, setResolving] = useState(false);

  const hasOrganization = !!query.organization;
  const hasProjects = !!query.projects;
  const hasError = !!query.error;
  const hasResults = !!results.length;

  // useEffect(() => { hasError && toast(buildErrorToast());}, []);

  const handleTournamentStart = useCallback(async (members: GitlabUser[], projects: string[]) => {
    try {
      setResolving(true);
      const approvalsByUser = await getApprovalsByUser(members, projects);
      setResults(sortByApprovalsAmount(approvalsByUser));
    } catch (error) {
      toast(buildErrorToast());
    }
  }, []);

  const showSteps = !resolving || (resolving && !hasResults);

  return (
    <VStack height={'100vh'} display={'flex'} alignItems={'center'} justifyContent={'start'} p={6}>
      {showSteps && <Steps resolve={resolving} />}
      {hasResults && <Results users={results} />}
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