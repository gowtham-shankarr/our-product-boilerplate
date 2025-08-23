# @acme/auth

A comprehensive authentication and authorization package for Next.js applications, built on top of NextAuth.js with type-safe permissions and role-based access control.

## Features

- 🔐 **NextAuth.js Integration** - Built on industry-standard NextAuth.js
- 🛡️ **Type-Safe Permissions** - Zod-validated permission system
- 👥 **Role-Based Access Control** - Hierarchical role system
- 🛣️ **Route Protection** - Easy-to-use route and API guards
- 🎣 **React Hooks** - Comprehensive hooks for auth state management
- 🔒 **Server-Side Security** - Server Actions and API route protection
- 📱 **OAuth Support** - Google, GitHub, and custom providers
- 🎨 **UI Components** - Ready-to-use auth components

## Quick Start

### 1. Install Dependencies

```bash
pnpm add next-auth @acmecorp/auth
```

### 2. Setup NextAuth Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { defaultAuthConfig } from "@acmecorp/auth";

const handler = NextAuth(defaultAuthConfig);
export { handler as GET, handler as POST };
```

### 3. Add Session Provider

```typescript
// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 4. Use Auth Hooks

```typescript
// components/UserMenu.tsx
"use client";

import { useAuth } from "@acmecorp/auth";

export function UserMenu() {
  const { user, signOut, hasPermission } = useAuth();

  if (!user) return null;

  return (
    <div>
      <span>Welcome, {user.name}</span>
      {hasPermission("users:write") && (
        <button>Admin Panel</button>
      )}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## Core Concepts

### User Roles

```typescript
type UserRole = "admin" | "user" | "guest";
```

- **admin**: Full access to all features
- **user**: Standard user access
- **guest**: Read-only access

### Permissions

Permissions follow the `resource:action` format:

```typescript
type Permission =
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
```

### User Interface

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Reference

### React Hooks

#### `useAuth()`

Main auth hook providing user state and auth methods.

```typescript
const {
  user,
  session,
  isLoading,
  isAuthenticated,
  signIn,
  signOut,
  hasPermission,
  hasPermissions,
  hasRole,
  getUserPermissions,
} = useAuth();
```

#### `usePermission(permission)`

Check if user has a specific permission.

```typescript
const canEditUsers = usePermission("users:write");
```

#### `usePermissions(permissions)`

Check multiple permissions at once.

```typescript
const { hasAll, hasAny, missing } = usePermissions([
  "users:read",
  "users:write",
]);
```

#### `useRole(role)`

Check if user has a specific role.

```typescript
const isAdmin = useRole("admin");
```

#### `useProtectedRoute()`

Protect routes based on permissions/roles.

```typescript
const { hasAccess, isLoading, redirect } = useProtectedRoute(
  ["users:read"],
  "user",
  "/auth/login"
);
```

### Permission System

#### `hasPermission(user, permission)`

Check if a user has a specific permission.

```typescript
import { hasPermission } from "@acmecorp/auth";

const canEdit = hasPermission(user, "users:write");
```

#### `hasPermissions(user, permissions)`

Check multiple permissions.

```typescript
const check = hasPermissions(user, ["users:read", "users:write"]);
if (check.hasPermission) {
  // User has all required permissions
} else {
  console.log("Missing:", check.missingPermissions);
}
```

#### `hasRole(user, role)`

Check if user has a specific role or higher.

```typescript
const isAdminOrHigher = hasRole(user, "admin");
```

### Route Protection

#### `withAuth()`

Protect API routes and pages.

```typescript
import { withAuth } from "@acmecorp/auth";

export const GET = withAuth(
  async (req, user) => {
    // User is authenticated and available
    return Response.json({ user });
  },
  {
    requiredPermissions: ["users:read"],
    redirectTo: "/auth/login",
  }
);
```

#### `withApiAuth()`

Protect API routes with JSON responses.

```typescript
export const POST = withApiAuth(
  async (req, user) => {
    return Response.json({ success: true });
  },
  {
    requiredRole: "admin",
  }
);
```

#### `withServerActionAuth()`

Protect Server Actions.

```typescript
import { withServerActionAuth } from "@acmecorp/auth";

export const updateUser = withServerActionAuth(
  async (formData, user) => {
    // Action logic here
  },
  { requiredPermissions: ["users:write"] }
);
```

### NextAuth Configuration

#### `defaultAuthConfig`

Default NextAuth configuration with credentials, Google, and GitHub providers.

#### `createAuthConfig()`

Create custom auth configuration.

```typescript
import { createAuthConfig } from "@acmecorp/auth";

const customConfig = createAuthConfig(
  [], // Additional providers
  {
    // Custom callbacks
    signIn: async ({ user, account }) => {
      // Custom sign-in logic
      return true;
    },
  },
  {
    // Additional options
    session: { maxAge: 60 * 60 * 24 * 7 }, // 7 days
  }
);
```

## Form Schemas

The package includes Zod schemas for form validation:

```typescript
import {
  LoginSchema,
  RegisterSchema,
  PasswordResetSchema,
} from "@acmecorp/auth";

// Validate login form
const loginData = LoginSchema.parse({
  email: "user@example.com",
  password: "password123",
});

// Validate registration form
const registerData = RegisterSchema.parse({
  name: "John Doe",
  email: "user@example.com",
  password: "password123",
  confirmPassword: "password123",
});
```

## Environment Variables

Required environment variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

## Integration Examples

### With Router Package

```typescript
import { useAuth } from "@acmecorp/auth";
import { routes } from "@/lib/routes";

function Navigation() {
  const { user, hasPermission } = useAuth();

  return (
    <nav>
      <RLink to={routes.dashboard}>Dashboard</RLink>
      {hasPermission("users:read") && (
        <RLink to={routes.admin.users}>Users</RLink>
      )}
    </nav>
  );
}
```

### With API Package

```typescript
import { withApiAuth } from "@acmecorp/auth";

export const GET = withApiAuth(
  async (req, user) => {
    // User is authenticated and available
    const users = await api.users.list();
    return Response.json(users);
  },
  {
    requiredPermissions: ["users:read"],
  }
);
```

### Protected Component

```typescript
import { useProtectedRoute } from "@acmecorp/auth";

function AdminPanel() {
  const { hasAccess, isLoading, redirect } = useProtectedRoute(
    ["users:write", "orgs:write"],
    "admin"
  );

  if (isLoading) return <Loading />;
  if (!hasAccess) {
    redirect();
    return null;
  }

  return <AdminPanelContent />;
}
```

## Best Practices

### 1. Always Validate Permissions Server-Side

```typescript
// ✅ Good - Server-side validation
export const POST = withApiAuth(
  async (req, user) => {
    // Permission already validated by guard
    return Response.json({ success: true });
  },
  { requiredPermissions: ["users:write"] }
);

// ❌ Bad - Client-side only
function Component() {
  const { hasPermission } = useAuth();
  if (!hasPermission("users:write")) return null;
  // This can be bypassed
}
```

### 2. Use Role Hierarchy

```typescript
// ✅ Good - Use role hierarchy
const isAdmin = hasRole(user, "admin");

// ❌ Bad - Check specific permissions for common operations
const isAdmin =
  hasPermission(user, "users:write") &&
  hasPermission(user, "orgs:write") &&
  hasPermission(user, "projects:write");
```

### 3. Implement Proper Error Handling

```typescript
const { hasAccess, isLoading } = useProtectedRoute(
  ["users:write"],
  "user"
);

if (isLoading) return <Loading />;
if (!hasAccess) return <AccessDenied />;
```

## Migration Guide

### From Basic NextAuth

1. Replace `useSession` with `useAuth`
2. Add permission checks using `hasPermission`
3. Protect routes using `withAuth` or `withApiAuth`
4. Use form schemas for validation

### From Custom Auth

1. Replace custom auth state with `useAuth`
2. Migrate permission logic to use the built-in system
3. Update route protection to use guards
4. Replace custom forms with Zod schemas

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check `NEXTAUTH_SECRET` is set
2. **Permission checks failing**: Verify user has correct role/permissions
3. **OAuth not working**: Check provider credentials in environment
4. **Type errors**: Ensure proper TypeScript configuration

### Debug Mode

Enable debug mode in development:

```typescript
const config = createAuthConfig(
  [],
  {},
  {
    debug: process.env.NODE_ENV === "development",
  }
);
```

## Contributing

This package is part of the @acme monorepo. See the main README for contribution guidelines.
