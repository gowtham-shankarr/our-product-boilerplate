"use client";

import { useState } from "react";
import { Button } from "@acmecorp/ui";
import {
  useAuth,
  usePermission,
  usePermissions,
  useRole,
  useUserPermissions,
  hasPermission,
  hasPermissions,
  hasRole,
  getUserPermissions,
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
  type User,
  type Permission,
  type UserRole,
} from "@acmecorp/auth";

export default function AuthDemoPage() {
  const [testPermission, setTestPermission] = useState("users_read");
  const [testRole, setTestRole] = useState("user");

  // Use real auth hooks
  const { user, isAuthenticated, isLoading } = useAuth();
  const canReadUsers = usePermission("users_read");
  const permissionsCheck = usePermissions(["users_read", "users_write"]);
  const isAdmin = useRole("admin");
  const userPermissions = useUserPermissions();

  // Permission checking functions
  const checkPermission = () => {
    if (!user) return false;
    return hasPermission(user, testPermission as any);
  };

  const checkRole = () => {
    if (!user) return false;
    return hasRole(user, testRole as any);
  };

  const getUserPerms = () => {
    if (!user) return [];
    return getUserPermissions(user);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Auth Package Demo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Auth Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Authentication Status</h2>
          <div className="p-4 border rounded-lg">
            <div className="space-y-2">
              <div>
                <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
              </div>
              <div>
                <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
              </div>
              <div>
                <strong>User:</strong> {user ? user.name || user.email : "None"}
              </div>
              {user && (
                <>
                  <div>
                    <strong>Role:</strong> {user.role}
                  </div>
                  <div>
                    <strong>Permissions:</strong>
                  </div>
                  <ul className="list-disc list-inside ml-4">
                    {user.permissions.map((perm) => (
                      <li key={perm} className="text-sm">
                        {perm}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Integration Status</h2>
          <div className="p-4 border rounded-lg">
            <div className="space-y-2">
              <div className="text-sm">
                <strong>NextAuth Integration:</strong>
                <div className="mt-1 p-2 bg-yellow-50 border rounded text-xs">
                  ⚠️ Not implemented - Replace placeholders in auth package
                </div>
              </div>
              <div className="text-sm">
                <strong>Database Integration:</strong>
                <div className="mt-1 p-2 bg-yellow-50 border rounded text-xs">
                  ⚠️ Not implemented - Add database queries
                </div>
              </div>
              <div className="text-sm">
                <strong>Environment Setup:</strong>
                <div className="mt-1 p-2 bg-yellow-50 border rounded text-xs">
                  ⚠️ Create .env file with DATABASE_URL and NEXTAUTH_SECRET
                </div>
              </div>
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
                  <option value="users_read">users_read</option>
                  <option value="users_write">users_write</option>
                  <option value="users_delete">users_delete</option>
                  <option value="orgs_read">orgs_read</option>
                  <option value="orgs_write">orgs_write</option>
                  <option value="projects_read">projects_read</option>
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
              {user ? (
                getUserPerms().map((perm) => (
                  <span
                    key={perm}
                    className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded mr-2 mb-2"
                  >
                    {perm}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">No user logged in</span>
              )}
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
            <h3 className="font-medium mb-2">usePermission('users_read')</h3>
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
              usePermissions(['users_read', 'users_write'])
            </h3>
            <div className="p-2 bg-muted rounded text-sm">
              <div>Has All: {permissionsCheck.hasPermission ? "✅" : "❌"}</div>
              <div>
                Missing:{" "}
                {permissionsCheck.missingPermissions.length > 0
                  ? permissionsCheck.missingPermissions.join(", ")
                  : "None"}
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">useAuth()</h3>
            <div className="p-2 bg-muted rounded text-sm">
              <div>Loading: {isLoading ? "Yes" : "No"}</div>
              <div>Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
              <div>User: {user ? user.name || user.email : "None"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Setup Instructions</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">1. Environment Setup</h3>
            <div className="text-sm space-y-2">
              <p>
                Create a <code className="bg-muted px-1 rounded">.env</code>{" "}
                file with:
              </p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"`}
              </pre>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">2. Database Migration</h3>
            <div className="text-sm space-y-2">
              <p>Run database migrations:</p>
              <pre className="bg-muted p-3 rounded text-xs">
                {`cd packages/@acmecorp/db
pnpm db:migrate`}
              </pre>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">3. NextAuth Integration</h3>
            <div className="text-sm space-y-2">
              <p>
                Replace placeholders in auth package with real implementations:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Update <code className="bg-muted px-1 rounded">hooks.ts</code>{" "}
                  with NextAuth useSession
                </li>
                <li>
                  Update{" "}
                  <code className="bg-muted px-1 rounded">nextauth.ts</code>{" "}
                  with database queries
                </li>
                <li>
                  Update{" "}
                  <code className="bg-muted px-1 rounded">guards.ts</code> with
                  getServerSession
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">4. Usage Examples</h3>
            <div className="text-sm space-y-2">
              <p>Conditional Rendering:</p>
              <pre className="bg-muted p-3 rounded text-xs">
                {`{hasPermission('users_write') && <button>Edit Users</button>}`}
              </pre>
              <p>Route Protection:</p>
              <pre className="bg-muted p-3 rounded text-xs">
                {`const { hasAccess } = useProtectedRoute(['users_read'], 'user')`}
              </pre>
              <p>API Route Guard:</p>
              <pre className="bg-muted p-3 rounded text-xs">
                {`export const GET = withApiAuth(handler, { requiredPermissions: ['users_read'] })`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
