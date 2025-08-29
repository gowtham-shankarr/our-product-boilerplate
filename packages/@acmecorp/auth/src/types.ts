import type { z } from "zod";
import type {
  UserSchema,
  SessionSchema,
  UserRoleSchema,
  PermissionSchema,
} from "./schemas";

// Core types inferred from schemas
export type User = z.infer<typeof UserSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type Permission = z.infer<typeof PermissionSchema>;

// Auth state
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Permission checking
export interface PermissionCheck {
  hasPermission: boolean;
  missingPermissions: Permission[];
  userPermissions: Permission[];
}

// Role hierarchy
export type RolePermissions = Record<UserRole, Permission[]>;

// Auth configuration
export interface AuthConfig {
  providers: string[];
  session: {
    strategy: "jwt" | "database";
    maxAge: number;
  };
  pages: {
    signIn: string;
    signOut: string;
    error: string;
    verifyRequest: string;
    newUser: string;
  };
}

// Auth callbacks
export interface AuthCallbacks {
  onSignIn?: (user: User) => void | Promise<void>;
  onSignOut?: (session: Session) => void | Promise<void>;
  onSession?: (session: Session) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
}

// Route guard options
export interface RouteGuardOptions {
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

// API guard options
export interface ApiGuardOptions {
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  allowUnauthenticated?: boolean;
}

// Database adapter types
export interface DatabaseAdapter {
  createUser: (data: Partial<User>) => Promise<User>;
  getUser: (id: string) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  createSession: (data: Partial<Session>) => Promise<Session>;
  getSession: (token: string) => Promise<Session | null>;
  updateSession: (token: string, data: Partial<Session>) => Promise<Session>;
  deleteSession: (token: string) => Promise<void>;
  createVerificationToken: (data: {
    identifier: string;
    token: string;
    expires: Date;
  }) => Promise<void>;
  useVerificationToken: (data: {
    identifier: string;
    token: string;
  }) => Promise<void>;
}

// Email service types
export interface EmailService {
  sendVerificationEmail: (email: string, token: string) => Promise<void>;
  sendPasswordResetEmail: (email: string, token: string) => Promise<void>;
  sendWelcomeEmail: (email: string, name: string) => Promise<void>;
}

// Auth service types
export interface AuthService {
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<User>;
  signOut: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changePassword: (
    userId: string,
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  updateProfile: (userId: string, data: Partial<User>) => Promise<User>;
  assignRole: (
    userId: string,
    role: UserRole,
    permissions?: Permission[]
  ) => Promise<User>;
}
