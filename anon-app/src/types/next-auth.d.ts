import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {

  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMsg?: boolean;
    userName?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMsg?: boolean;
      userName?: string;
    } & DefaultSession['user']

  }
  interface JWT {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMsg?: boolean;
      userName?: string;
    } & DefaultSession['user']

  }
}

