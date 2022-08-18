import React from 'react';
import { Box, Heading, Text, Link, SlideFade } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { config } from '../config';

const OrganizationWarning = () => {
  const [showWarning, setShowWarning] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setShowWarning(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {showWarning && (
        <SlideFade in offsetY={20}>
          <Box textAlign={'center'}>
            <Heading as={'h5'} size={'xs'}>
              Can't see your organization?
            </Heading>
            <Text fontSize={'xs'} color={'gray.400'} lineHeight={2}>
              We need their explicit consent to participate in the tournament
            </Text>
            <Text fontSize={'xs'} color={'gray.400'} lineHeight={2} mt={1}>
              <Link
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                href={config.github.requestAccessUrl}
              >
                Don't forget to request it. <Box as={ExternalLinkIcon} color={'white'} ml={2} />
              </Link>
            </Text>
          </Box>
        </SlideFade>
      )}
    </>
  );
};

export { OrganizationWarning };
