# @acmecorp/api

A type-safe, contract-first API layer for Next.js applications with React Query integration, error handling, and server actions.

## Features

- **🔒 Type Safety**: Full TypeScript support with Zod validation
- **📋 Contract-First**: Define API contracts with Zod schemas
- **⚡ Performance**: Smart caching, retries, and request deduplication
- **🛡️ Error Handling**: Consistent error responses with field-level validation
- **🎯 React Query Integration**: Pre-built hooks and utilities
- **🔄 Server Actions**: Type-safe form handling with validation
- **📊 Monitoring**: Request IDs for tracing and debugging

## Quick Start

### 1. Create API Client

```typescript
// lib/api.ts
import { createClient, contracts } from '@acmecorp/api'

export const api = createClient(contracts, {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  retries: { attempts: 3, backoff: 'exponential' },
  logging: { level: 'debug', includeBody: true, timing: true }
})
```

### 2. Use in Components

```tsx
// components/UserList.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { api, queryKeys, queryConfig } from '@acmecorp/api'

export function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: queryKeys.users.list({ limit: 20 }),
    queryFn: () => api.users.list({ query: { limit: 20 } }),
    ...queryConfig.list
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {users?.items.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

### 3. Create Mutations

```tsx
// components/CreateUser.tsx
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, queryKeys, mutationConfig } from '@acmecorp/api'

export function CreateUser() {
  const queryClient = useQueryClient()
  
  const createUser = useMutation({
    mutationFn: (data: CreateUser) => api.users.create({ body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
    ...mutationConfig.create
  })

  const handleSubmit = async (formData: FormData) => {
    try {
      await createUser.mutateAsync({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
      })
    } catch (error) {
      // Error handling is automatic
      console.log('Field errors:', error.details)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit" disabled={createUser.isLoading}>
        {createUser.isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  )
}
```

## API Reference

### Contracts

Define your API contracts with Zod schemas:

```typescript
import { z } from 'zod'
import type { CrudContracts } from '@acmecorp/api'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export const userContracts: CrudContracts = {
  create: {
    body: CreateUserSchema,
    result: UserSchema,
  },
  getById: {
    params: z.object({ id: z.string() }),
    result: UserSchema,
  },
  list: {
    query: z.object({ limit: z.number().optional() }),
    result: z.object({
      items: z.array(UserSchema),
      nextCursor: z.string().optional(),
    }),
  },
  update: {
    params: z.object({ id: z.string() }),
    body: CreateUserSchema.partial(),
    result: UserSchema,
  },
  delete: {
    params: z.object({ id: z.string() }),
    result: z.object({ success: z.boolean() }),
  },
}
```

### Transport Layer

The transport layer handles HTTP requests with retries, caching, and error handling:

```typescript
import { fetcher, createClient } from '@acmecorp/api'

// Direct fetcher usage
const response = await fetcher({
  path: '/users',
  method: 'GET',
  query: { limit: 20 },
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000,
})

// Create typed client
const api = createClient(contracts, {
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  retries: { attempts: 3, backoff: 'exponential' },
  logging: { level: 'debug', includeBody: true, timing: true }
})

// Type-safe API calls
const user = await api.users.getById({ params: { id: '123' } })
const users = await api.users.list({ query: { limit: 20 } })
const newUser = await api.users.create({ body: { name: 'John', email: 'john@example.com' } })
```

### Error Handling

Consistent error handling across all API calls:

```typescript
import { errors, createErrorHandlers } from '@acmecorp/api'

// Error creators
const badRequest = errors.badRequest('Invalid input')
const unauthorized = errors.unauthorized('Please log in')
const validation = errors.validation(zodError)

// Error handlers
const { isError, getFieldErrors, getErrorMessage } = createErrorHandlers()

try {
  const result = await api.users.create({ body: data })
} catch (error) {
  if (isError.validation(error)) {
    const fieldErrors = getFieldErrors(error)
    // Handle field-level errors
  }
  
  const message = getErrorMessage(error)
  // Show user-friendly error message
}
```

### React Query Integration

Pre-built utilities for React Query:

```typescript
import { 
  queryKeys, 
  createInvalidationHelpers, 
  createOptimisticHelpers,
  queryConfig,
  mutationConfig 
} from '@acmecorp/api'

// Query keys
const userKeys = queryKeys.users
const userListKey = userKeys.list({ limit: 20 })
const userDetailKey = userKeys.detail('123')

// Invalidation helpers
const queryClient = useQueryClient()
const { invalidate, invalidateList, invalidateDetail } = createInvalidationHelpers(queryClient)

invalidate.users() // Invalidate all user queries
invalidateList.users({ limit: 20 }) // Invalidate specific list
invalidateDetail.users('123') // Invalidate specific detail

// Optimistic updates
const { updateUser, addToList } = createOptimisticHelpers(queryClient)

updateUser('123', { name: 'New Name' })
addToList('users', { limit: 20 }, newUser)

// Query configuration
const { data } = useQuery({
  queryKey: userKeys.list({ limit: 20 }),
  queryFn: () => api.users.list({ query: { limit: 20 } }),
  ...queryConfig.list // Pre-configured options
})

// Mutation configuration
const mutation = useMutation({
  mutationFn: (data) => api.users.create({ body: data }),
  ...mutationConfig.create // Pre-configured options
})
```

### Server Actions

Type-safe server actions with validation:

```typescript
// actions/users.ts
import { createServerAction, userContracts } from '@acmecorp/api'

export const createUserAction = createServerAction(
  userContracts.create,
  async ({ body }) => {
    // body is already validated
    const user = await createUserInDatabase(body)
    return user
  }
)

// In your component
export function CreateUserForm() {
  return (
    <form action={createUserAction}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  )
}
```

## Configuration

### Client Configuration

```typescript
const config = {
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  retries: {
    attempts: 3,
    backoff: 'exponential', // or 'linear'
  },
  logging: {
    level: 'debug', // 'debug' | 'info' | 'warn' | 'error'
    includeBody: true,
    timing: true,
  },
}
```

### Retry Policy

- **Network errors**: Retry with exponential backoff (250ms, 800ms, 2000ms)
- **5xx errors**: Retry with exponential backoff
- **429 rate limits**: Single retry after `Retry-After` header
- **4xx errors**: No retry (except 429)

### Caching

- **ETag support**: Automatic `If-None-Match` headers for GET requests
- **304 responses**: Handle `notModified` responses
- **Idempotency**: Support for `Idempotency-Key` headers

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid request |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `VALIDATION_ERROR` | 422 | Validation failed |
| `INTERNAL` | 500 | Internal server error |

## Adding New Domains

1. **Define schemas**:
```typescript
// contracts/products.ts
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
})

export const productContracts: CrudContracts = {
  create: { body: CreateProductSchema, result: ProductSchema },
  getById: { params: z.object({ id: z.string() }), result: ProductSchema },
  list: { query: ProductListQuerySchema, result: ProductListSchema },
  update: { params: z.object({ id: z.string() }), body: UpdateProductSchema, result: ProductSchema },
  delete: { params: z.object({ id: z.string() }), result: z.object({ success: z.boolean() }) },
}
```

2. **Add to contracts**:
```typescript
// contracts/index.ts
export const contracts = {
  users: userContracts,
  orgs: orgContracts,
  projects: projectContracts,
  auth: authContracts,
  products: productContracts, // Add new domain
}
```

3. **Use in components**:
```typescript
const products = await api.products.list({ query: { limit: 20 } })
```

## Best Practices

1. **Always use contracts** for type safety
2. **Handle errors gracefully** with field-level validation
3. **Use React Query** for caching and state management
4. **Implement optimistic updates** for better UX
5. **Add request IDs** for debugging
6. **Use server actions** for form handling
7. **Validate inputs** with Zod schemas

## Migration from tRPC

The API package is designed to work alongside tRPC. You can:

1. **Start with REST** using this package
2. **Add tRPC later** for complex bidirectional communication
3. **Share contracts** between REST and tRPC
4. **Gradually migrate** endpoints as needed

## Troubleshooting

### Common Issues

1. **Type errors**: Ensure contracts match your API endpoints
2. **Validation errors**: Check Zod schemas and input data
3. **Retry loops**: Verify error handling and retry policies
4. **Cache issues**: Use React Query DevTools for debugging

### Debugging

1. **Enable debug logging**:
```typescript
const api = createClient(contracts, {
  logging: { level: 'debug', includeBody: true, timing: true }
})
```

2. **Check request IDs** in logs and network tab
3. **Use React Query DevTools** for cache inspection
4. **Monitor error codes** and retry attempts

## Contributing

1. Follow the contract-first approach
2. Add comprehensive error handling
3. Include TypeScript types
4. Write tests for new features
5. Update documentation
