import NextAuth, { Account, Profile, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

const MusicKitProvider = CredentialsProvider({
  id: "applemusic",
  name: "Apple Music",
  credentials: {
    token: {
      label: "Token",
      type: "text",
      placeholder: "GO BACK TO HOME PAGE AND SIGN IN WITH APPLE MUSIC.",
    },
  },
  async authorize(credentials, req) {
    if (!credentials || !credentials.token) {
      return null;
    }

    const token = credentials.token;
    let userId = token.substring(0, 15);
    userId = userId
      .split("")
      .map((char) => (char.charCodeAt(0) * 7) % 256)
      .join("");
    const userEmail = `${userId}@localhost`;
    return {
      id: userId,
      name: "Apple Music User",
      email: userEmail,
    };
  },
});

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
    MusicKitProvider,
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
      token.provider = account.provider;

      if (!profile || !profile.sub) {
        return token;
      }

      token.id = profile.sub;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.id = token.id;
      session.provider = token.provider;
      return session;
    },
  },
};

export default NextAuth(authOptions);
