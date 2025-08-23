import { Button } from "@acmecorp/ui";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Internal admin console for managing the SaaS application
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Users: 1,234</p>
            <p className="text-sm text-muted-foreground">Active Orgs: 56</p>
            <p className="text-sm text-muted-foreground">Revenue: $12,345</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Organizations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage organization settings and memberships
          </p>
          <Button size="sm">View All</Button>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Users</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage user accounts and permissions
          </p>
          <Button size="sm">View All</Button>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Billing & Webhooks</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Monitor billing and webhook events
          </p>
          <Button size="sm">View All</Button>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Jobs & Errors</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Monitor background jobs and errors
          </p>
          <Button size="sm">View All</Button>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Audit Log</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View system audit logs
          </p>
          <Button size="sm">View All</Button>
        </div>
      </div>
    </div>
  );
}
