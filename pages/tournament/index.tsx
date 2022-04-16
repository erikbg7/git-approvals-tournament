import React from 'react';
import Link from 'next/link';
import { getToken } from 'next-auth/jwt';
import { GetServerSideProps, GetStaticProps } from 'next';
import {
  getAllProjectsMembers,
  getOrganizations,
  getProjectEvents,
  getProjects,
  GitlabGroup,
  GitlabProject,
  GitlabUser,
} from '../../services/gitlab-api';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Organizations } from '../../components/Organizations';
import { Projects } from '../../components/Projects';
import { Members } from '../../components/Members';
import { getSession } from 'next-auth/react';

type Props = {
  organizations: GitlabGroup[];
  projects: GitlabProject[];
  members: GitlabUser[];
};

const Index: React.FC<Props> = ({ organizations = [], projects = [], members = [] }) => {
  const { query } = useRouter();

  const hasOrganization = !!query.organization;
  const hasProjects = !!query.projects;

  return (
    <Box>
      {!hasOrganization && <Organizations organizations={organizations} />}
      {hasOrganization && !hasProjects && <Projects projects={projects} />}
      {hasOrganization && hasProjects && <Members members={members} />}
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
};

export { getServerSideProps };
export default Index;
