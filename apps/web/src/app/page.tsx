import { Button } from "@acmecorp/ui";
import { RLink } from "@/components/RLink";
import { routes } from "@/lib/routes";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            SaaS Toolkit
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A comprehensive monorepo for building modern SaaS applications with
            Next.js, PostgreSQL, and shadcn/ui.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <RLink to={routes.dashboard}>
              <Button size="lg">Get Started</Button>
            </RLink>
            <RLink to={routes.demo.routing}>
              <Button variant="outline" size="lg">
                Router Demo
              </Button>
            </RLink>
            <RLink to="/demo/api">
              <Button variant="outline" size="lg">
                API Demo
              </Button>
            </RLink>
            <RLink to="/demo/auth">
              <Button variant="outline" size="lg">
                Auth Demo
              </Button>
            </RLink>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Next.js</h3>
            <p className="text-sm text-muted-foreground">
              App Router, Server Components, and Server Actions
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">PostgreSQL</h3>
            <p className="text-sm text-muted-foreground">
              Prisma ORM with type-safe database operations
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">shadcn/ui</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful, accessible UI components
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
