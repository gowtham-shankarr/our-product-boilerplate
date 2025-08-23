import { z } from "zod";
import type { ApiError, ApiErrorCode, FieldError } from "./types";

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Normalize Zod errors to field-level errors
 */
export function normalizeZodErrors(zodError: z.ZodError): FieldError[] {
  return zodError.errors.map(error => ({
    field: error.path.join('.'),
    code: error.code,
    message: error.message,
    path: error.path.map(String)
  }));
}

/**
 * Create standardized API errors
 */
export const errors = {
  badRequest: (message: string, details?: unknown): Omit<ApiError, 'requestId' | 'status'> => ({
    code: 'BAD_REQUEST',
    message,
    details
  }),

  unauthorized: (message = 'Authentication required'): Omit<ApiError, 'requestId' | 'status'> => ({
    code: 'UNAUTHORIZED',
    message
  }),

  forbidden: (message = 'Access denied'): Omit<ApiError, 'requestId' | 'status'> => ({
    code: 'FORBIDDEN',
    message
  }),

  notFound: (resource = 'Resource'): Omit<ApiError, 'requestId' | 'status'> => ({
    code: 'NOT_FOUND',
    message: `${resource} not found`
  }),

  conflict: (message: string): Omit<ApiError, 'requestId' | 'status'> => ({
    code: 'CONFLICT',
    message
  }),

  rateLimited: (retryAfter?: number): Omit<ApiError, 'requestId' | 'status'> => ({
    code: 'RATE_LIMITED',
    message: 'Too many requests',
    details: retryAfter ? { retryAfter } : undefined
  }),

  validation: (zodError: z.ZodError): Omit<ApiError, 'requestId' | 'status'> => ({
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details: normalizeZodErrors(zodError)
  }),

  internal: (message = 'Internal server error'): Omit<ApiError, 'requestId' | 'status'> => ({
    code: 'INTERNAL',
    message
  })
};

/**
 * Map HTTP status codes to error codes
 */
export function mapStatusToErrorCode(status: number): ApiErrorCode {
  switch (status) {
    case 400: return 'BAD_REQUEST';
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 409: return 'CONFLICT';
    case 429: return 'RATE_LIMITED';
    case 422: return 'VALIDATION_ERROR';
    default: return status >= 500 ? 'INTERNAL' : 'BAD_REQUEST';
  }
}

/**
 * Create a complete API error with request ID and status
 */
export function createApiError(
  error: Omit<ApiError, 'requestId' | 'status'>,
  requestId: string,
  status: number
): ApiError {
  return {
    ...error,
    requestId,
    status
  };
}

/**
 * Normalize any error to ApiError format
 */
export function normalizeError(
  error: unknown,
  requestId: string,
  status: number = 500
): ApiError {
  if (error instanceof z.ZodError) {
    return createApiError(errors.validation(error), requestId, 422);
  }

  if (error && typeof error === 'object' && 'code' in error) {
    // Already an ApiError-like object
    return createApiError(
      error as Omit<ApiError, 'requestId' | 'status'>,
      requestId,
      status
    );
  }

  // Generic error
  return createApiError(
    errors.internal(error instanceof Error ? error.message : 'Unknown error'),
    requestId,
    status
  );
}
