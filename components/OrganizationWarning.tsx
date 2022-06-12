import React from 'react';
import { Box, Heading, Text, Link } from '@chakra-ui/react';
import { BiLinkExternal } from 'react-icons/bi';
import { motion } from 'framer-motion';

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
        <Box
          as={motion.div}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          // @ts-ignore
          transition={{ duration: 0.2 }}
          textAlign={'center'}
          t={20}
        >
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
              Don't forget to request it. <Box as={BiLinkExternal} color={'white'} ml={2} />
            </Link>
          </Text>
        </Box>
      )}
    </>
  );
};

export { OrganizationWarning };
