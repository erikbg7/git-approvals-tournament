export const config = {
  github: {
    baseUrl: 'https://api.github.com',
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // TODO: scope=read:org should be enough
    oAuthUrl: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`,
  },
  gitlab: {
    baseUrl: 'https://gitlab.com/api/v4',
    clientId: process.env.GITLAB_CLIENT_ID,
    clientSecret: process.env.GITLAB_CLIENT_SECRET,
    oAuthUrl:
      'https://gitlab.com/oauth/authorize?scope=read_user%20read_repository%20api%20read_api',
  },
};
