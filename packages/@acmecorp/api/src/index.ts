// Core types and interfaces
export type {
  ApiError,
  ApiErrorCode,
  FieldError,
  ApiResponse,
  ApiContract,
  CrudContracts,
  RequestConfig,
  FetcherResponse,
  ClientConfig,
  NavigationOptions,
  RequestContext,
} from "./types";

// Error handling
export {
  errors,
  generateRequestId,
  normalizeZodErrors,
  mapStatusToErrorCode,
  createApiError,
  normalizeError,
} from "./errors";

// Transport layer
export { fetcher, createClient } from "./transport";

// Contracts and schemas
export {
  contracts,
  userContracts,
  orgContracts,
  projectContracts,
  authContracts,
  // Base schemas
  IdSchema,
  EmailSchema,
  NameSchema,
  DescriptionSchema,
  PaginationQuerySchema,
  DateRangeQuerySchema,
  // User schemas
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  UserListQuerySchema,
  // Organization schemas
  OrganizationSchema,
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
  OrganizationListQuerySchema,
  // Project schemas
  ProjectSchema,
  CreateProjectSchema,
  UpdateProjectSchema,
  ProjectListQuerySchema,
  // Auth schemas
  LoginSchema,
  RegisterSchema,
  AuthResponseSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  // Inferred types
  type User,
  type CreateUser,
  type UpdateUser,
  type UserListQuery,
  type Organization,
  type CreateOrganization,
  type UpdateOrganization,
  type OrganizationListQuery,
  type Project,
  type CreateProject,
  type UpdateProject,
  type ProjectListQuery,
  type Login,
  type Register,
  type AuthResponse,
} from "./contracts";

// React Query helpers
export {
  queryKeys,
  createRetryPolicy,
  createInvalidationHelpers,
  createOptimisticHelpers,
  createErrorHandlers,
  queryConfig,
  mutationConfig,
} from "./rq";

// Server Actions
export {
  createServerAction,
  createFormAction,
  createJsonAction,
  extractFieldErrors,
  isSuccess,
  isError,
  getErrorMessage,
  type ServerActionResult,
} from "./actions";
