import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import type { TournamentUser } from '../../models/tournament';
import Image from 'next/image';

type Props = {
  id: number;
  disabled: boolean;
  name: string;
  url?: string;
  onClick(project: TournamentUser): void;
};

const MemberCard: React.FC<Props> = ({ id, disabled, name, url = '', onClick }) => {
  const member = { id, name } as TournamentUser;
  return (
    <Button
      key={id}
      disabled={disabled}
      display={'flex'}
      flexDirection={'column'}
      height={'auto'}
      m={1}
      py={2}
      px={3}
      onClick={() => onClick(member)}
    >
      <Box display={'flex'} overflow={'hidden'} borderRadius={'full'} m={1}>
        <Image src={url} alt={name} width={40} height={40} />
      </Box>
      {name}
    </Button>
  );
};

export default React.memo(MemberCard);
