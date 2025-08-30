"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Settings, Trash2, Calendar, Hash, Crown } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acmecorp/ui";
import { fetchWithCSRF } from "@/lib/csrf";

interface OrganizationCardProps {
  membership: any;
  onDelete: (orgId: string) => void;
}

export function OrganizationCard({
  membership,
  onDelete,
}: OrganizationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetchWithCSRF(
        `/api/organizations/${membership.organization.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        onDelete(membership.organization.id);
        setShowDeleteDialog(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete organization");
      }
    } catch (error) {
      console.error("Failed to delete organization:", error);
      alert("Failed to delete organization");
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === "admin" || role === "owner") {
      return <Crown className="h-3 w-3" />;
    }
    return <Users className="h-3 w-3" />;
  };

  const getRoleColor = (role: string) => {
    if (role === "admin" || role === "owner") {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">
                  {membership.organization.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {membership.organization._count?.memberships || 0} members •{" "}
                  {membership.organization.plan || "free"} plan
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`capitalize text-xs font-medium ${getRoleColor(membership.role)}`}
              >
                {getRoleIcon(membership.role)}
                <span className="ml-1">{membership.role}</span>
              </Badge>
              <Badge
                variant={
                  membership.organization.status === "active"
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {membership.organization.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created</span>
            </div>
            <div className="text-right font-medium">
              {new Date(membership.organization.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span>Slug</span>
            </div>
            <div className="text-right font-mono text-sm">
              {membership.organization.slug}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Organization</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "
                    {membership.organization.name}"? This action cannot be
                    undone and will permanently remove the organization and all
                    its data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Organization"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
