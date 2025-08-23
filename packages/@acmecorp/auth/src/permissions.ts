import type {
  User,
  UserRole,
  Permission,
  PermissionCheck,
  RolePermissions,
} from "./types";

// Role hierarchy and permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
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
  ],
  user: [
    "users:read",
    "users:write",
    "orgs:read",
    "orgs:write",
    "projects:read",
    "projects:write",
    "billing:read",
    "analytics:read",
  ],
  guest: ["users:read", "orgs:read", "projects:read"],
};

// Role hierarchy (higher roles inherit lower role permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  user: 2,
  guest: 1,
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  user: User | null,
  permission: Permission
): boolean {
  if (!user) return false;

  // Check explicit permissions first
  if (user.permissions.includes(permission)) {
    return true;
  }

  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  return rolePermissions.includes(permission);
}

/**
 * Check if a user has all required permissions
 */
export function hasPermissions(
  user: User | null,
  permissions: Permission[]
): PermissionCheck {
  if (!user) {
    return {
      hasPermission: false,
      missingPermissions: permissions,
    };
  }

  const missingPermissions = permissions.filter(
    (permission) => !hasPermission(user, permission)
  );

  return {
    hasPermission: missingPermissions.length === 0,
    missingPermissions,
  };
}

/**
 * Check if a user has a specific role or higher
 */
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;

  const userRoleLevel = ROLE_HIERARCHY[user.role];
  const requiredRoleLevel = ROLE_HIERARCHY[requiredRole];

  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Get all permissions for a user (role + explicit permissions)
 */
export function getUserPermissions(user: User | null): Permission[] {
  if (!user) return [];

  const rolePermissions = ROLE_PERMISSIONS[user.role];
  const explicitPermissions = user.permissions;

  // Combine and deduplicate
  return [...new Set([...rolePermissions, ...explicitPermissions])];
}

/**
 * Get role permissions mapping
 */
export function getRolePermissions(): RolePermissions[] {
  return Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
    role: role as UserRole,
    permissions,
  }));
}

/**
 * Check if a user can perform an action on a resource
 */
export function canPerformAction(
  user: User | null,
  resource: string,
  action: "read" | "write" | "delete"
): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(user, permission);
}

/**
 * Create a permission guard function
 */
export function createPermissionGuard(requiredPermissions: Permission[]) {
  return (user: User | null): PermissionCheck => {
    return hasPermissions(user, requiredPermissions);
  };
}

/**
 * Create a role guard function
 */
export function createRoleGuard(requiredRole: UserRole) {
  return (user: User | null): boolean => {
    return hasRole(user, requiredRole);
  };
}

/**
 * Get missing permissions for a user
 */
export function getMissingPermissions(
  user: User | null,
  requiredPermissions: Permission[]
): Permission[] {
  const check = hasPermissions(user, requiredPermissions);
  return check.missingPermissions;
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  user: User | null,
  permissions: Permission[]
): boolean {
  if (!user) return false;

  return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Validate permission format (resource:action)
 */
export function isValidPermission(
  permission: string
): permission is Permission {
  const validPermissions = Object.values(ROLE_PERMISSIONS).flat();
  return validPermissions.includes(permission as Permission);
}

/**
 * Parse permission into resource and action
 */
export function parsePermission(permission: Permission): {
  resource: string;
  action: string;
} {
  const [resource, action] = permission.split(":");
  return { resource, action };
}

/**
 * Get all resources from permissions
 */
export function getResourcesFromPermissions(
  permissions: Permission[]
): string[] {
  const resources = permissions.map(
    (permission) => parsePermission(permission).resource
  );
  return [...new Set(resources)];
}

/**
 * Get all actions for a specific resource
 */
export function getActionsForResource(
  user: User | null,
  resource: string
): string[] {
  const userPermissions = getUserPermissions(user);
  const resourcePermissions = userPermissions.filter((permission) =>
    permission.startsWith(`${resource}:`)
  );

  return resourcePermissions.map(
    (permission) => parsePermission(permission).action
  );
}
