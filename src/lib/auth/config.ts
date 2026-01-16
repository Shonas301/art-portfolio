import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// extend the session type to include isAdmin flag
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
  }
}

// nextauth configuration options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // use jwt strategy for session management
  session: {
    strategy: "jwt",
    // session expires after 7 days
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    // add isAdmin flag to jwt token when user signs in
    async jwt({ token, user }) {
      if (user?.email) {
        // check if user email matches the admin email from env
        const adminEmail = process.env.ADMIN_EMAIL;
        token.isAdmin = adminEmail ? user.email === adminEmail : false;
      }
      return token;
    },

    // transfer isAdmin flag from jwt to session
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin ?? false;
      }
      return session;
    },
  },

  // custom pages can be defined here if needed
  pages: {
    // signIn: "/auth/signin",
    // error: "/auth/error",
  },

  // enable debug mode in development
  debug: process.env.NODE_ENV === "development",
};
