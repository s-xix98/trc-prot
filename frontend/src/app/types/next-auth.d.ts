// eslint-disable-next-line
import { JWT } from "next-auth/jwt";
// eslint-disable-next-line
import NextAuth from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface User {
    accessToken?: string;
  }
}