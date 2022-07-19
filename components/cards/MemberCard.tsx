import React from 'react';
import { Button } from '@chakra-ui/react';
import type { TournamentUser } from '../../models/tournament';

type Props = {
  id: number;
  disabled: boolean;
  name: string;
  onClick(project: TournamentUser): void;
};

const MemberCard: React.FC<Props> = ({ id, disabled, name, onClick }) => {
  const member = { id, name } as TournamentUser;
  return (
    <Button key={id} disabled={disabled} onClick={() => onClick(member)} m={1}>
      {name}
    </Button>
  );
};

export default React.memo(MemberCard);
