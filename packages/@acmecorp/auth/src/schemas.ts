import { z } from "zod";

// Base schemas
export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(8).max(128);
export const NameSchema = z.string().min(1).max(100);

// User role schema
export const UserRoleSchema = z.enum(["admin", "user", "guest"]);

// Permission schema
export const PermissionSchema = z.enum([
  "users:read",
  "users:write",
  "users:delete",
  "orgs:read",
  "orgs:write",
  "orgs:delete",
  "projects:read",
  "projects:write",
  "projects:delete",
  "billing:read",
  "billing:write",
  "analytics:read",
  "analytics:write",
]);

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: EmailSchema,
  name: NameSchema.optional(),
  avatar: z.string().url().optional(),
  role: UserRoleSchema,
  permissions: z.array(PermissionSchema),
  emailVerified: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Session schema
export const SessionSchema = z.object({
  user: UserSchema,
  expires: z.string(),
  accessToken: z.string().optional(),
});

// Login form schema
export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  rememberMe: z.boolean().optional(),
});

// Register form schema
export const RegisterSchema = z
  .object({
    name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Password reset schema
export const PasswordResetSchema = z.object({
  email: EmailSchema,
});

// Password change schema
export const PasswordChangeSchema = z
  .object({
    currentPassword: PasswordSchema,
    newPassword: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile update schema
export const ProfileUpdateSchema = z.object({
  name: NameSchema.optional(),
  avatar: z.string().url().optional(),
});

// Role assignment schema
export const RoleAssignmentSchema = z.object({
  userId: z.string(),
  role: UserRoleSchema,
  permissions: z.array(PermissionSchema).optional(),
});

// Permission check schema
export const PermissionCheckSchema = z.object({
  userId: z.string(),
  permissions: z.array(PermissionSchema),
});

// Auth state schema
export const AuthStateSchema = z.object({
  user: UserSchema.nullable(),
  session: SessionSchema.nullable(),
  isLoading: z.boolean(),
  isAuthenticated: z.boolean(),
});

// Inferred types
export type LoginForm = z.infer<typeof LoginSchema>;
export type RegisterForm = z.infer<typeof RegisterSchema>;
export type PasswordResetForm = z.infer<typeof PasswordResetSchema>;
export type PasswordChangeForm = z.infer<typeof PasswordChangeSchema>;
export type ProfileUpdateForm = z.infer<typeof ProfileUpdateSchema>;
export type RoleAssignmentForm = z.infer<typeof RoleAssignmentSchema>;
export type PermissionCheckForm = z.infer<typeof PermissionCheckSchema>;
