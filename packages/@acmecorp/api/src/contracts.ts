import { z } from "zod";
import type { CrudContracts } from "./types";

// Base schemas
export const IdSchema = z.string().min(1);
export const EmailSchema = z.string().email();
export const NameSchema = z.string().min(1).max(100);
export const DescriptionSchema = z.string().max(500).optional();

// Pagination schemas
export const PaginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100),
  sort: z.string().optional(), // e.g., "-createdAt", "name"
});

export const DateRangeQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// User schemas
export const UserSchema = z.object({
  id: IdSchema,
  name: NameSchema,
  email: EmailSchema,
  avatar: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  avatar: z.string().url().optional(),
});

export const UpdateUserSchema = z.object({
  name: NameSchema.optional(),
  email: EmailSchema.optional(),
  avatar: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

export const UserListQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

// Organization schemas
export const OrganizationSchema = z.object({
  id: IdSchema,
  name: NameSchema,
  slug: z.string().min(1).max(50),
  description: DescriptionSchema,
  logo: z.string().url().optional(),
  plan: z.enum(['free', 'pro', 'enterprise']),
  status: z.enum(['active', 'suspended']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateOrganizationSchema = z.object({
  name: NameSchema,
  slug: z.string().min(1).max(50),
  description: DescriptionSchema,
  logo: z.string().url().optional(),
});

export const UpdateOrganizationSchema = z.object({
  name: NameSchema.optional(),
  slug: z.string().min(1).max(50).optional(),
  description: DescriptionSchema,
  logo: z.string().url().optional(),
  plan: z.enum(['free', 'pro', 'enterprise']).optional(),
});

export const OrganizationListQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  plan: z.enum(['free', 'pro', 'enterprise']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
});

// Project schemas
export const ProjectSchema = z.object({
  id: IdSchema,
  name: NameSchema,
  description: DescriptionSchema,
  orgId: IdSchema,
  status: z.enum(['active', 'archived', 'draft']),
  visibility: z.enum(['public', 'private']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateProjectSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema,
  orgId: IdSchema,
  visibility: z.enum(['public', 'private']),
});

export const UpdateProjectSchema = z.object({
  name: NameSchema.optional(),
  description: DescriptionSchema,
  status: z.enum(['active', 'archived', 'draft']).optional(),
  visibility: z.enum(['public', 'private']).optional(),
});

export const ProjectListQuerySchema = PaginationQuerySchema.extend({
  orgId: IdSchema.optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'archived', 'draft']).optional(),
  visibility: z.enum(['public', 'private']).optional(),
});

// Auth schemas
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: z.string().min(8),
  orgName: NameSchema.optional(),
});

export const AuthResponseSchema = z.object({
  user: UserSchema,
  session: z.object({
    id: IdSchema,
    expiresAt: z.string().datetime(),
  }),
});

export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

// Domain contracts
export const userContracts: CrudContracts<
  z.infer<typeof UserSchema>,
  z.infer<typeof CreateUserSchema>,
  z.infer<typeof UpdateUserSchema>,
  z.infer<typeof UserListQuerySchema>
> = {
  create: {
    body: CreateUserSchema,
    result: UserSchema,
  },
  getById: {
    params: z.object({ id: IdSchema }),
    result: UserSchema,
  },
  list: {
    query: UserListQuerySchema,
    result: z.object({
      items: z.array(UserSchema),
      nextCursor: z.string().optional(),
    }),
  },
  update: {
    params: z.object({ id: IdSchema }),
    body: UpdateUserSchema,
    result: UserSchema,
  },
  delete: {
    params: z.object({ id: IdSchema }),
    result: z.object({ success: z.boolean() }),
  },
};

export const orgContracts: CrudContracts<
  z.infer<typeof OrganizationSchema>,
  z.infer<typeof CreateOrganizationSchema>,
  z.infer<typeof UpdateOrganizationSchema>,
  z.infer<typeof OrganizationListQuerySchema>
> = {
  create: {
    body: CreateOrganizationSchema,
    result: OrganizationSchema,
  },
  getById: {
    params: z.object({ id: IdSchema }),
    result: OrganizationSchema,
  },
  list: {
    query: OrganizationListQuerySchema,
    result: z.object({
      items: z.array(OrganizationSchema),
      nextCursor: z.string().optional(),
    }),
  },
  update: {
    params: z.object({ id: IdSchema }),
    body: UpdateOrganizationSchema,
    result: OrganizationSchema,
  },
  delete: {
    params: z.object({ id: IdSchema }),
    result: z.object({ success: z.boolean() }),
  },
};

export const projectContracts: CrudContracts<
  z.infer<typeof ProjectSchema>,
  z.infer<typeof CreateProjectSchema>,
  z.infer<typeof UpdateProjectSchema>,
  z.infer<typeof ProjectListQuerySchema>
> = {
  create: {
    body: CreateProjectSchema,
    result: ProjectSchema,
  },
  getById: {
    params: z.object({ id: IdSchema }),
    result: ProjectSchema,
  },
  list: {
    query: ProjectListQuerySchema,
    result: z.object({
      items: z.array(ProjectSchema),
      nextCursor: z.string().optional(),
    }),
  },
  update: {
    params: z.object({ id: IdSchema }),
    body: UpdateProjectSchema,
    result: ProjectSchema,
  },
  delete: {
    params: z.object({ id: IdSchema }),
    result: z.object({ success: z.boolean() }),
  },
};

export const authContracts = {
  login: {
    body: LoginSchema,
    result: AuthResponseSchema,
  },
  register: {
    body: RegisterSchema,
    result: AuthResponseSchema,
  },
  logout: {
    result: z.object({ success: z.boolean() }),
  },
  forgotPassword: {
    body: ForgotPasswordSchema,
    result: z.object({ success: z.boolean() }),
  },
  resetPassword: {
    body: ResetPasswordSchema,
    result: z.object({ success: z.boolean() }),
  },
  me: {
    result: UserSchema,
  },
};

// Export all contracts
export const contracts = {
  users: userContracts,
  orgs: orgContracts,
  projects: projectContracts,
  auth: authContracts,
};

// Export inferred types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserListQuery = z.infer<typeof UserListQuerySchema>;

export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;
export type OrganizationListQuery = z.infer<typeof OrganizationListQuerySchema>;

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type ProjectListQuery = z.infer<typeof ProjectListQuerySchema>;

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
