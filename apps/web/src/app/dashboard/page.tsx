import { Button } from "@acmecorp/ui";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your SaaS application dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-2xl font-bold text-primary">1,234</p>
            <p className="text-sm text-muted-foreground">Active users</p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Organizations</h3>
            <p className="text-2xl font-bold text-primary">56</p>
            <p className="text-sm text-muted-foreground">
              Active organizations
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-2xl font-bold text-primary">$12,345</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>
        </div>

        <div className="mt-8">
          <Button>Create New Organization</Button>
        </div>
      </div>
    </div>
  );
}
