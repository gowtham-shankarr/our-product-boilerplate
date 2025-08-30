"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Mail, Clock, X } from "lucide-react";
import { InviteTeamMemberDialog } from "./invite-team-member-dialog";
import { Icon } from "@acmecorp/icons";

interface TeamMember {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
  role: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
  organizationId: string;
  canManageInvitations: boolean;
  currentUserId: string;
}

export function TeamSection({
  teamMembers,
  organizationId,
  canManageInvitations,
  currentUserId,
}: TeamSectionProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<
    PendingInvitation[]
  >([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);

  useEffect(() => {
    if (canManageInvitations) {
      fetchPendingInvitations();
    }
  }, [canManageInvitations, organizationId]);

  const fetchPendingInvitations = async () => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/invitations`
      );
      if (response.ok) {
        const data = await response.json();
        setPendingInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error("Failed to fetch pending invitations:", error);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm("Are you sure you want to cancel this invitation?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/invitations/${invitationId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Refresh the invitations list
        fetchPendingInvitations();
      } else {
        alert("Failed to cancel invitation");
      }
    } catch (error) {
      console.error("Failed to cancel invitation:", error);
      alert("Failed to cancel invitation");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members
        </CardTitle>
        <CardDescription>
          Manage your team members and their roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {member.user.avatarUrl ? (
                    <img
                      src={member.user.avatarUrl}
                      alt={member.user.name || ""}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {member.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {member.role}
                </Badge>
                {member.user.id === currentUserId && (
                  <Badge variant="secondary">You</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pending Invitations */}
        {canManageInvitations && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Invitations ({pendingInvitations.length})
              </h4>
            </div>

            {isLoadingInvitations ? (
              <div className="text-sm text-muted-foreground">
                Loading invitations...
              </div>
            ) : pendingInvitations.length > 0 ? (
              <div className="space-y-3">
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-muted/50"
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
                      <Badge variant="secondary" className="capitalize">
                        {invitation.role}
                      </Badge>
                      {isExpired(invitation.expiresAt) && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelInvitation(invitation.id)}
                        disabled={isExpired(invitation.expiresAt)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No pending invitations
              </div>
            )}
          </div>
        )}

        {/* Invite Button */}
        {canManageInvitations && (
          <Button className="mt-4" onClick={() => setShowInviteDialog(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Invite Team Member
          </Button>
        )}

        {/* Invitation Dialog */}
        {canManageInvitations && (
          <InviteTeamMemberDialog
            open={showInviteDialog}
            onOpenChange={setShowInviteDialog}
            organizationId={organizationId}
            onInvitationSent={fetchPendingInvitations}
          />
        )}
      </CardContent>
    </Card>
  );
}
