import {
  PROVIDERS,
  TournamentOrganization,
  TournamentProject,
  TournamentProvider,
} from '../models/tournament';

const getOrganizationParam = (organization: TournamentOrganization, provider: TournamentProvider) =>
  ({
    [PROVIDERS.GITHUB]: organization.name,
    [PROVIDERS.GITLAB]: organization.id.toString(),
  }[provider]);

const getProjectsParam = (projects: TournamentProject[], provider: TournamentProvider) =>
  ({
    [PROVIDERS.GITHUB]: projects.map((p) => p.name).join(','),
    [PROVIDERS.GITLAB]: projects.map((p) => p.id).join(','),
  }[provider]);

export { getOrganizationParam, getProjectsParam };
