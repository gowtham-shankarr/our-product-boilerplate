import { z } from "zod";

/**
 * Standardized API error codes
 */
export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "INTERNAL";

/**
 * Field-level validation error
 */
export interface FieldError {
  field: string;
  code: string;
  message: string;
  path: string[];
}

/**
 * Standardized API error response
 */
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: unknown; // Includes field errors for VALIDATION_ERROR
  requestId: string;
  status: number;
}

/**
 * Standardized API response
 */
export type ApiResponse<T = any> =
  | { data: T; error?: never }
  | { data?: never; error: ApiError };

/**
 * Contract definition for API endpoints
 */
export interface ApiContract<
  TParams = any,
  TQuery = any,
  TBody = any,
  TResult = any,
> {
  params?: z.ZodSchema<TParams>;
  query?: z.ZodSchema<TQuery>;
  body?: z.ZodSchema<TBody>;
  result: z.ZodSchema<TResult>;
}

/**
 * CRUD contract set for a domain
 */
export interface CrudContracts<
  TEntity = any,
  TCreate = any,
  TUpdate = any,
  TListQuery = any,
> {
  create: ApiContract<{}, {}, TCreate, TEntity>;
  getById: ApiContract<{ id: string }, {}, {}, TEntity>;
  list: ApiContract<
    {},
    TListQuery,
    {},
    { items: TEntity[]; nextCursor?: string }
  >;
  update: ApiContract<{ id: string }, {}, TUpdate, TEntity>;
  delete: ApiContract<{ id: string }, {}, {}, { success: boolean }>;
}

/**
 * Request configuration for the fetcher
 */
export interface RequestConfig {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Response from the fetcher
 */
export interface FetcherResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
  requestId: string;
  notModified?: boolean;
}

/**
 * Client configuration
 */
export interface ClientConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: {
    attempts: number;
    backoff: "exponential" | "linear";
  };
  logging?: {
    level: "debug" | "info" | "warn" | "error";
    includeBody?: boolean;
    timing?: boolean;
  };
}

/**
 * Navigation options for useNav hook
 */
export interface NavigationOptions {
  params?: any;
  search?: any;
  hash?: string;
  scroll?: boolean;
  shallow?: boolean;
}

/**
 * Request context for middleware
 */
export interface RequestContext {
  requestId: string;
  userId?: string;
  orgId?: string;
  session?: any;
}
