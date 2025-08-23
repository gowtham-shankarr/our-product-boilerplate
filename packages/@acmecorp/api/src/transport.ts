import ky from "ky";
import { z } from "zod";
import type { RequestConfig, FetcherResponse, ClientConfig } from "./types";
import {
  generateRequestId,
  normalizeError,
  mapStatusToErrorCode,
} from "./errors";

/**
 * Exponential backoff retry configuration
 */
const DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  backoff: [250, 800, 2000] as const, // Exponential backoff in ms
};

/**
 * Parse query parameters
 */
function serializeQuery(query?: Record<string, any>): string {
  if (!query) return "";

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.set(key, String(value));
      }
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Build URL with path parameters
 */
function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, any>
): string {
  let url = `${baseUrl}${path}`;

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`[${key}]`, encodeURIComponent(String(value)));
    }
  }

  return url;
}

/**
 * Create headers with request ID and idempotency
 */
function createHeaders(
  headers: Record<string, string> = {},
  requestId?: string,
  idempotencyKey?: string
): Record<string, string> {
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requestId) {
    defaultHeaders["x-request-id"] = requestId;
  }

  if (idempotencyKey) {
    defaultHeaders["Idempotency-Key"] = idempotencyKey;
  }

  return { ...defaultHeaders, ...headers };
}

/**
 * Handle ETag caching
 */
function handleETag(
  response: Response,
  requestId: string
): { notModified: boolean; etag?: string } {
  const etag = response.headers.get("ETag");
  const notModified = response.status === 304;

  if (notModified) {
    console.log(`[${requestId}] Response not modified (304)`);
  }

  return { notModified, etag: etag || undefined };
}

/**
 * Get ETag from storage (browser only)
 */
function getStoredETag(url: string): string | null {
  if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
    return (globalThis as any).localStorage.getItem(`etag:${url}`);
  }
  return null;
}

/**
 * Store ETag in storage (browser only)
 */
function storeETag(url: string, etag: string): void {
  if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
    (globalThis as any).localStorage.setItem(`etag:${url}`, etag);
  }
}

/**
 * Handle rate limiting with Retry-After
 */
async function handleRateLimit(
  response: Response,
  requestId: string
): Promise<{ shouldRetry: boolean; retryAfter?: number }> {
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const retryAfterMs = retryAfter ? parseInt(retryAfter) * 1000 : 5000;

    console.log(
      `[${requestId}] Rate limited, retrying after ${retryAfterMs}ms`
    );

    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
    return { shouldRetry: true, retryAfter: retryAfterMs };
  }

  return { shouldRetry: false };
}

/**
 * Core fetcher function with retries, ETag support, and error handling
 */
export async function fetcher<T = any>(
  config: RequestConfig,
  clientConfig: ClientConfig = {}
): Promise<FetcherResponse<T>> {
  const requestId = config.headers?.["x-request-id"] || generateRequestId();
  const startTime = Date.now();

  const {
    baseUrl = "",
    timeout = 10000,
    retries = DEFAULT_RETRY_CONFIG,
    logging = { level: "info", includeBody: false, timing: true },
  } = clientConfig;

  // Build URL
  const url =
    buildUrl(baseUrl, config.path, config.params) +
    serializeQuery(config.query);

  // Create headers
  const headers = createHeaders(
    config.headers,
    requestId,
    config.headers?.["Idempotency-Key"]
  );

  // Log request
  if (logging.level === "debug") {
    console.log(`[${requestId}] ${config.method} ${url}`);
    if (logging.includeBody && config.body) {
      console.log(`[${requestId}] Request body:`, config.body);
    }
  }

  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt < retries.attempts) {
    try {
      // Create ky instance with timeout
      const kyInstance = ky.create({
        timeout: timeout,
        retry: 0, // We handle retries manually
        hooks: {
          beforeRequest: [
            (request) => {
              // Add ETag if we have one cached
              const cachedETag = getStoredETag(url);
              if (cachedETag && config.method === "GET") {
                request.headers.set("If-None-Match", cachedETag);
              }
            },
          ],
        },
      });

      // Make request
      const response = await kyInstance(url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: config.signal,
      });

      // Handle rate limiting
      if (response.status === 429) {
        const { shouldRetry, retryAfter } = await handleRateLimit(
          response,
          requestId
        );
        if (shouldRetry && attempt < retries.attempts - 1) {
          attempt++;
          continue;
        }
      }

      // Handle ETag caching
      const { notModified, etag } = handleETag(response, requestId);

      if (etag && config.method === "GET") {
        storeETag(url, etag);
      }

      if (notModified) {
        return {
          data: null as T,
          status: 304,
          headers: response.headers,
          requestId,
          notModified: true,
        };
      }

      // Parse response
      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as T;
      }

      // Log response
      const duration = Date.now() - startTime;
      if (logging.level === "debug") {
        console.log(`[${requestId}] ${response.status} (${duration}ms)`);
        if (logging.includeBody) {
          console.log(`[${requestId}] Response:`, data);
        }
      } else if (logging.timing) {
        console.log(
          `[${requestId}] ${config.method} ${url} - ${response.status} (${duration}ms)`
        );
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
        requestId,
      };
    } catch (error) {
      lastError = error as Error;
      attempt++;

      // Don't retry on certain errors
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw error; // Don't retry aborted requests
        }

        // Check if it's a ky HTTPError
        if ("response" in error && error.response) {
          const response = error.response as any;
          const status = response?.status;

          // Don't retry 4xx errors (except 429 which we handle above)
          if (status >= 400 && status < 500 && status !== 429) {
            throw error;
          }
        }
      }

      // Log retry attempt
      if (attempt < retries.attempts) {
        const delay =
          retries.backoff[attempt - 1] ||
          retries.backoff[retries.backoff.length - 1];
        console.log(
          `[${requestId}] Attempt ${attempt} failed, retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay as number));
      }
    }
  }

  // All retries failed
  const duration = Date.now() - startTime;
  console.error(
    `[${requestId}] All ${retries.attempts} attempts failed (${duration}ms)`
  );

  throw lastError || new Error("Request failed");
}

/**
 * Create a typed API client from contracts
 */
export function createClient(contracts: any, config: ClientConfig = {}) {
  const client: any = {};

  for (const [domainName, domainContracts] of Object.entries(contracts)) {
    client[domainName] = {};

    for (const [methodName, contract] of Object.entries(
      domainContracts as any
    )) {
      client[domainName][methodName] = async (options: any = {}) => {
        const { params, query, body, headers, timeout, signal } = options;

        // Validate input using contract schemas
        let validatedParams: any = {};
        let validatedQuery: any = {};
        let validatedBody: any = {};

        const contractObj = contract as any;
        if (contractObj?.params && params) {
          validatedParams = contractObj.params.parse(params);
        }

        if (contractObj?.query && query) {
          validatedQuery = contractObj.query.parse(query);
        }

        if (contractObj?.body && body) {
          validatedBody = contractObj.body.parse(body);
        }

        // Determine HTTP method and path
        let method: string;
        let path: string;

        switch (methodName) {
          case "create":
            method = "POST";
            path = `/${domainName}`;
            break;
          case "getById":
            method = "GET";
            path = `/${domainName}/[id]`;
            break;
          case "list":
            method = "GET";
            path = `/${domainName}`;
            break;
          case "update":
            method = "PUT";
            path = `/${domainName}/[id]`;
            break;
          case "delete":
            method = "DELETE";
            path = `/${domainName}/[id]`;
            break;
          default:
            // For auth methods, use the method name as path
            method = "POST";
            path = `/auth/${methodName}`;
        }

        try {
          const response = await fetcher(
            {
              path,
              method: method as any,
              params: validatedParams,
              query: validatedQuery,
              body: validatedBody,
              headers,
              timeout,
              signal,
            },
            config
          );

          // Validate response using contract result schema
          if (contractObj?.result && response.data) {
            const validatedData = contractObj.result.parse(response.data);
            return { data: validatedData };
          }

          return { data: response.data };
        } catch (error) {
          // Normalize and re-throw errors
          if (error instanceof z.ZodError) {
            throw {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              details: error.errors,
              requestId: generateRequestId(),
              status: 422,
            };
          }

          if (error && typeof error === "object" && "response" in error) {
            const kyError = error as any;
            const response = kyError.response as any;
            const status = response?.status || 500;
            const requestId = generateRequestId();

            throw {
              code: mapStatusToErrorCode(status),
              message: kyError.message || "Request failed",
              requestId,
              status,
            };
          }

          throw error;
        }
      };
    }
  }

  return client;
}
