"use client";

import * as React from "react";
import { Icon } from "@acmecorp/icons";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@acmecorp/ui";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: "gallery-vertical-end" as const,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: "audio-waveform" as const,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: "command" as const,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "terminal" as const,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
        },
        {
          title: "Profile",
          url: "/profile",
        },
        {
          title: "Organization Settings",
          url: "/org",
        },
      ],
    },
    {
      title: "Organizations",
      url: "/demo/organizations",
      icon: "bot" as const,
      items: [
        {
          title: "All Orgs",
          url: "/demo/organizations",
        },
        {
          title: "Create New",
          url: "/demo/organizations/create",
        },
        {
          title: "Settings",
          url: "/demo/organizations/settings",
        },
      ],
    },
    {
      title: "API Demo",
      url: "/demo/api",
      icon: "book-open" as const,
      items: [
        {
          title: "Users",
          url: "/demo/api",
        },
        {
          title: "Create User",
          url: "/demo/api/create",
        },
        {
          title: "Settings",
          url: "/demo/api/settings",
        },
      ],
    },
    {
      title: "Auth Demo",
      url: "/demo/auth",
      icon: "settings2" as const,
      items: [
        {
          title: "Sign In",
          url: "/auth/signin",
        },
        {
          title: "Sign Up",
          url: "/auth/signup",
        },
        {
          title: "Forgot Password",
          url: "/auth/forgot-password",
        },
        {
          title: "Reset Password",
          url: "/auth/reset-password",
        },
        {
          title: "Verify Email",
          url: "/auth/verify-email",
        },
        {
          title: "Permissions",
          url: "/demo/auth/permissions",
        },
        {
          title: "Settings",
          url: "/demo/auth/settings",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Router Demo",
      url: "/demo/routing",
      icon: "frame" as const,
    },
    {
      name: "Home",
      url: "/",
      icon: "pie-chart" as const,
    },
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "map" as const,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
