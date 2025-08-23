# @acmecorp/router

A typed URL construction and navigation helper for Next.js App Router applications.

## Features

- **Type-safe route definitions** with Zod validation
- **Dynamic segment support**: `[id]`, `[...slug]`, `[[...slug]]`
- **Nested route registries** with auto-generated builders
- **Typed navigation hooks** and components
- **Query parameter handling** with validation
- **Active link detection**
- **Zero runtime dependencies** (Next.js/React are peer dependencies)

## Installation

```bash
pnpm add @acmecorp/router
```

## Quick Start

### 1. Define Routes

```typescript
// lib/routes.ts
import { createRoute, createRouteRegistry } from "@acmecorp/router";
import { z } from "zod";

export const routes = createRouteRegistry({
  home: createRoute({
    name: "home",
    template: "/",
    paramsSchema: z.object({}),
  }),

  user: {
    profile: createRoute({
      name: "user.profile",
      template: "/profile/[userId]",
      paramsSchema: z.object({ userId: z.string() }),
      searchSchema: z.object({
        tab: z.enum(["overview", "settings"]).optional(),
      }),
    }),
  },

  org: {
    project: {
      details: createRoute({
        name: "org.project.details",
        template: "/orgs/[orgId]/projects/[projectId]",
        paramsSchema: z.object({
          orgId: z.string(),
          projectId: z.string(),
        }),
        searchSchema: z.object({
          view: z.enum(["kanban", "list"]).optional(),
        }),
      }),
    },
  },

  issues: createRoute({
    name: "issues",
    template: "/issues/[...slug]",
    paramsSchema: z.object({ slug: z.array(z.string()) }),
  }),

  search: createRoute({
    name: "search",
    template: "/search/[[...terms]]",
    paramsSchema: z.object({ terms: z.array(z.string()).optional() }),
  }),
});
```

### 2. Use in Components

```typescript
import { RLink, useNav, href } from '@acmecorp/router'
import { routes } from '@/lib/routes'

export function Navigation() {
  const nav = useNav()

  return (
    <nav>
      {/* Static route */}
      <RLink to={routes.home}>Home</RLink>

      {/* Dynamic route */}
      <RLink
        to={routes.user.profile}
        params={{ userId: 'user-123' }}
        search={{ tab: 'settings' }}
      >
        Profile
      </RLink>

      {/* Programmatic navigation */}
      <button onClick={() => nav.push(routes.org.project.details, {
        params: { orgId: 'acme', projectId: 'proj-123' },
        search: { view: 'kanban' }
      })}>
        View Project
      </button>
    </nav>
  )
}
```

### 3. Read Route Parameters

```typescript
// app/orgs/[orgId]/projects/[projectId]/page.tsx
import { useRouteParams, useSearch } from '@acmecorp/router'
import { routes } from '@/lib/routes'

export default function ProjectPage() {
  const params = useRouteParams(routes.org.project.details.paramsSchema)
  const search = useSearch(routes.org.project.details.searchSchema)

  // params: { orgId: string, projectId: string }
  // search: { view?: 'kanban' | 'list' }

  return (
    <div>
      <h1>Project: {params.projectId}</h1>
      <p>View: {search.view || 'default'}</p>
    </div>
  )
}
```

## API Reference

### Route Definition

#### `createRoute(config)`

Creates a route descriptor with validation schemas.

```typescript
createRoute({
  name: string,           // Unique route name
  template: string,       // Route template (e.g., "/users/[id]")
  paramsSchema: ZodSchema, // Validation for route parameters
  searchSchema?: ZodSchema // Validation for query parameters
})
```

#### `createRouteRegistry(routes)`

Creates a nested route registry with auto-generated builders.

### Navigation

#### `useNav()`

Returns navigation methods that accept typed route inputs.

```typescript
const nav = useNav();

nav.push(route, { params, search, hash });
nav.replace(route, { params, search, hash });
nav.prefetch(route);
nav.back();
nav.forward();
nav.refresh();
```

#### `RLink`

Typed Link component with active state detection.

```typescript
<RLink
  to={route}
  params={params}
  search={search}
  hash={hash}
  activeClassName="active"
>
  Link Text
</RLink>
```

### URL Generation

#### `href(input)`

Generates URLs with validation.

```typescript
href(route); // Static route
href(route, { params }); // With parameters
href(route, { params, search, hash }); // Full URL
```

#### `toHref(input)`

Converts any href input to a string URL.

### Parameter Reading

#### `useRouteParams(schema)`

Reads and validates route parameters.

#### `useSearch(schema)`

Reads and validates search parameters.

#### `readSearchParams(schema, searchString)`

Server-side search parameter reading.

### Utilities

#### `join(...segments)`

Safely joins path segments.

#### `withSearch(href, search)`

Adds search parameters to a URL.

#### `setQueryParam(href, key, value)`

Sets a single query parameter.

#### `removeQueryParam(href, key)`

Removes a query parameter.

## Dynamic Segments

### Single Dynamic: `[param]`

```typescript
template: "/users/[userId]";
paramsSchema: z.object({ userId: z.string() });
```

### Catch-all: `[...param]`

```typescript
template: "/issues/[...slug]";
paramsSchema: z.object({ slug: z.array(z.string()) });
// Matches: /issues/ui/bug/123
```

### Optional Catch-all: `[[...param]]`

```typescript
template: "/search/[[...terms]]";
paramsSchema: z.object({ terms: z.array(z.string()).optional() });
// Matches: /search or /search/react/typescript
```

## Type Safety

The router provides full TypeScript support:

- **Route names** are inferred from your registry
- **Parameters** are validated at runtime with Zod
- **Search parameters** are typed and validated
- **Navigation methods** accept only valid route inputs
- **Active state** is automatically detected

## Error Handling

Invalid parameters throw descriptive errors:

```typescript
// Error: Invalid params for route "user.profile": userId: Required
href(routes.user.profile, { params: {} });

// Error: Invalid search params for route "user.profile": tab: Invalid enum value
href(routes.user.profile, {
  params: { userId: "123" },
  search: { tab: "invalid" },
});
```

## Migration from String Literals

Replace string-based navigation:

```typescript
// Before
<Link href={`/users/${userId}?tab=${tab}`}>Profile</Link>

// After
<RLink
  to={routes.user.profile}
  params={{ userId }}
  search={{ tab }}
>
  Profile
</RLink>
```

## Examples

See the demo page at `/demo/routing` for comprehensive examples of all features.
