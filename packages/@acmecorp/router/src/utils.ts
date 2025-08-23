import { z } from "zod";
import type { ParsedSegment } from "./types";

/**
 * Parse a route template into segments
 * Handles: static segments, [param], [...param], [[...param]]
 */
export function parseTemplate(template: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const parts = template.split("/").filter(Boolean);

  for (const part of parts) {
    if (part.startsWith("[[...") && part.endsWith("]]")) {
      // Optional catch-all: [[...param]]
      const paramName = part.slice(5, -2);
      segments.push({ type: "optional-catch-all", paramName, required: false });
    } else if (part.startsWith("[...") && part.endsWith("]")) {
      // Catch-all: [...param]
      const paramName = part.slice(4, -1);
      segments.push({ type: "catch-all", paramName, required: true });
    } else if (part.startsWith("[") && part.endsWith("]")) {
      // Dynamic: [param]
      const paramName = part.slice(1, -1);
      segments.push({ type: "dynamic", paramName, required: true });
    } else {
      // Static segment
      segments.push({ type: "static", value: part });
    }
  }

  return segments;
}

/**
 * Safely join path segments, handling slashes correctly
 */
export function join(...segments: (string | undefined | null)[]): string {
  return segments
    .filter(Boolean)
    .map((segment) => String(segment).replace(/^\/+|\/+$/g, ""))
    .join("/")
    .replace(/^\/+/, "/");
}

/**
 * Resolve a template with parameters into a pathname
 */
export function resolveTemplate(
  template: string,
  params: Record<string, any>
): string {
  const segments = parseTemplate(template);
  const pathSegments: string[] = [];

  for (const segment of segments) {
    switch (segment.type) {
      case "static":
        pathSegments.push(segment.value);
        break;
      case "dynamic":
        const value = params[segment.paramName];
        if (value === undefined || value === null) {
          throw new Error(`Missing required parameter: ${segment.paramName}`);
        }
        pathSegments.push(encodeURIComponent(String(value)));
        break;
      case "catch-all":
        const catchAllValue = params[segment.paramName];
        if (!Array.isArray(catchAllValue) || catchAllValue.length === 0) {
          throw new Error(
            `Missing required catch-all parameter: ${segment.paramName}`
          );
        }
        pathSegments.push(
          ...catchAllValue.map((v) => encodeURIComponent(String(v)))
        );
        break;
      case "optional-catch-all":
        const optionalValue = params[segment.paramName];
        if (Array.isArray(optionalValue) && optionalValue.length > 0) {
          pathSegments.push(
            ...optionalValue.map((v) => encodeURIComponent(String(v)))
          );
        }
        // If undefined/null/empty array, skip this segment
        break;
    }
  }

  return "/" + join(...pathSegments);
}

/**
 * Serialize search parameters to query string
 */
export function serializeSearch(search: Record<string, any>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      // Handle arrays: key=1&key=2
      for (const item of value) {
        if (item !== undefined && item !== null) {
          params.append(key, String(item));
        }
      }
    } else {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Add search parameters to an existing href
 */
export function withSearch(href: string, search: Record<string, any>): string {
  const [pathname, existingSearch] = href.split("?");
  const existingParams = existingSearch
    ? new URLSearchParams(existingSearch)
    : new URLSearchParams();

  // Merge with new search params
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      // Remove existing values for this key
      existingParams.delete(key);
      // Add new values
      for (const item of value) {
        if (item !== undefined && item !== null) {
          existingParams.append(key, String(item));
        }
      }
    } else {
      existingParams.set(key, String(value));
    }
  }

  const queryString = existingParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

/**
 * Set a single query parameter
 */
export function setQueryParam(
  href: string,
  key: string,
  value: string | number | boolean
): string {
  const url = new URL(href, "http://localhost");
  url.searchParams.set(key, String(value));
  return url.pathname + url.search;
}

/**
 * Remove a query parameter
 */
export function removeQueryParam(href: string, key: string): string {
  const url = new URL(href, "http://localhost");
  url.searchParams.delete(key);
  return url.pathname + url.search;
}

/**
 * Toggle a value in an array query parameter
 */
export function toggleInArrayParam(
  href: string,
  key: string,
  value: string
): string {
  const url = new URL(href, "http://localhost");
  const values = url.searchParams.getAll(key);

  if (values.includes(value)) {
    // Remove value
    const newValues = values.filter((v) => v !== value);
    url.searchParams.delete(key);
    newValues.forEach((v) => url.searchParams.append(key, v));
  } else {
    // Add value
    url.searchParams.append(key, value);
  }

  return url.pathname + url.search;
}

/**
 * Read and parse search parameters with Zod validation
 */
export function readSearch<T extends z.ZodSchema>(
  schema: T,
  searchString: string
): z.infer<T> {
  const params = new URLSearchParams(searchString);
  const search: Record<string, any> = {};

  for (const [key, value] of params.entries()) {
    if (search[key] === undefined) {
      search[key] = value;
    } else if (Array.isArray(search[key])) {
      search[key].push(value);
    } else {
      search[key] = [search[key], value];
    }
  }

  return schema.parse(search);
}

/**
 * Check if a pathname matches a route template
 */
export function matchesTemplate(template: string, pathname: string): boolean {
  const templateSegments = parseTemplate(template);
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
