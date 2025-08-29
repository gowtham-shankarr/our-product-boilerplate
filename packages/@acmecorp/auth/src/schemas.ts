import { z } from "zod";

// Base schemas
export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(8).max(128);
export const NameSchema = z.string().min(1).max(100);

// User role schema - matches database enum
export const UserRoleSchema = z.enum(["admin", "user", "guest"]);

// Permission schema - matches database enum
export const PermissionSchema = z.enum([
  "users_read",
  "users_write",
  "users_delete",
  "orgs_read",
  "orgs_write",
  "orgs_delete",
  "projects_read",
  "projects_write",
  "projects_delete",
  "billing_read",
  "billing_write",
  "analytics_read",
  "analytics_write",
]);

// User schema - matches database model
export const UserSchema = z.object({
  id: z.string(),
  email: EmailSchema,
  name: NameSchema.optional(),
  image: z.string().url().optional(),
  role: UserRoleSchema,
  permissions: z.array(PermissionSchema),
  emailVerified: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Session schema - matches database model
export const SessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
  user: UserSchema,
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

// Password reset request schema
export const PasswordResetRequestSchema = z.object({
  email: EmailSchema,
});

// Password reset schema
export const PasswordResetSchema = z
  .object({
    token: z.string(),
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
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
  image: z.string().url().optional(),
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

// Email verification schema
export const EmailVerificationSchema = z.object({
  token: z.string(),
});

// Inferred types
export type LoginForm = z.infer<typeof LoginSchema>;
export type RegisterForm = z.infer<typeof RegisterSchema>;
export type PasswordResetRequestForm = z.infer<
  typeof PasswordResetRequestSchema
>;
export type PasswordResetForm = z.infer<typeof PasswordResetSchema>;
export type PasswordChangeForm = z.infer<typeof PasswordChangeSchema>;
export type ProfileUpdateForm = z.infer<typeof ProfileUpdateSchema>;
export type RoleAssignmentForm = z.infer<typeof RoleAssignmentSchema>;
export type PermissionCheckForm = z.infer<typeof PermissionCheckSchema>;
export type EmailVerificationForm = z.infer<typeof EmailVerificationSchema>;
