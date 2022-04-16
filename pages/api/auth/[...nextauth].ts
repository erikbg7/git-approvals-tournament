import NextAuth from 'next-auth';
import GitlabProvider from 'next-auth/providers/gitlab';

export default NextAuth({
  providers: [
    GitlabProvider({
      clientId: process.env.NEXT_PUBLIC_GITLAB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITLAB_CLIENT_SECRET,
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
