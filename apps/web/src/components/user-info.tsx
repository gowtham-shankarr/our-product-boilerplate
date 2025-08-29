"use client";

import { signOut } from "next-auth/react";
import { Button } from "@acmecorp/ui";
import { Badge } from "@acmecorp/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@acmecorp/ui";

interface UserInfoProps {
  user:
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
        permissions?: string[] | null;
      }
    | null
    | undefined;
}

export function UserInfo({ user }: UserInfoProps) {
  if (!user) {
    return <div>No user information available</div>;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={user.image || undefined}
            alt={user.name || "User"}
          />
          <AvatarFallback className="text-lg">
            {user.name ? getInitials(user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-lg font-semibold">{user.name || "No name"}</h4>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.role && (
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
          )}
        </div>
      </div>

      {user.permissions && user.permissions.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Permissions:</h5>
          <div className="flex flex-wrap gap-1">
            {user.permissions.map((permission) => (
              <Badge key={permission} variant="outline" className="text-xs">
                {permission}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          Edit Profile
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
