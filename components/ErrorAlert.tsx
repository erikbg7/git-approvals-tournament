import React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

const ErrorAlert = () => {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Gitlab Error!
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        There was an error processing the request. Please
        <NextLink href="/">
          <Link color={'red.200'}>
            <strong> try login again.</strong>
          </Link>
        </NextLink>
      </AlertDescription>
    </Alert>
  );
};

export { ErrorAlert };
