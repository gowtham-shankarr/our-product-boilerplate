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
import { ProfileForm } from "@/components/profile/profile-form";
import { PasswordChangeForm } from "@/components/profile/password-change-form";
import { AccountSettingsForm } from "@/components/profile/account-settings-form";
import { DangerZone } from "@/components/profile/danger-zone";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch user data with organizations
  const user = await db.user.findUnique({
    where: { id: session.user?.id },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

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
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* Profile Form */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <ProfileForm
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.avatarUrl,
              }}
            />
          </div>

          {/* Password Change */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <PasswordChangeForm />
          </div>

          {/* Account Settings */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <AccountSettingsForm
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified ? new Date() : null,
              }}
            />
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-destructive/20 bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-destructive">
              Danger Zone
            </h3>
            <DangerZone user={user} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
