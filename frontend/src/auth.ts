import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

// Full auth config, including Prisma-backed callbacks. This file is only
// imported by API routes and server components, which run in the Node.js
// runtime — never by middleware (see auth.config.ts for the edge-safe subset).
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    // Runs every time someone signs in with Google.
    // Creates their row in the database the first time, and default
    // account groups so the Accounts page isn't empty.
    async signIn({ user }) {
      if (!user.email) return false;

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existing) {
        const created = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            companyName: "My Business",
            ownerName: user.name ?? "",
            supportEmail: user.email,
          },
        });

        await prisma.accountGroup.createMany({
          data: [
            { userId: created.id, name: "Cash & Bank", natureOf: "asset" },
            { userId: created.id, name: "Sundry Debtors", natureOf: "asset" },
            { userId: created.id, name: "Sundry Creditors", natureOf: "liability" },
            { userId: created.id, name: "Sales Accounts", natureOf: "income" },
            { userId: created.id, name: "Purchase Accounts", natureOf: "expense" },
            { userId: created.id, name: "Indirect Expenses", natureOf: "expense" },
          ],
        });
      }

      return true;
    },
    // Attach our internal database user id to the session, since
    // every API route looks records up by that id (not the Google id).
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) token.uid = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        (session.user as { id?: string }).id = token.uid as string;
      }
      return session;
    },
  },
});
