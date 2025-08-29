"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Alert,
  AlertDescription,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { InviteMemberDialog } from "@/components/organization/invite-member-dialog";
import { PendingInvitations } from "./pending-invitations";

interface TeamMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
}

interface TeamManagementProps {
  organization: {
    id: string;
    name: string;
    slug: string;
    memberships: TeamMember[];
  };
  userMembership: TeamMember;
  canManage: boolean;
  pendingInvitations?: PendingInvitation[];
}

export function TeamManagement({
  organization,
  userMembership,
  canManage,
  pendingInvitations = [],
}: TeamManagementProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/organizations/${organization.slug}/members/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update member role");
      }

      setSuccess("Member role updated successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/organizations/${organization.slug}/members/${memberId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to remove member");
      }

      setSuccess("Member removed successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Team Members List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">
            Team Members ({organization.memberships.length})
          </h4>
          {canManage && (
            <Button onClick={() => setShowInviteDialog(true)}>
              <Icon name="plus" className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {organization.memberships.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.user.image || undefined} />
                  <AvatarFallback>
                    {member.user.name
                      ? member.user.name.charAt(0).toUpperCase()
                      : member.user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {member.user.name || "Unnamed User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>

                {canManage && member.user.id !== userMembership.user.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Icon name="more-horizontal" className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role !== "owner" && (
                        <>
                          {member.role === "member" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "admin")
                              }
                              disabled={isLoading}
                            >
                              <Icon name="shield" className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                          )}
                          {member.role === "admin" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "member")
                              }
                              disabled={isLoading}
                            >
                              <Icon name="user" className="mr-2 h-4 w-4" />
                              Make Member
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={isLoading}
                            className="text-destructive"
                          >
                            <Icon name="trash2" className="mr-2 h-4 w-4" />
                            Remove Member
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className="mt-6">
          <PendingInvitations
            invitations={pendingInvitations}
            organizationSlug={organization.slug}
            canManage={canManage}
          />
        </div>
      )}

      {/* Invite Member Dialog */}
      {showInviteDialog && (
        <InviteMemberDialog
          organization={organization}
          onClose={() => setShowInviteDialog(false)}
          onSuccess={() => {
            setShowInviteDialog(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
