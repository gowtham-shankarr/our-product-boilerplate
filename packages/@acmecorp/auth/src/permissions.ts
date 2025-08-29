import type {
  User,
  UserRole,
  Permission,
  PermissionCheck,
  RolePermissions,
} from "./types";

// Role hierarchy - higher numbers have more permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  user: 1,
  admin: 2,
};

// Default permissions for each role
export const ROLE_PERMISSIONS: RolePermissions = {
  guest: [],
  user: ["users_read", "orgs_read", "projects_read"],
  admin: [
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
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User, permission: Permission): boolean {
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
 * Check if a user has all specified permissions
 */
export function hasPermissions(
  user: User,
  permissions: Permission[]
): PermissionCheck {
  if (!user) {
    return {
      hasPermission: false,
      missingPermissions: permissions,
      userPermissions: [],
    };
  }

  const userPermissions = getUserPermissions(user);
  const missingPermissions = permissions.filter(
    (permission) => !userPermissions.includes(permission)
  );

  return {
    hasPermission: missingPermissions.length === 0,
    missingPermissions,
    userPermissions,
  };
}

/**
 * Check if a user has a specific role or higher
 */
export function hasRole(user: User, requiredRole: UserRole): boolean {
  if (!user) return false;

  const userLevel = ROLE_HIERARCHY[user.role];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];

  return userLevel >= requiredLevel;
}

/**
 * Get all permissions for a user (role + explicit)
 */
export function getUserPermissions(user: User): Permission[] {
  if (!user) return [];

  const rolePermissions = ROLE_PERMISSIONS[user.role];
  const explicitPermissions = user.permissions;

  // Combine and deduplicate
  const allPermissions = new Set([...rolePermissions, ...explicitPermissions]);
  return Array.from(allPermissions);
}

/**
 * Get permissions for a specific role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if a user can perform a specific action
 */
export function canPerformAction(
  user: User,
  resource: string,
  action: string
): boolean {
  const permission = `${resource}_${action}` as Permission;
  return hasPermission(user, permission);
}

/**
 * Create a permission guard function
 */
export function createPermissionGuard(requiredPermissions: Permission[]) {
  return (user: User) => {
    return hasPermissions(user, requiredPermissions).hasPermission;
  };
}

/**
 * Create a role guard function
 */
export function createRoleGuard(requiredRole: UserRole) {
  return (user: User) => {
    return hasRole(user, requiredRole);
  };
}

/**
 * Get missing permissions for a user
 */
export function getMissingPermissions(
  user: User,
  requiredPermissions: Permission[]
): Permission[] {
  const userPermissions = getUserPermissions(user);
  return requiredPermissions.filter(
    (permission) => !userPermissions.includes(permission)
  );
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User,
  permissions: Permission[]
): boolean {
  if (!user) return false;

  const userPermissions = getUserPermissions(user);
  return permissions.some((permission) => userPermissions.includes(permission));
}

/**
 * Validate if a permission string is valid
 */
export function isValidPermission(
  permission: string
): permission is Permission {
  const validPermissions: Permission[] = [
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
  ];

  return validPermissions.includes(permission as Permission);
}

/**
 * Parse a permission string into resource and action
 */
export function parsePermission(permission: Permission): {
  resource: string;
  action: string;
} {
  const [resource, action] = permission.split("_");
  return { resource, action };
}

/**
 * Get all resources from a list of permissions
 */
export function getResourcesFromPermissions(
  permissions: Permission[]
): string[] {
  const resources = new Set<string>();

  permissions.forEach((permission) => {
    const { resource } = parsePermission(permission);
    resources.add(resource);
  });

  return Array.from(resources);
}

/**
 * Get all actions for a specific resource
 */
export function getActionsForResource(
  permissions: Permission[],
  resource: string
): string[] {
  return permissions
    .filter((permission) => parsePermission(permission).resource === resource)
    .map((permission) => parsePermission(permission).action);
}
