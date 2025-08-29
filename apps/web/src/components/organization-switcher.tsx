"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Badge,
} from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface OrganizationSwitcherProps {
  currentOrg?: Organization;
  organizations: Organization[];
}

export function OrganizationSwitcher({
  currentOrg,
  organizations,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleOrgSwitch = async (orgSlug: string) => {
    setIsLoading(true);

    // Update the URL to reflect the new organization
    const newPath = pathname.replace(/\/org\/[^\/]+/, `/org/${orgSlug}`);
    router.push(newPath as any);

    setIsLoading(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      case "member":
        return "outline";
      default:
        return "outline";
    }
  };

  if (!currentOrg) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          <Icon name="users" className="h-4 w-4" />
          <span className="truncate max-w-[150px]">{currentOrg.name}</span>
          <Badge
            variant={getRoleBadgeVariant(currentOrg.role)}
            className="text-xs"
          >
            {currentOrg.role}
          </Badge>
          <Icon name="chevron-down" className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium">Organizations</div>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleOrgSwitch(org.slug)}
            disabled={isLoading || org.id === currentOrg.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Icon name="users" className="h-4 w-4" />
              <span className="truncate">{org.name}</span>
            </div>
            <Badge variant={getRoleBadgeVariant(org.role)} className="text-xs">
              {org.role}
            </Badge>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2"
        >
          <Icon name="plus" className="h-4 w-4" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
