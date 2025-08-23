// Core types
export type {
  RouteDescriptor,
  HrefInput,
  BuilderResult,
  NavigationOptions,
  RLinkProps,
  RouteName,
  Href,
  InferParams,
  InferSearch,
  RouteBuilder,
  RouteRegistry,
  ParsedSegment,
} from "./types";

// Route registry and creation
export {
  createRoute,
  createRouteRegistry,
  createBuilder,
  extractRoutes,
  findRouteByName,
  getRouteNames,
} from "./registry";

// Href generation
export { href, toHref, createHrefBuilder, validatePathname } from "./href";

// Navigation hooks
export { useNav, useIsActive, useCurrentRoute } from "./navigation";

// Components
export { RLink, RNavButton, getLinkProps } from "./components";

// Parameter utilities
export {
  useRouteParams,
  useSearch,
  readSearchParams,
  extractParams,
  matchAndExtractParams,
} from "./params";

// Utility functions
export {
  parseTemplate,
  join,
  resolveTemplate,
  serializeSearch,
  withSearch,
  setQueryParam,
  removeQueryParam,
  toggleInArrayParam,
  readSearch,
  matchesTemplate,
} from "./utils";
