import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import type { UrlObject } from 'url';

type Props = { text: string; href: UrlObject };

const MotionLinkButton: React.FC<Props> = ({ text, href }) => {
  return (
    <Link href={href}>
      <Button
        as={motion.div}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        // @ts-ignore
        transition={{ duration: 0.1 }}
        padding={4}
        width={'50%'}
        color={'#fc6d26'}
        borderColor={'#fc6d26'}
        variant={'outline'}
      >
        {text}
      </Button>
    </Link>
  );
};

export { MotionLinkButton };
