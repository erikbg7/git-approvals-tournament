import React, { useEffect } from 'react';
import Link from 'next/link';
import { getToken } from 'next-auth/jwt';
import { GetServerSideProps } from 'next';
import {
  getAllProjectsMembers,
  getOrganizations,
  getProjectEvents,
  getProjects,
  GitlabGroup,
  GitlabProject,
  GitlabUser,
} from '../../services/gitlab-api';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Organizations } from '../../components/Organizations';
import { Projects } from '../../components/Projects';
import { Members } from '../../components/Members';
import { getSession } from 'next-auth/react';
import { useProgressBar } from '../../hooks/useProgressBar';
import { AnimatePresence } from 'framer-motion';

type Props = {
  organizations: GitlabGroup[];
  projects: GitlabProject[];
  members: GitlabUser[];
};

const Index: React.FC<Props> = ({ organizations = [], projects = [], members = [] }) => {
  const { query } = useRouter();
  const toast = useToast();
  const { isRequestInProgress } = useProgressBar();

  console.warn({ query, isRequestInProgress });

  const hasOrganization = !!query.organization;
  const hasProjects = !!query.projects;
  const hasError = !!query.error;

  // useEffect(() => {
  //   if (hasError) {
  //     toast({
  //       id: 'error-toast',
  //       title: 'Gitlab Error',
  //       description: 'There was an error processing the request.',
  //       status: 'error',
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   }
  // }, []);

  return (
    <Box height={'100vh'} textAlign={'center'}>
      {isRequestInProgress && (
        <Progress position={'absolute'} top={0} w={'100vw'} size="sm" isIndeterminate />
      )}
      {!hasOrganization && <Organizations organizations={organizations} />}
      {hasOrganization && !hasProjects && <Projects projects={projects} />}
      {hasOrganization && hasProjects && <Members members={members} />}
      {hasError && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Gitlab Error!</AlertTitle>
          <AlertDescription>There was an error processing the request.</AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

type QueryParamsType = {
  organization?: string;
  projects?: string;
};

// get static props for component
const getServerSideProps: GetServerSideProps = async (context) => {
  // console.warn('query', context.query);
  try {
    const token = await getToken(context);
    const session = await getSession(context);
    const params = context.query as QueryParamsType;
    const isSessionActive = token && token.accessToken;

    let organizations: GitlabGroup[] = [];
    let projects: GitlabGroup[] = [];
    let members: GitlabUser[] = [];

    console.warn({ token, session });

    if (isSessionActive && !params.organization) {
      organizations = await getOrganizations(token.accessToken as string);
      return { props: { organizations } };
    }

    if (isSessionActive && !params.projects) {
      projects = await getProjects(
        token.accessToken as string,
        params.organization as unknown as number
      );
      return { props: { projects } };
    }

    if (isSessionActive && params.organization && params.projects) {
      const projectIdsList = params.projects.split(',');

      projectIdsList.map(async (projectId) => {
        const approvals = await getProjectEvents(
          token.accessToken as string,
          projectId as unknown as string
        );
        console.warn({ approvals });
        console.warn(approvals[0].author);
      });

      members = await getAllProjectsMembers(token.accessToken as string, projectIdsList);
      return { props: { members: Array.from(members) } };
    }

    return {
      props: { organizations },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/tournament?error=gitlabError',
      },
      props: {},
    };
  }
};

export { getServerSideProps };
export default Index;
