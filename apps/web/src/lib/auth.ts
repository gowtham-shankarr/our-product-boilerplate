import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@acmecorp/db";

import { compare, hash } from "bcryptjs";
import { z } from "zod";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role?: string;
    permissions?: string[];
    orgId?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      permissions?: string[];
      orgId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    permissions?: string[];
    orgId?: string;
  }
}

// Validation schemas
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;

        // Get user's primary organization (first membership) if orgId not set
        if (!token.orgId) {
          const membership = await db.membership.findFirst({
            where: { userId: user.id },
            include: { organization: true },
            orderBy: { createdAt: "asc" },
          });
          token.orgId = membership?.organization.id;
        }
      }

      // Handle session updates (like orgId changes)
      if (trigger === "update" && session?.orgId) {
        token.orgId = session.orgId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.orgId = token.orgId;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Validate input
          const { email, password } = signInSchema.parse(credentials);

          // Find user
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          // Verify password
          if (!user.passwordHash) {
            return null; // User doesn't have a password (OAuth only)
          }

          const isValidPassword = await compare(password, user.passwordHash);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function for signup
export async function signUp(data: z.infer<typeof signUpSchema>) {
  try {
    const { name, email, password } = signUpSchema.parse(data);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with hashed password
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "user",
        permissions: ["users_read"],
      },
    });

    // Create organization for the user (first user becomes owner)
    const existingOrgs = await db.organization.count();
    let organization;

    if (existingOrgs === 0) {
      // First user - create default organization
      organization = await db.organization.create({
        data: {
          name: `${name}'s Organization`,
          slug: `${name.toLowerCase().replace(/\s+/g, "-")}-org`,
        },
      });
    } else {
      // Check if user should join existing org or create new one
      // For now, create a personal organization
      organization = await db.organization.create({
        data: {
          name: `${name}'s Personal Organization`,
          slug: `${name.toLowerCase().replace(/\s+/g, "-")}-personal`,
        },
      });
    }

    // Create membership (user becomes owner/admin of their organization)
    await db.membership.create({
      data: {
        userId: user.id,
        orgId: organization.id,
        role: existingOrgs === 0 ? "owner" : "admin", // First user is owner, others are admin
        permissions: ["orgs_read", "orgs_write"],
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        },
      },
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Signup failed",
    };
  }
}
