// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      displayname?: string;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    displayname?: string;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      displayname?: string;
      username?: string;
    } & DefaultSession["user"];
  }
}
