import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
  }

  interface User {
    user_id: number;
    name: string;
    email: string;
    image: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    name: string;
    email: string;
    image: string;
  }
}