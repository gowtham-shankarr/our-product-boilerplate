import { createClient, contracts } from "@acmecorp/api";

// Create typed API client
export const api = createClient(contracts, {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  retries: { attempts: 3, backoff: "exponential" },
  logging: {
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    includeBody: process.env.NODE_ENV === "development",
    timing: true,
  },
});

// Export types for convenience
export type {
  User,
  CreateUser,
  UpdateUser,
  UserListQuery,
  Organization,
  CreateOrganization,
  UpdateOrganization,
  OrganizationListQuery,
  Project,
  CreateProject,
  UpdateProject,
  ProjectListQuery,
  Login,
  Register,
  AuthResponse,
} from "@acmecorp/api";
