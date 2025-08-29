import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
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
import { OrganizationGeneralForm } from "@/components/organization/organization-general-form";
import { TeamManagement } from "@/components/organization/team-management";
import { OrganizationDangerZone } from "@/components/organization/organization-danger-zone";
import { OrganizationSwitcher } from "@/components/organization-switcher";

interface OrganizationSettingsPageProps {
  params: {
    slug: string;
  };
}

export default async function OrganizationSettingsPage({
  params,
}: OrganizationSettingsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch user's organizations for switcher
  const user = await db.user.findUnique({
    where: { id: session.user?.id },
    include: {
      memberships: {
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  // Fetch organization with members and user's membership
  const organization = await db.organization.findUnique({
    where: { slug: params.slug },
    include: {
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!organization) {
    notFound();
  }

  // Check if user is a member of this organization
  const userMembership = organization.memberships.find(
    (m: { user: { id: string } }) => m.user.id === session.user?.id
  );

  if (!userMembership) {
    redirect("/dashboard");
  }

  // Check if user has admin/owner permissions
  const canManage = ["owner", "admin"].includes(userMembership.role);
  const isOwner = userMembership.role === "owner";

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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/org/${params.slug}`}>
                    {organization.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Organization Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your organization settings and team members.
              </p>
            </div>

            {/* Organization Switcher */}
            {user && (
              <OrganizationSwitcher
                currentOrg={{
                  id: organization.id,
                  name: organization.name,
                  slug: organization.slug,
                  role: userMembership?.role || "member",
                }}
                organizations={user.memberships.map(
                  (m: {
                    organization: { id: string; name: string; slug: string };
                    role: string;
                  }) => ({
                    id: m.organization.id,
                    name: m.organization.name,
                    slug: m.organization.slug,
                    role: m.role,
                  })
                )}
              />
            )}
          </div>

          {/* General Settings */}
          {canManage && (
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">General Settings</h3>
              <OrganizationGeneralForm organization={organization} />
            </div>
          )}

          {/* Team Management */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Team Management</h3>
            <TeamManagement
              organization={organization}
              userMembership={userMembership}
              canManage={canManage}
              pendingInvitations={[]} // TODO: Fetch pending invitations from database
            />
          </div>

          {/* Danger Zone */}
          {isOwner && (
            <div className="rounded-xl border border-destructive/20 bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-destructive">
                Danger Zone
              </h3>
              <OrganizationDangerZone organization={organization} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
