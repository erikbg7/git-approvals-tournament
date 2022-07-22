import React from 'react';
import { Button } from '@chakra-ui/react';
import { TournamentProject } from '../../models/tournament';

type Props = {
  id: number;
  disabled: boolean;
  name: string;
  onClick(project: TournamentProject): void;
};

const ProjectCard: React.FC<Props> = ({ id, disabled, name, onClick }) => {
  const project = { id, name } as TournamentProject;

  return (
    <Button
      key={id}
      disabled={disabled}
      onClick={() => onClick(project)}
      p={5}
      mb={2}
      width={'80%'}
      color={'#fc6d26'}
      fontSize={'xl'}
      fontWeight={'bold'}
    >
      {name}
    </Button>
  );
};

export default React.memo(ProjectCard);
