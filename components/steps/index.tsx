import type { QueryParams } from '../../models/tournament';
import { Members } from './Members';
import { Projects } from './Projects';
import { Organizations } from './Organizations';

const STEPS = {
  ORGANIZATION: 'organization',
  PROJECTS: 'projects',
  MEMBERS: 'members',
};

const STEP_CONFIG = {
  [STEPS.ORGANIZATION]: {
    title: 'Organization',
    subtitle: 'Choose an organization to participate in the tournament',
  },
  [STEPS.PROJECTS]: {
    title: 'Project',
    subtitle: 'Select the projects from which to read the approvals:',
  },
  [STEPS.MEMBERS]: {
    title: 'Members',
    subtitle: 'Select the tournament participants:',
  },
};

const getCurrentStep = (query: QueryParams) => {
  if (!query?.organization) {
    return STEPS.ORGANIZATION;
  }
  if (!query?.projects) {
    return STEPS.PROJECTS;
  }
  return STEPS.MEMBERS;
};

export { STEP_CONFIG, STEPS, Members, Projects, Organizations, getCurrentStep };
