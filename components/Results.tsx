import React, { useEffect } from 'react';
import {
  VStack,
  HStack,
  Text,
  useToast,
  Heading,
  useWhyDidYouUpdate,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from '@chakra-ui/react';
import type { UserWithApprovals } from '../models/tournament';
import type { GitlabUser } from '../models/gitlab';
import { getApprovalsByUser } from '../services/tournament-api';
import { buildErrorToast, sortByApprovalsAmount } from '../utils';
import Router, { useRouter } from 'next/router';

type Props = {
  users: GitlabUser[];
  projects: string;
  onCleanUp: () => void;
};

const Results: React.FC<Props> = (props) => {
  useWhyDidYouUpdate('results', props);
  const { users, onCleanUp, projects } = props;
  const toast = useToast();
  const [results, setResults] = React.useState<UserWithApprovals[]>([]);

  // useEffect(() => {
  //   return () => {
  //     onCleanUp();
  //   };
  // }, []);
  useEffect(() => {
    Router.events.on('routeChangeComplete', onCleanUp);
    return () => {
      Router.events.off('routeChangeComplete', onCleanUp);
    };
  }, []);

  useEffect(() => {
    console.warn('results', users);
    (async () => {
      try {
        // if (!!users.length) {
        // const projects = query.projects as string;
        const approvalsByUser = await getApprovalsByUser(users, projects.split(','));
        // if (approvalsByUser.length <= 0) {
        //   return back();
        // }
        setResults(sortByApprovalsAmount(approvalsByUser));
        // }
      } catch (error) {
        toast(buildErrorToast());
      }
    })();
  }, [users]);

  return (
    <VStack>
      <Heading as={'h1'}>Results</Heading>
      {!results.length && <Text>Getting tournament results...</Text>}
      {!!results.length && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Github User</Th>
                <Th>N. of Approvals</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map((user) => (
                <Tr key={user.id}>
                  <Td textAlign={'center'}>{user.name}</Td>
                  <Td textAlign={'center'}>{user.approvals}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </VStack>
  );
};

export { Results };
