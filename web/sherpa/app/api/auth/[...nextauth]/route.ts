import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/github.ts
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: async (p) => {
        // console.log({ p });
        return { ...p, login: p.login };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // copy from user (profile) to token
      // console.log({ user, token });
      if (user && user.login && !token.login) {
        token.login = user.login;
      }
      return token;
    },
    async session({ session, token }) {
      // copy from token to session
      if (session?.user) {
        session.user.login = token.login;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
