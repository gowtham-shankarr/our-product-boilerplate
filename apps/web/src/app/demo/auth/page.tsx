"use client";

import { useState } from "react";
import { Button } from "@acmecorp/ui";
import {
  useAuth,
  usePermission,
  usePermissions,
  useRole,
  hasPermission,
  hasRole,
  getUserPermissions,
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
  type User,
  type Permission,
  type UserRole,
} from "@acmecorp/auth";

// Mock user data for demo
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    permissions: ["users:read", "users:write", "users:delete"] as Permission[],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "user",
    permissions: ["users:read", "orgs:read"] as Permission[],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "guest@example.com",
    name: "Guest User",
    role: "guest",
    permissions: [] as Permission[],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function AuthDemoPage() {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [testPermission, setTestPermission] = useState("users:read");
  const [testRole, setTestRole] = useState("user");

  // Auth hooks (these would work with real NextAuth in a real app)
  const {
    user,
    isLoading,
    isAuthenticated,
    hasPermission: userHasPermission,
  } = useAuth();
  const canReadUsers = usePermission("users:read");
  const { hasAll, hasAny, missing } = usePermissions([
    "users:read",
    "users:write",
  ]);
  const isAdmin = useRole("admin");

  // Permission checking functions
  const checkPermission = () => {
    return hasPermission(selectedUser, testPermission as any);
  };

  const checkRole = () => {
    return hasRole(selectedUser, testRole as any);
  };

  const getUserPerms = () => {
    return getUserPermissions(selectedUser);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Auth Package Demo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">User Selection</h2>
          <div className="space-y-2">
            {mockUsers.map((user) => (
              <Button
                key={user.id}
                variant={selectedUser.id === user.id ? "default" : "outline"}
                onClick={() => setSelectedUser(user)}
                className="w-full justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email} ({user.role})
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Current User Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current User</h2>
          <div className="p-4 border rounded-lg">
            <div className="space-y-2">
              <div>
                <strong>Name:</strong> {selectedUser.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div>
                <strong>Role:</strong> {selectedUser.role}
              </div>
              <div>
                <strong>Permissions:</strong>
              </div>
              <ul className="list-disc list-inside ml-4">
                {selectedUser.permissions.map((perm) => (
                  <li key={perm} className="text-sm">
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Testing */}
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-semibold">Permission Testing</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Single Permission Test */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Test Single Permission</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Permission:
                </label>
                <select
                  value={testPermission}
                  onChange={(e) => setTestPermission(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="users:read">users:read</option>
                  <option value="users:write">users:write</option>
                  <option value="users:delete">users:delete</option>
                  <option value="orgs:read">orgs:read</option>
                  <option value="orgs:write">orgs:write</option>
                  <option value="projects:read">projects:read</option>
                </select>
              </div>
              <div className="p-3 bg-muted rounded">
                <strong>Result:</strong>{" "}
                {checkPermission() ? "✅ Has permission" : "❌ No permission"}
              </div>
            </div>
          </div>

          {/* Role Test */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Test Role</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Required Role:
                </label>
                <select
                  value={testRole}
                  onChange={(e) => setTestRole(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="guest">guest</option>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="p-3 bg-muted rounded">
                <strong>Result:</strong>{" "}
                {checkRole() ? "✅ Has role or higher" : "❌ Insufficient role"}
              </div>
            </div>
          </div>
        </div>

        {/* All User Permissions */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-4">
            All User Permissions (Role + Explicit)
          </h3>
          <div className="p-3 bg-muted rounded">
            <div className="text-sm">
              {getUserPerms().map((perm) => (
                <span
                  key={perm}
                  className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded mr-2 mb-2"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Hierarchy */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Role Hierarchy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ROLE_HIERARCHY).map(([role, level]) => (
            <div key={role} className="p-4 border rounded-lg">
              <h3 className="font-medium capitalize">{role}</h3>
              <p className="text-sm text-muted-foreground">Level: {level}</p>
              <div className="mt-2">
                <div className="text-sm font-medium">Permissions:</div>
                <div className="text-xs space-y-1 mt-1">
                  {ROLE_PERMISSIONS[role as UserRole].map(
                    (perm: Permission) => (
                      <div key={perm} className="text-muted-foreground">
                        {perm}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hook Examples */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">React Hook Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">usePermission('users:read')</h3>
            <div className="p-2 bg-muted rounded">
              Result: {canReadUsers ? "✅ True" : "❌ False"}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">useRole('admin')</h3>
            <div className="p-2 bg-muted rounded">
              Result: {isAdmin ? "✅ True" : "❌ False"}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">
              usePermissions(['users:read', 'users:write'])
            </h3>
            <div className="p-2 bg-muted rounded text-sm">
              <div>Has All: {hasAll ? "✅" : "❌"}</div>
              <div>Has Any: {hasAny ? "✅" : "❌"}</div>
              <div>
                Missing: {missing.length > 0 ? missing.join(", ") : "None"}
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">useAuth()</h3>
            <div className="p-2 bg-muted rounded text-sm">
              <div>Loading: {isLoading ? "Yes" : "No"}</div>
              <div>Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
              <div>User: {user ? user.name : "None"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Usage Examples</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Conditional Rendering</h3>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              {`{hasPermission('users:write') && <button>Edit Users</button>}`}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Route Protection</h3>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              {`const { hasAccess } = useProtectedRoute(['users:read'], 'user')`}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">API Route Guard</h3>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              {`export const GET = withApiAuth(handler, { requiredPermissions: ['users:read'] })`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
