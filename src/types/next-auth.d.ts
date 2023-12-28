import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";

declare module "next-auth" {
  /** The OAuth profile returned from your provider */
  interface Profile extends Profile {
    /** The user's id (sub) from the upstream OAuth provider. */
    id: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    /** The user's access token for the upstream OAuth provider. */
    accessToken: string;
    /** The user's id (sub) from the upstream OAuth provider. */
    id: string;
    /** id of the provider used for this account */
    provider: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    /** The user's access token from the upstream OAuth provider. */
    accessToken: string;
    /** The user's id (sub) from the upstream OAuth provider. */
    id: string;
    /** id of the provider used for this account */
    provider: string;
  }
}
