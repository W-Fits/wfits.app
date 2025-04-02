import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import Auth0 from "next-auth/providers/auth0";
import { compare } from "bcrypt-ts";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0({
      clientId: env.AUTH0_CLIENT_ID as string,
      clientSecret: env.AUTH0_CLIENT_SECRET as string,
      issuer: env.AUTH0_DOMAIN as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { password: "email", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) throw new Error("Credentials not provided");

          const { email, password } = credentials;
          const user = await prisma.user.findUniqueOrThrow({
            where: {
              email: email,
            },
          });

          if (!user.password) throw new Error("Credentials login not allowed");

          const passwordsMatch = await compare(password, user.password);

          if (!passwordsMatch) throw new Error("Incorrect password");

          return user as any;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.user_id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
        };
      }
      return session;
    },
  },
};