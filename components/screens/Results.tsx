import React, { useEffect } from 'react';
import {
  VStack,
  Text,
  useToast,
  Heading,
  useWhyDidYouUpdate,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Spinner,
} from '@chakra-ui/react';
import type {
  UserWithApprovals,
  TournamentUser,
  TournamentProvider,
} from '../../models/tournament';
import { getApprovalsByUser } from '../../services/tournament-api';
import { buildErrorToast, sortByApprovalsAmount } from '../../utils';
import { ErrorAlert } from '../ErrorAlert';

type Props = {
  users: TournamentUser[];
  projects: string;
  organization: string;
  provider: TournamentProvider;
};

const Results: React.FC<Props> = (props) => {
  useWhyDidYouUpdate('results', props);
  const { users, projects, organization, provider } = props;
  const toast = useToast();
  const [results, setResults] = React.useState<UserWithApprovals[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      try {
        const approvalsByUser = await getApprovalsByUser(
          users,
          projects.split(','),
          organization,
          provider
        );
        setResults(sortByApprovalsAmount(approvalsByUser));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast(buildErrorToast());
      }
    })();
  }, [users]);

  // TODO: use orange color in table and fix styles of results

  return (
    <VStack>
      <Heading as={'h1'}>Results</Heading>
      {isLoading && (
        <>
          <Text fontSize={'2xl'}>Getting results form last 15 days...</Text>
          <Spinner
            boxSize={24}
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.800"
            color="#fc6d26"
            size="xl"
          />
        </>
      )}
      {!isLoading && !results.length && <ErrorAlert />}
      {!isLoading && !!results.length && (
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
