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
        username: { label: "username", type: "text" },
        password: { password: "email", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) throw new Error("Credentials not provided");

          const { email, password, username } = credentials;

          if (!email && !username) throw new Error("No username or email provided");

          if (!password) throw new Error("No password proivded");

          let user;

          if (email) {
            user = await prisma.user.findUnique({
              where: { email: email.toLocaleLowerCase() },
            });
          } else if (username) {
            user = await prisma.user.findUnique({
              where: { username: username },
            });
          } else {
            console.error("No username or email provided");
            throw new Error("No username or email provided");
          }

          if (!user) {
            console.error("User not found");
            throw new Error("User not found"); // Or "Incorrect username/email"
          }

          if (!user.password) throw new Error("Credentials login not allowed");

          const passwordsMatch = await compare(password, user.password);

          if (!passwordsMatch) throw new Error("Incorrect password");

          return user as any;
        } catch (error) {
          throw error;
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

        const prismaUser = await prisma.user.findFirst({
          where: { email: user.email },
        });

        if (prismaUser) {
          token.name = prismaUser.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          name: token.name,
          id: token.id,
          email: token.email,
        };
      }
      return session;
    },
  },
};