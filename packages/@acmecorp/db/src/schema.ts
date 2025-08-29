// Re-export schema types and utilities
export * from "@prisma/client";

// Auth-related types
export type UserWithMemberships = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: "admin" | "user" | "guest";
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  memberships: Array<{
    id: string;
    role: string;
    organization: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
    };
  }>;
};

export type OrganizationWithMembers = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  memberships: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      role: "admin" | "user" | "guest";
      permissions: string[];
    };
  }>;
};

// Auth-specific types
export type UserWithAuth = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: "admin" | "user" | "guest";
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type SessionWithUser = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: UserWithAuth;
};

export type PasswordResetWithUser = {
  id: string;
  userId: string;
  token: string;
  expires: Date;
  used: boolean;
  createdAt: Date;
  user: UserWithAuth;
};

export type EmailVerificationWithUser = {
  id: string;
  userId: string;
  token: string;
  expires: Date;
  used: boolean;
  createdAt: Date;
  user: UserWithAuth;
};
