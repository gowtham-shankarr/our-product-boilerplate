import { z } from "zod";
import type { ApiContract } from "./types";
import { errors, createApiError, generateRequestId } from "./errors";

/**
 * Server action result type
 */
export type ServerActionResult<T = any> = 
  | { data: T; error?: never }
  | { data?: never; error: { code: string; message: string; details?: unknown } };

/**
 * Create a server action from a contract
 */
export function createServerAction<TParams = any, TQuery = any, TBody = any, TResult = any>(
  contract: ApiContract<TParams, TQuery, TBody, TResult>,
  handler: (validatedData: {
    params?: TParams;
    query?: TQuery;
    body?: TBody;
  }) => Promise<TResult>
) {
  return async (formData: FormData): Promise<ServerActionResult<TResult>> => {
    const requestId = generateRequestId();
    
    try {
      // Validate params if contract has them
      let validatedParams: TParams | undefined;
      if (contract.params) {
        const params = Object.fromEntries(formData.entries());
        validatedParams = contract.params.parse(params);
      }

      // Validate query if contract has them
      let validatedQuery: TQuery | undefined;
      if (contract.query) {
        const query = Object.fromEntries(formData.entries());
        validatedQuery = contract.query.parse(query);
      }

      // Validate body if contract has them
      let validatedBody: TBody | undefined;
      if (contract.body) {
        const body = Object.fromEntries(formData.entries());
        validatedBody = contract.body.parse(body);
      }

      // Call the handler with validated data
      const result = await handler({
        params: validatedParams,
        query: validatedQuery,
        body: validatedBody,
      });

      // Validate the result
      if (contract.result) {
        const validatedResult = contract.result.parse(result);
        return { data: validatedResult };
      }

      return { data: result };

    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const apiError = createApiError(
          errors.validation(error),
          requestId,
          422
        );
        
        return {
          error: {
            code: apiError.code,
            message: apiError.message,
            details: apiError.details,
          },
        };
      }

      // Handle other errors
      const apiError = createApiError(
        errors.internal(error instanceof Error ? error.message : 'Unknown error'),
        requestId,
        500
      );

      return {
        error: {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details,
        },
      };
    }
  };
}

/**
 * Create a server action for form data with custom validation
 */
export function createFormAction<TBody = any, TResult = any>(
  bodySchema: z.ZodSchema<TBody>,
  handler: (data: TBody) => Promise<TResult>
) {
  return async (formData: FormData): Promise<ServerActionResult<TResult>> => {
    const requestId = generateRequestId();
    
    try {
      // Convert FormData to object
      const formObject = Object.fromEntries(formData.entries());
      
      // Validate the form data
      const validatedData = bodySchema.parse(formObject);
      
      // Call the handler
      const result = await handler(validatedData);
      
      return { data: result };
      
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const apiError = createApiError(
          errors.validation(error),
          requestId,
          422
        );
        
        return {
          error: {
            code: apiError.code,
            message: apiError.message,
            details: apiError.details,
          },
        };
      }

      // Handle other errors
      const apiError = createApiError(
        errors.internal(error instanceof Error ? error.message : 'Unknown error'),
        requestId,
        500
      );

      return {
        error: {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details,
        },
      };
    }
  };
}

/**
 * Create a server action for JSON data
 */
export function createJsonAction<TBody = any, TResult = any>(
  bodySchema: z.ZodSchema<TBody>,
  handler: (data: TBody) => Promise<TResult>
) {
  return async (data: unknown): Promise<ServerActionResult<TResult>> => {
    const requestId = generateRequestId();
    
    try {
      // Validate the input data
      const validatedData = bodySchema.parse(data);
      
      // Call the handler
      const result = await handler(validatedData);
      
      return { data: result };
      
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const apiError = createApiError(
          errors.validation(error),
          requestId,
          422
        );
        
        return {
          error: {
            code: apiError.code,
            message: apiError.message,
            details: apiError.details,
          },
        };
      }

      // Handle other errors
      const apiError = createApiError(
        errors.internal(error instanceof Error ? error.message : 'Unknown error'),
        requestId,
        500
      );

      return {
        error: {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details,
        },
      };
    }
  };
}

/**
 * Helper to extract field errors from server action result
 */
export function extractFieldErrors(result: ServerActionResult): Record<string, string> {
  if (!result.error || result.error.code !== 'VALIDATION_ERROR') {
    return {};
  }

  const fieldErrors: Record<string, string> = {};
  
  if (Array.isArray(result.error.details)) {
    for (const detail of result.error.details as any[]) {
      if (detail.field && detail.message) {
        fieldErrors[detail.field] = detail.message;
      }
    }
  }

  return fieldErrors;
}

/**
 * Helper to check if server action was successful
 */
export function isSuccess(result: ServerActionResult): result is { data: any; error?: never } {
  return 'data' in result && !('error' in result);
}

/**
 * Helper to check if server action failed
 */
export function isError(result: ServerActionResult): result is { data?: never; error: any } {
  return 'error' in result && !('data' in result);
}

/**
 * Helper to get error message from server action result
 */
export function getErrorMessage(result: ServerActionResult): string {
  if (isSuccess(result)) {
    return '';
  }
  
  return result.error.message || 'An unexpected error occurred';
}

/**
 * Note: When using server actions with forms, consider adding CSRF protection:
 * 
 * 1. Add a CSRF token to your form:
 *    <input type="hidden" name="_csrf" value={csrfToken} />
 * 
 * 2. Validate the token in your server action:
 *    if (formData.get('_csrf') !== expectedToken) {
 *      return { error: { code: 'FORBIDDEN', message: 'Invalid CSRF token' } };
 *    }
 * 
 * 3. For API routes, consider using origin checks:
 *    const origin = headers.get('origin');
 *    if (origin && !allowedOrigins.includes(origin)) {
 *      return { error: { code: 'FORBIDDEN', message: 'Invalid origin' } };
 *    }
 */
