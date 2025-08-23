// Typed route helper stubs
export const routes = {
  home: "/",
  dashboard: "/dashboard",
  users: "/users",
  organizations: "/organizations",
  settings: "/settings",
} as const;

export type Route = (typeof routes)[keyof typeof routes];
