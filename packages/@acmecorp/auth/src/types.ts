// User roles
export type UserRole = "admin" | "user" | "guest";

// Permission system - resource:action format
export type Permission =
  | "users:read"
  | "users:write"
  | "users:delete"
  | "orgs:read"
  | "orgs:write"
  | "orgs:delete"
  | "projects:read"
  | "projects:write"
  | "projects:delete"
  | "billing:read"
  | "billing:write"
  | "analytics:read"
  | "analytics:write";

// Base user interface (similar to NextAuth DefaultSession["user"])
export interface BaseUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Extended user interface
export interface User extends BaseUser {
  role: UserRole;
  permissions: Permission[];
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Base session interface (similar to NextAuth DefaultSession)
export interface BaseSession {
  user: BaseUser;
  expires: string;
}

// Extended session interface
export interface Session extends BaseSession {
  user: User;
  accessToken?: string;
}

// Auth state for client-side
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Permission check result
export interface PermissionCheck {
  hasPermission: boolean;
  missingPermissions: Permission[];
}

// Role hierarchy
export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Auth configuration
export interface AuthConfig {
  providers: any[];
  session: {
    strategy: "jwt" | "database";
    maxAge: number;
  };
  roles: UserRole[];
  permissions: Permission[];
  loginPage: string;
  dashboardPage: string;
  maxLoginAttempts: number;
  sessionTimeout: number;
}

// NextAuth callback types
export interface AuthCallbacks {
  signIn?: (
    user: any,
    account: any,
    profile: any
  ) => boolean | Promise<boolean>;
  redirect?: (url: string, baseUrl: string) => string | Promise<string>;
  session?: (session: Session, user: any) => Session | Promise<Session>;
  jwt?: (token: any, user: any, account: any) => any | Promise<any>;
}

// Route protection options
export interface RouteGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
}

// API route protection
export interface ApiGuardOptions {
  requireAuth?: boolean;
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  onUnauthorized?: (error: Error) => void;
}
