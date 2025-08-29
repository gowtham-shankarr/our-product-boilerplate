import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { UserInfo } from "../../components/user-info";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch user's organization - use email as fallback if ID is not available
  let userWithOrg;

  if (session.user?.id) {
    userWithOrg = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });
  } else if (session.user?.email) {
    userWithOrg = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });
  } else {
    console.error("No user ID or email in session");
    redirect("/auth/signin");
  }

  if (!userWithOrg) {
    console.error("User not found in database");
    redirect("/auth/signin");
  }

  const organization = userWithOrg?.memberships[0]?.organization;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name || session.user?.email}! Here's
              what's happening with your projects today.
            </p>
          </div>

          {/* User Info Card */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Account</h3>
            <UserInfo user={session.user} />
          </div>

          {/* Organization Info Card */}
          {organization && (
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Your Organization</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm text-muted-foreground">
                    {organization.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Slug:</span>
                  <span className="text-sm text-muted-foreground">
                    {organization.slug}
                  </span>
                </div>
                {organization.description && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Description:</span>
                    <span className="text-sm text-muted-foreground">
                      {organization.description}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Your Role:</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {userWithOrg?.memberships[0]?.role || "member"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center space-x-2">
                <Icon
                  name="activity"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">Active Projects</span>
              </div>
              <div className="mt-2 text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center space-x-2">
                <Icon
                  name="users"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">Team Members</span>
              </div>
              <div className="mt-2 text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                +5 from last month
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center space-x-2">
                <Icon
                  name="credit-card"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <div className="mt-2 text-2xl font-bold">$24,500</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center space-x-2">
                <Icon
                  name="trending-up"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">Growth</span>
              </div>
              <div className="mt-2 text-2xl font-bold">+18%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last month
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New project created</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team member joined</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3 rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="mt-4 space-y-2">
                <button className="w-full rounded-lg border bg-background px-3 py-2 text-sm hover:bg-accent">
                  Create New Project
                </button>
                <button className="w-full rounded-lg border bg-background px-3 py-2 text-sm hover:bg-accent">
                  Invite Team Member
                </button>
                <button className="w-full rounded-lg border bg-background px-3 py-2 text-sm hover:bg-accent">
                  View Analytics
                </button>
                <button className="w-full rounded-lg border bg-background px-3 py-2 text-sm hover:bg-accent">
                  Manage Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
