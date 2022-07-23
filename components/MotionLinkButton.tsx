import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button, useBreakpointValue } from '@chakra-ui/react';
import type { UrlObject } from 'url';

type Props = { text: string; href: UrlObject };

const MotionLinkButton: React.FC<Props> = ({ text, href }) => {
  const baseProps = useBreakpointValue({
    base: {
      size: 'lg',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      borderRadius: 'none',
      borderTop: '1px solid #fc6d26',
      variant: 'solid',
      backgroundColor: '#18181b',
    },
    md: { borderColor: '#fc6d26', variant: 'outline', width: '50%' },
  });

  return (
    <Link href={href}>
      <Button
        as={motion.div}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        // @ts-ignore
        transition={{ duration: 0.1 }}
        padding={4}
        color={'#fc6d26'}
        height={70}
        {...baseProps}
      >
        {text}
      </Button>
    </Link>
  );
};

export { MotionLinkButton };
