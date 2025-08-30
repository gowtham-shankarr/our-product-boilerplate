import { getServerSession } from "next-auth";
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
import { DashboardWrapper } from "@/components/dashboard-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default async function FormsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get current organization from session

  const membership = await db.membership.findFirst({
    where: {
      userId: session.user.id,
      orgId: session.user.orgId,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!membership) {
    redirect("/org");
  }

  const organization = membership.organization;

  return (
    <DashboardWrapper>
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
                    <BreadcrumbPage>Forms</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto px-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
              <p className="text-muted-foreground">
                Create and manage forms for {organization.name}
              </p>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Contact Form
                  </CardTitle>
                  <CardDescription>
                    Customer contact and support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Submissions</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Last Updated</span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={"/forms/contact-form" as any}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Event Registration
                  </CardTitle>
                  <CardDescription>
                    Conference and event registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Registrations</span>
                      <span className="font-medium">567</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Last Updated</span>
                      <span className="text-muted-foreground">1 week ago</span>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={"/forms/event-registration" as any}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Survey
                  </CardTitle>
                  <CardDescription>
                    Employee satisfaction and feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Responses</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Last Updated</span>
                      <span className="text-muted-foreground">3 days ago</span>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={"/forms/team-survey" as any}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Form Analytics</CardTitle>
                <CardDescription>
                  Overview of form performance across {organization.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground">
                      Active Forms
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1,890</div>
                    <div className="text-sm text-muted-foreground">
                      Total Submissions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">94%</div>
                    <div className="text-sm text-muted-foreground">
                      Completion Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.3s</div>
                    <div className="text-sm text-muted-foreground">
                      Avg. Load Time
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardWrapper>
  );
}
