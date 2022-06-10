import NextAuth from 'next-auth';
import GitlabProvider from 'next-auth/providers/gitlab';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    // TODO: scope=read:org should be enough
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`,
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      authorization:
        'https://gitlab.com/oauth/authorize?scope=read_user%20read_repository%20api%20read_api',
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      const newSession = { ...session };

      if (token.accessToken) {
        newSession.accessToken = token.accessToken;
      }

      return newSession;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },
  },
});
