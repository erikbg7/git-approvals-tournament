import { PROVIDERS, TournamentOrganization, TournamentProvider } from '../models/tournament';

const getOrganizationParam = (organization: TournamentOrganization, provider: TournamentProvider) =>
  ({
    [PROVIDERS.GITHUB]: organization.id.toString(),
    [PROVIDERS.GITLAB]: organization.name,
  }[provider]);

export { getOrganizationParam };
