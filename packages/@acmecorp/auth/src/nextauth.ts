import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { User, Session, AuthCallbacks } from "./types";
import { UserSchema, SessionSchema } from "./schemas";

/**
 * Default NextAuth configuration
 */
export const defaultAuthConfig: NextAuthOptions = {
  providers: [
    // Credentials provider for email/password
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
          // TODO: Replace with real database integration
          // Example:
          // import { db } from "@acmecorp/db";
          // import { compare } from "bcryptjs";
          //
          // const user = await db.user.findUnique({
          //   where: { email: credentials.email },
          //   include: { accounts: true }
          // });
          //
          // if (!user || !user.password) return null;
          //
          // const isValid = await compare(credentials.password, user.password);
          // if (!isValid) return null;
          //
          // return {
          //   id: user.id,
          //   email: user.email,
          //   name: user.name,
          //   role: user.role,
          //   permissions: user.permissions,
          //   image: user.image,
          // };

          // Placeholder - replace with real implementation
          console.log(
            "Credentials auth not implemented - replace with database integration"
          );
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),

    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // GitHub OAuth provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          user: user as User,
        };
      }

      // Return previous token if the access token has not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      // Send properties to the client
      const user = token.user as User;

      if (user) {
        session.user = user;
        (session as any).accessToken = token.accessToken as string;
      }

      return session as any;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // TODO: Implement sign in logging or user creation
      console.log("User signed in:", user.email);
    },
    async signOut({ session, token }) {
      // TODO: Implement sign out logging
      console.log("User signed out");
    },
    async createUser({ user }) {
      // TODO: Implement new user creation logic
      console.log("New user created:", user.email);
    },
  },

  debug: process.env.NODE_ENV === "development",
};

/**
 * Refresh access token
 */
async function refreshAccessToken(token: any) {
  try {
    // TODO: Implement token refresh logic
    // This would depend on your OAuth provider
    return token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/**
 * Create custom auth configuration
 */
export function createAuthConfig(
  providers: NextAuthOptions["providers"] = [],
  callbacks: AuthCallbacks = {},
  options: Partial<NextAuthOptions> = {}
): NextAuthOptions {
  return {
    ...defaultAuthConfig,
    providers: [...defaultAuthConfig.providers, ...providers],
    callbacks: {
      ...defaultAuthConfig.callbacks,
      ...callbacks,
    },
    ...options,
  };
}

/**
 * Server-side session helpers
 */
export async function getServerSession(): Promise<Session | null> {
  // TODO: Replace with NextAuth's getServerSession
  // Example:
  // import { getServerSession as nextAuthGetServerSession } from "next-auth";
  // import { authOptions } from "./auth-options";
  //
  // return await nextAuthGetServerSession(authOptions);

  console.log(
    "getServerSession not implemented - replace with NextAuth integration"
  );
  return null;
}

export async function requireAuth(): Promise<User> {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session.user;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession();
  return session?.user || null;
}

/**
 * Client-side session helpers
 */
export function useSession() {
  // TODO: Replace with NextAuth's useSession
  // Example:
  // import { useSession as nextAuthUseSession } from "next-auth/react";
  // return nextAuthUseSession();

  console.log("useSession not implemented - replace with NextAuth integration");
  return {
    data: null,
    status: "unauthenticated" as const,
  };
}

/**
 * Auth utilities
 */
export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user;
}

export function hasValidSession(session: Session | null): boolean {
  if (!session?.user) return false;

  try {
    SessionSchema.parse(session);
    return true;
  } catch {
    return false;
  }
}

/**
 * Environment validation
 */
export function validateAuthConfig() {
  const requiredEnvVars = ["NEXTAUTH_URL", "NEXTAUTH_SECRET"];

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    console.warn(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
