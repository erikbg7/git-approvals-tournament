import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Box,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { QueryParams, UserWithApprovals } from '../../models/tournament';
import { getApprovalsByUser } from '../../services/tournament-api';
import { buildErrorToast, sortByApprovalsAmount } from '../../utils';
import { ErrorAlert } from '../../components/ErrorAlert';

const Results: React.FC = () => {
  const { query } = useRouter();
  const {
    provider,
    projects,
    organization = '',
    members = '',
  } = query as QueryParams & { members: string };

  const toast = useToast();
  const [results, setResults] = React.useState<UserWithApprovals[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      try {
        const approvalsByUser = await getApprovalsByUser(
          members!.split(','),
          projects!.split(','),
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
  }, []);

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
                <Th textAlign={'center'}>Github User</Th>
                <Th textAlign={'center'}>N. of Approvals</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map((user) => (
                <Tr key={user.id}>
                  <Td textAlign={'center'}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box display={'flex'} overflow={'hidden'} borderRadius={'full'} m={2}>
                        <Image src={user.avatarUrl || ''} alt={user.name} width={40} height={40} />
                      </Box>
                      {user.name}
                    </Box>
                  </Td>
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
export default Results;
