import { z } from "zod";
import type { HrefInput, RouteDescriptor, BuilderResult } from "./types";
import { resolveTemplate, serializeSearch } from "./utils";

/**
 * Convert any href input to a string URL
 */
export function toHref(input: HrefInput): string {
  if (typeof input === "string") {
    return input;
  }

  if (Array.isArray(input)) {
    const [descriptor, props] = input;
    return buildHref(descriptor, props);
  }

  if ("descriptor" in input && "params" in input) {
    // BuilderResult
    return buildHref((input as BuilderResult).descriptor, {
      params: (input as BuilderResult).params,
      search: (input as BuilderResult).search,
      hash: (input as BuilderResult).hash,
    });
  }

  // RouteDescriptor
  return buildHref(input as RouteDescriptor, {});
}

/**
 * Main href function for building URLs with validation
 */
export function href<TParams = any, TSearch = any>(
  input: HrefInput<TParams, TSearch>,
  options?: { params?: TParams; search?: TSearch; hash?: string }
): string {
  if (options) {
    const hrefInput =
      typeof input === "string" ? input : ([input, options] as any);
    return toHref(hrefInput);
  }
  return toHref(input);
}

/**
 * Build href from descriptor and props with validation
 */
function buildHref(
  descriptor: RouteDescriptor,
  props: { params?: any; search?: any; hash?: string } = {}
): string {
  const { params, search, hash } = props;

  // Validate params if provided
  if (params !== undefined) {
    try {
      descriptor.paramsSchema.parse(params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid params for route "${descriptor.name}": ${error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")}`
        );
      }
      throw error;
    }
  }

  // Validate search if provided
  if (search !== undefined && descriptor.searchSchema) {
    try {
      descriptor.searchSchema.parse(search);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid search params for route "${descriptor.name}": ${error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")}`
        );
      }
      throw error;
    }
  }

  // Build pathname
  const pathname = resolveTemplate(descriptor.template, params || {});

  // Add search params
  const searchString = search ? serializeSearch(search) : "";

  // Add hash
  const hashString = hash ? `#${encodeURIComponent(hash)}` : "";

  return pathname + searchString + hashString;
}

/**
 * Type-safe href builder that returns a function for a specific route
 */
export function createHrefBuilder<TParams = any, TSearch = any>(
  descriptor: RouteDescriptor<any, any>
) {
  return (props: { params?: TParams; search?: TSearch; hash?: string } = {}) =>
    buildHref(descriptor, props);
}

/**
 * Validate that a pathname matches a route template
 */
export function validatePathname(
  descriptor: RouteDescriptor,
  pathname: string
): boolean {
  // Simple validation - in a real implementation, you might want more sophisticated matching
  const templateSegments = descriptor.segments;
  const pathSegments = pathname.split("/").filter(Boolean);

  let templateIndex = 0;
  let pathIndex = 0;

  while (
    templateIndex < templateSegments.length &&
    pathIndex < pathSegments.length
  ) {
    const templateSegment = templateSegments[templateIndex];
    const pathSegment = pathSegments[pathIndex];

    switch (templateSegment.type) {
      case "static":
        if (templateSegment.value !== pathSegment) {
          return false;
        }
        templateIndex++;
        pathIndex++;
        break;
      case "dynamic":
        // Dynamic segment matches any single segment
        templateIndex++;
        pathIndex++;
        break;
      case "catch-all":
        // Catch-all consumes all remaining segments
        return true;
      case "optional-catch-all":
        // Optional catch-all can consume remaining segments or be skipped
        templateIndex++;
        pathIndex++;
        break;
    }
  }

  // Check if we've consumed all segments
  return (
    templateIndex === templateSegments.length &&
    pathIndex === pathSegments.length
  );
}
