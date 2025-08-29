"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Alert,
  AlertDescription,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
}

interface PendingInvitationsProps {
  invitations: PendingInvitation[];
  organizationSlug: string;
  canManage: boolean;
}

export function PendingInvitations({
  invitations,
  organizationSlug,
  canManage,
}: PendingInvitationsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResendInvitation = async (invitationId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/organizations/${organizationSlug}/invitations/${invitationId}/resend`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to resend invitation");
      }

      setSuccess("Invitation resent successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm("Are you sure you want to cancel this invitation?")) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/organizations/${organizationSlug}/invitations/${invitationId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to cancel invitation");
      }

      setSuccess("Invitation cancelled successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "accepted":
        return "default";
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (invitations.length === 0) {
    return null;
  }

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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">
            Pending Invitations ({invitations.length})
          </h4>
        </div>

        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Icon name="mail" className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{invitation.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Invited on {formatDate(invitation.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant={getStatusBadgeVariant(invitation.status)}>
                  {invitation.status}
                </Badge>
                <Badge variant="outline">{invitation.role}</Badge>

                {canManage && invitation.status === "pending" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Icon name="more-horizontal" className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleResendInvitation(invitation.id)}
                        disabled={isLoading}
                      >
                        <Icon name="refresh-cw" className="mr-2 h-4 w-4" />
                        Resend Invitation
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCancelInvitation(invitation.id)}
                        disabled={isLoading}
                        className="text-destructive"
                      >
                        <Icon name="x" className="mr-2 h-4 w-4" />
                        Cancel Invitation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
