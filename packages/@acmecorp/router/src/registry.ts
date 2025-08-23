import { z } from "zod";
import type { RouteDescriptor, RouteBuilder, BuilderResult } from "./types";
import { parseTemplate } from "./utils";

/**
 * Create a route descriptor with automatic template parsing
 */
export function createRoute<
  TParams extends z.ZodSchema = z.ZodSchema,
  TSearch extends z.ZodSchema = z.ZodSchema,
>(config: {
  name: string;
  template: string;
  paramsSchema: TParams;
  searchSchema?: TSearch;
}): RouteDescriptor<TParams, TSearch> {
  return {
    name: config.name,
    template: config.template,
    segments: parseTemplate(config.template),
    paramsSchema: config.paramsSchema,
    searchSchema: config.searchSchema,
  };
}

/**
 * Create a builder function for a route descriptor
 */
export function createBuilder<TParams = any, TSearch = any>(
  descriptor: RouteDescriptor<any, any>
): RouteBuilder<TParams, TSearch> {
  return (input: { params?: TParams; search?: TSearch; hash?: string }) => ({
    descriptor,
    params: input.params,
    search: input.search,
    hash: input.hash,
  });
}

/**
 * Create a route registry with nested structure and auto-generated builders
 */
export function createRouteRegistry<T extends Record<string, any>>(
  routes: T
): T & {
  [K in keyof T]: T[K] extends RouteDescriptor
    ? T[K] & { __builder: RouteBuilder<any, any> }
    : T[K] extends Record<string, any>
      ? T[K]
      : T[K];
} {
  const registry = { ...routes };

  // Add builders to route descriptors
  for (const [key, value] of Object.entries(registry)) {
    if (value && typeof value === "object" && "template" in value) {
      // This is a RouteDescriptor
      const descriptor = value as RouteDescriptor;
      const builder = createBuilder(descriptor);
      (registry as any)[key] = {
        ...descriptor,
        __builder: builder,
      };
    } else if (value && typeof value === "object") {
      // This is a nested object, recurse
      (registry as any)[key] = createRouteRegistry(value as any);
    }
  }

  return registry as any;
}

/**
 * Extract all route descriptors from a registry (flattened)
 */
export function extractRoutes(
  registry: Record<string, any>
): RouteDescriptor[] {
  const routes: RouteDescriptor[] = [];

  for (const [key, value] of Object.entries(registry)) {
    if (value && typeof value === "object" && "template" in value) {
      // This is a RouteDescriptor
      routes.push(value as RouteDescriptor);
    } else if (value && typeof value === "object") {
      // This is a nested object, recurse
      routes.push(...extractRoutes(value));
    }
  }

  return routes;
}

/**
 * Find a route by name in a registry
 */
export function findRouteByName(
  registry: Record<string, any>,
  name: string
): RouteDescriptor | null {
  for (const [key, value] of Object.entries(registry)) {
    if (
      value &&
      typeof value === "object" &&
      "template" in value &&
      value.name === name
    ) {
      return value as RouteDescriptor;
    } else if (value && typeof value === "object") {
      const found = findRouteByName(value, name);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Get all route names from a registry
 */
export function getRouteNames(registry: Record<string, any>): string[] {
  const names: string[] = [];

  for (const [key, value] of Object.entries(registry)) {
    if (value && typeof value === "object" && "template" in value) {
      names.push(value.name);
    } else if (value && typeof value === "object") {
      names.push(...getRouteNames(value));
    }
  }

  return names;
}
