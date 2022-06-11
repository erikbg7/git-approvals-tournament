import NextAuth from 'next-auth';
import GitlabProvider from 'next-auth/providers/gitlab';
import GithubProvider from 'next-auth/providers/github';

import { config } from '../../../config';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: config.github.clientId,
      clientSecret: config.github.clientSecret,
      authorization: config.github.oAuthUrl,
    }),
    GitlabProvider({
      clientId: config.gitlab.clientId,
      clientSecret: config.gitlab.clientSecret,
      authorization: config.gitlab.oAuthUrl,
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
