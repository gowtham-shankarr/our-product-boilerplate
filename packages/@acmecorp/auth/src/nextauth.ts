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
          // This would integrate with your database
          // For now, return a mock user
          const user: User = {
            id: "1",
            email: credentials.email,
            name: "Test User",
            role: "user",
            permissions: ["users:read", "orgs:read", "projects:read"],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Validate user with Zod
          const validatedUser = UserSchema.parse(user);
          return validatedUser;
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
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
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

      return session as Session;
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
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign in
      console.log("User signed in:", user.email);
    },
    async signOut({ session, token }) {
      // Log sign out
      console.log("User signed out");
    },
    async createUser({ user }) {
      // Log new user creation
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
    // This would implement token refresh logic
    // For now, return the token as is
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
  // This would use NextAuth's getServerSession
  // For now, return null
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
  // This would use NextAuth's useSession
  // For now, return a mock session
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
