import { z } from "zod";

/**
 * Represents a parsed segment from a route template
 */
export type ParsedSegment =
  | { type: "static"; value: string }
  | { type: "dynamic"; paramName: string; required: true }
  | { type: "catch-all"; paramName: string; required: true }
  | { type: "optional-catch-all"; paramName: string; required: false };

/**
 * Core route descriptor with template, validation schemas, and metadata
 */
export interface RouteDescriptor<
  TParams extends z.ZodSchema = z.ZodSchema,
  TSearch extends z.ZodSchema = z.ZodSchema,
> {
  /** Unique name for the route (e.g., "project.details") */
  name: string;
  /** Route template (e.g., "/orgs/[orgId]/projects/[projectId]") */
  template: string;
  /** Parsed segments for internal use */
  segments: ParsedSegment[];
  /** Zod schema for validating route parameters */
  paramsSchema: TParams;
  /** Zod schema for validating search/query parameters */
  searchSchema?: TSearch;
}

/**
 * Input for href generation - can be a descriptor with props or a string
 */
export type HrefInput<TParams = any, TSearch = any> =
  | string
  | RouteDescriptor<any, any>
  | [
      RouteDescriptor<any, any>,
      { params?: TParams; search?: TSearch; hash?: string },
    ]
  | BuilderResult<TParams, TSearch>;

/**
 * Result from a builder function
 */
export interface BuilderResult<TParams = any, TSearch = any> {
  descriptor: RouteDescriptor<any, any>;
  params?: TParams;
  search?: TSearch;
  hash?: string;
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
 * Props for the RLink component
 */
export interface RLinkProps<TParams = any, TSearch = any> {
  to: HrefInput<TParams, TSearch>;
  params?: TParams;
  search?: TSearch;
  hash?: string;
  prefetch?: boolean;
  className?: string;
  activeClassName?: string;
  scroll?: boolean;
  children: any;
}

/**
 * Union type of all route names (auto-generated from registry)
 */
export type RouteName = string;

/**
 * Nominal type for href strings
 */
export type Href = string & { readonly __brand: "Href" };

/**
 * Helper type to infer parameter types from a Zod schema
 */
export type InferParams<T extends z.ZodSchema> = z.infer<T>;

/**
 * Helper type to infer search types from a Zod schema
 */
export type InferSearch<T extends z.ZodSchema | undefined> =
  T extends z.ZodSchema ? z.infer<T> : never;

/**
 * Builder function type for route shortcuts
 */
export type RouteBuilder<TParams = any, TSearch = any> = (input: {
  params?: TParams;
  search?: TSearch;
  hash?: string;
}) => BuilderResult<TParams, TSearch>;

/**
 * Route registry type - nested object with route descriptors and builders
 */
export type RouteRegistry = Record<
  string,
  RouteDescriptor | RouteBuilder | Record<string, any>
>;
