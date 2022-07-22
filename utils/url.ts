import {
  PROVIDERS,
  TournamentOrganization,
  TournamentProject,
  TournamentProvider,
} from '../models/tournament';

const getOrganizationParam = (organization: TournamentOrganization, provider: TournamentProvider) =>
  ({
    [PROVIDERS.GITHUB]: organization.id.toString(),
    [PROVIDERS.GITLAB]: organization.name,
  }[provider]);

const getProjectsParam = (projects: TournamentProject[], provider: TournamentProvider) =>
  ({
    [PROVIDERS.GITHUB]: projects.map((p) => p.name).join(','),
    [PROVIDERS.GITLAB]: projects.map((p) => p.id).join(','),
  }[provider]);

export { getOrganizationParam, getProjectsParam };
