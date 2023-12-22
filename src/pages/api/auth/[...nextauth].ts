import NextAuth, { Account, Profile, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "user-read-email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT;
      account: Account | null;
      profile?: Profile | null;
    }) {
      if (!account || !profile || !account.access_token) {
        return token;
      }

      token.accessToken = account.access_token;

      if (!profile || !profile.sub) {
        return token;
      }

      token.id = profile.sub;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.id = token.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
