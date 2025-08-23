import type { HrefInput, NavigationOptions } from "./types";
import { href } from "./href";

/**
 * Typed navigation hook that wraps Next.js router
 * This is a placeholder - will be properly implemented in Next.js apps
 */
export function useNav() {
  return {
    /**
     * Navigate to a new route
     */
    push: (input: HrefInput, options?: NavigationOptions) => {
      const hrefString = href(input, options);
      console.log("Navigate to:", hrefString, options);
    },

    /**
     * Replace current route
     */
    replace: (input: HrefInput, options?: NavigationOptions) => {
      const hrefString = href(input, options);
      console.log("Replace with:", hrefString, options);
    },

    /**
     * Prefetch a route
     */
    prefetch: (input: HrefInput) => {
      const hrefString = href(input);
      console.log("Prefetch:", hrefString);
    },

    /**
     * Go back
     */
    back: () => {
      console.log("Go back");
    },

    /**
     * Go forward
     */
    forward: () => {
      console.log("Go forward");
    },

    /**
     * Refresh current page
     */
    refresh: () => {
      console.log("Refresh");
    },

    /**
     * Get current pathname
     */
    pathname: "/",
  };
}

/**
 * Check if a route is currently active
 */
export function useIsActive(input: HrefInput): boolean {
  const hrefString = href(input);
  const hrefPathname = hrefString.split("?")[0].split("#")[0];

  // This will be properly implemented in Next.js apps
  return hrefPathname === "/";
}

/**
 * Get the current route name from pathname (if it matches a registry)
 */
export function useCurrentRoute(registry: Record<string, any>): string | null {
  // This will be properly implemented in Next.js apps
  return null;
}

// Re-export for convenience
import { extractRoutes } from "./registry";
import { validatePathname } from "./href";
