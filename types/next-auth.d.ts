import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    accessToken: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "admin" | "user";
      accessToken: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
    accessToken: string;
  }
}
