import { z } from "zod";
import { readSearch } from "./utils";

/**
 * Hook to read and validate route parameters
 */
export function useRouteParams<T extends z.ZodSchema>(schema: T): z.infer<T> {
  // This would use Next.js useParams() in a real implementation
  // For now, we'll return a placeholder that will be implemented when used in Next.js
  throw new Error(
    "useRouteParams must be used in a Next.js app with App Router"
  );
}

/**
 * Hook to read and validate search parameters
 */
export function useSearch<T extends z.ZodSchema>(schema: T): z.infer<T> {
  // This would use Next.js useSearchParams() in a real implementation
  // For now, we'll return a placeholder that will be implemented when used in Next.js
  throw new Error("useSearch must be used in a Next.js app with App Router");
}

/**
 * Read and validate search parameters from a search string
 * Can be used on both client and server
 */
export function readSearchParams<T extends z.ZodSchema>(
  schema: T,
  searchString: string
): z.infer<T> {
  return readSearch(schema, searchString);
}

/**
 * Extract parameters from a pathname using a route template
 */
export function extractParams(
  template: string,
  pathname: string
): Record<string, string | string[]> {
  const segments = template.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);
  const params: Record<string, string | string[]> = {};

  let templateIndex = 0;
  let pathIndex = 0;

  while (templateIndex < segments.length && pathIndex < pathSegments.length) {
    const templateSegment = segments[templateIndex];
    const pathSegment = pathSegments[pathIndex];

    if (templateSegment.startsWith("[[...") && templateSegment.endsWith("]]")) {
      // Optional catch-all: [[...param]]
      const paramName = templateSegment.slice(5, -2);
      const remainingSegments = pathSegments.slice(pathIndex);
      if (remainingSegments.length > 0) {
        params[paramName] = remainingSegments;
      }
      break;
    } else if (
      templateSegment.startsWith("[...") &&
      templateSegment.endsWith("]")
    ) {
      // Catch-all: [...param]
      const paramName = templateSegment.slice(4, -1);
      const remainingSegments = pathSegments.slice(pathIndex);
      params[paramName] = remainingSegments;
      break;
    } else if (
      templateSegment.startsWith("[") &&
      templateSegment.endsWith("]")
    ) {
      // Dynamic: [param]
      const paramName = templateSegment.slice(1, -1);
      params[paramName] = pathSegment;
      templateIndex++;
      pathIndex++;
    } else {
      // Static segment
      if (templateSegment !== pathSegment) {
        throw new Error(
          `Path segment mismatch: expected "${templateSegment}", got "${pathSegment}"`
        );
      }
      templateIndex++;
      pathIndex++;
    }
  }

  return params;
}

/**
 * Validate that a pathname matches a template and extract params
 */
export function matchAndExtractParams(
  template: string,
  pathname: string
): { match: boolean; params?: Record<string, string | string[]> } {
  try {
    const params = extractParams(template, pathname);
    return { match: true, params };
  } catch {
    return { match: false };
  }
}
