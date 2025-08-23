"use client";

import { Button } from "@acmecorp/ui";
import { RLink } from "@/components/RLink";
import { routes } from "@/lib/routes";
import { href } from "@acmecorp/router";
import { useNav } from "@acmecorp/router";

export default function RoutingDemoPage() {
  const nav = useNav();

  const handleNavigation = () => {
    // Example of programmatic navigation
    nav.push(routes.org.project.details, {
      params: { orgId: "acme", projectId: "router-demo" },
      search: { view: "kanban" },
      hash: "comments",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Router Package Demo</h1>

        <div className="space-y-8">
          {/* Static Routes */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Static Routes</h2>
            <div className="flex gap-4">
              <RLink to={routes.home} className="text-blue-600 hover:underline">
                Home
              </RLink>
              <RLink
                to={routes.dashboard}
                className="text-blue-600 hover:underline"
              >
                Dashboard
              </RLink>
            </div>
          </section>

          {/* Dynamic Routes */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Dynamic Routes</h2>
            <div className="space-y-2">
              <RLink
                to={routes.user.profile}
                params={{ userId: "john-doe" }}
                search={{ tab: "settings" }}
                className="text-blue-600 hover:underline block"
              >
                User Profile (john-doe, settings tab)
              </RLink>
              <RLink
                to={routes.org.dashboard}
                params={{ orgId: "acme-corp" }}
                className="text-blue-600 hover:underline block"
              >
                Organization Dashboard (acme-corp)
              </RLink>
              <RLink
                to={routes.org.project.details}
                params={{ orgId: "acme", projectId: "router-demo" }}
                search={{ view: "kanban", filter: "active" }}
                hash="comments"
                className="text-blue-600 hover:underline block"
              >
                Project Details (with search & hash)
              </RLink>
            </div>
          </section>

          {/* Catch-all Routes */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Catch-all Routes</h2>
            <div className="space-y-2">
              <RLink
                to={routes.issues}
                params={{ slug: ["ui", "bug", "123"] }}
                className="text-blue-600 hover:underline block"
              >
                Issues: /ui/bug/123
              </RLink>
              <RLink
                to={routes.issues}
                params={{ slug: ["feature", "dashboard"] }}
                className="text-blue-600 hover:underline block"
              >
                Issues: /feature/dashboard
              </RLink>
            </div>
          </section>

          {/* Optional Catch-all Routes */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Optional Catch-all Routes
            </h2>
            <div className="space-y-2">
              <RLink
                to={routes.search}
                params={{ terms: ["react", "typescript"] }}
                search={{ type: "projects", sort: "relevance" }}
                className="text-blue-600 hover:underline block"
              >
                Search: /react/typescript (with terms)
              </RLink>
              <RLink
                to={routes.search}
                search={{ type: "all" }}
                className="text-blue-600 hover:underline block"
              >
                Search: / (without terms)
              </RLink>
            </div>
          </section>

          {/* Programmatic Navigation */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Programmatic Navigation</h2>
            <div className="space-y-2">
              <Button onClick={handleNavigation}>
                Navigate to Project Details (Programmatic)
              </Button>
              <Button variant="outline" onClick={() => nav.push(routes.home)}>
                Go Home (Programmatic)
              </Button>
            </div>
          </section>

          {/* Href Generation */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Href Generation Examples</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>User Profile:</strong>{" "}
                {href(routes.user.profile, { params: { userId: "test" } })}
              </div>
              <div>
                <strong>Project Details:</strong>{" "}
                {href(routes.org.project.details, {
                  params: { orgId: "org1", projectId: "proj1" },
                  search: { view: "list" },
                })}
              </div>
              <div>
                <strong>Search with Terms:</strong>{" "}
                {href(routes.search, {
                  params: { terms: ["query"] },
                  search: { type: "projects" },
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
