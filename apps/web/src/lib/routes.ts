import { createRoute, createRouteRegistry } from "@acmecorp/router";
import { z } from "zod";

// Test createRoute function
const testRoute = createRoute({
  name: "test",
  template: "/test",
  paramsSchema: z.object({}),
});

console.log("testRoute:", testRoute);

const routeConfig = {
  // Static routes
  home: createRoute({
    name: "home",
    template: "/",
    paramsSchema: z.object({}),
  }),

  dashboard: createRoute({
    name: "dashboard",
    template: "/dashboard",
    paramsSchema: z.object({}),
  }),

  // Dynamic routes
  user: {
    profile: createRoute({
      name: "user.profile",
      template: "/profile/[userId]",
      paramsSchema: z.object({ userId: z.string() }),
      searchSchema: z.object({
        tab: z.enum(["overview", "settings"]).optional(),
      }),
    }),
  },

  // Organization routes
  org: {
    dashboard: createRoute({
      name: "org.dashboard",
      template: "/orgs/[orgId]",
      paramsSchema: z.object({ orgId: z.string() }),
    }),

    projects: createRoute({
      name: "org.projects",
      template: "/orgs/[orgId]/projects",
      paramsSchema: z.object({ orgId: z.string() }),
      searchSchema: z.object({
        status: z.enum(["active", "archived"]).optional(),
        page: z.coerce.number().optional(),
      }),
    }),

    project: {
      details: createRoute({
        name: "org.project.details",
        template: "/orgs/[orgId]/projects/[projectId]",
        paramsSchema: z.object({
          orgId: z.string(),
          projectId: z.string(),
        }),
        searchSchema: z.object({
          view: z.enum(["kanban", "list", "calendar"]).optional(),
          filter: z.string().optional(),
        }),
      }),
    },
  },

  // Catch-all routes
  issues: createRoute({
    name: "issues",
    template: "/issues/[...slug]",
    paramsSchema: z.object({ slug: z.array(z.string()) }),
  }),

  // Optional catch-all routes
  search: createRoute({
    name: "search",
    template: "/search/[[...terms]]",
    paramsSchema: z.object({ terms: z.array(z.string()).optional() }),
    searchSchema: z.object({
      type: z.enum(["all", "projects", "issues"]).optional(),
      sort: z.enum(["relevance", "date", "name"]).optional(),
    }),
  }),

  // Demo routes
  demo: {
    routing: createRoute({
      name: "demo.routing",
      template: "/demo/routing",
      paramsSchema: z.object({}),
    }),
  },
};

export const routes = createRouteRegistry(routeConfig);

// Debug logging
console.log("Route config:", routeConfig);
console.log("Routes after registry:", routes);
console.log("routes.home:", routes.home);

// Export route names for type safety
export type RouteName = keyof typeof routes;
