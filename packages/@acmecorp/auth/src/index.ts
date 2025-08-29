// Core types and interfaces
export type {
  User,
  UserRole,
  Permission,
  Session,
  AuthState,
  PermissionCheck,
  RolePermissions,
  AuthConfig,
  AuthCallbacks,
  RouteGuardOptions,
  ApiGuardOptions,
} from "./types";

// Zod schemas and form types
export {
  EmailSchema,
  PasswordSchema,
  NameSchema,
  UserRoleSchema,
  PermissionSchema,
  UserSchema,
  SessionSchema,
  LoginSchema,
  RegisterSchema,
  PasswordResetRequestSchema,
  PasswordResetSchema,
  PasswordChangeSchema,
  ProfileUpdateSchema,
  RoleAssignmentSchema,
  PermissionCheckSchema,
  AuthStateSchema,
  EmailVerificationSchema,
  // Inferred types
  type LoginForm,
  type RegisterForm,
  type PasswordResetRequestForm,
  type PasswordResetForm,
  type PasswordChangeForm,
  type ProfileUpdateForm,
  type RoleAssignmentForm,
  type PermissionCheckForm,
  type EmailVerificationForm,
} from "./schemas";

// Permission system
export {
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
  hasPermission,
  hasPermissions,
  hasRole,
  getUserPermissions,
  getRolePermissions,
  canPerformAction,
  createPermissionGuard,
  createRoleGuard,
  getMissingPermissions,
  hasAnyPermission,
  isValidPermission,
  parsePermission,
  getResourcesFromPermissions,
  getActionsForResource,
} from "./permissions";

// Route and API protection
export {
  checkRouteAccess,
  withApiAuth,
  withServerActionAuth,
  withPermission,
  withRole,
  createAuthMiddleware,
  isProtectedRoute,
  getAuthRedirectUrl,
} from "./guards";

// React hooks
export {
  useAuth,
  usePermission,
  usePermissions,
  useRole,
  useUserPermissions,
  useAuthNavigation,
  useAuthStateChange,
  useProtectedRoute,
  useAuthForm,
} from "./hooks";

// NextAuth configuration
export {
  defaultAuthConfig,
  createAuthConfig,
  getServerSession,
  requireAuth,
  getCurrentUser,
  useSession,
  isAuthenticated,
  hasValidSession,
  validateAuthConfig,
} from "./nextauth";
