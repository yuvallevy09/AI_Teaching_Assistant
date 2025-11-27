import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        const email = (credentials?.email || "").toString().trim();
        const password = (credentials?.password || "").toString();

        // Stubbed verification: accept any email with password 'demo123'
        if (email && password === "demo123") {
          return {
            id: email,
            name: email.split("@")[0] || "User",
            email
          } as User;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string | undefined;
        session.user.name = (token.name as string | undefined) ?? session.user.name;
      }
      return session;
    }
  }
};


