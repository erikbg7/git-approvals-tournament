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
        <Image
          src={url}
          alt={name}
          width={40}
          height={40}
          placeholder="blur"
          blurDataURL={
            'data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjQwMCIgaGVpZ2h0PSIxNDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMzMzIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzMiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIxNDAiIGZpbGw9IiMzMzMiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI0MDAiIGhlaWdodD0iMTQwIiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNDAwIiB0bz0iNDAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg=='
          }
        />
      </Box>
      {name}
    </Button>
  );
};

export default React.memo(MemberCard);
