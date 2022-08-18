import React from 'react';
import Link from 'next/link';
import { Button, SlideFade, useBreakpointValue } from '@chakra-ui/react';
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
      <SlideFade in offsetY={20}>
        {/*@ts-ignore*/}
        <Button padding={4} color={'#fc6d26'} height={70} {...baseProps}>
          {text}
        </Button>
      </SlideFade>
    </Link>
  );
};

export { MotionLinkButton };
