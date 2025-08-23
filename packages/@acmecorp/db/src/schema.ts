// Re-export schema types and utilities
export * from "@prisma/client";

// Custom types and utilities can be added here
export type UserWithMemberships = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
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
    };
  }>;
};
