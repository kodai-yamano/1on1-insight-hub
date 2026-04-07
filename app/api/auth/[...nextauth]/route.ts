import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions, Profile } from 'next-auth';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }: { profile?: Profile }) {
      return profile?.email?.endsWith('@cuebic.co.jp') ?? false;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
