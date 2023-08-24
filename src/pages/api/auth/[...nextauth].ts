import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import AppleProvider from "next-auth/providers/apple";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope:
            "user-read-email playlist-modify-public playlist-modify-private playlist-read-public playlist-read-private",
        },
      },
    }),
  ],
};

export default NextAuth(authOptions);
