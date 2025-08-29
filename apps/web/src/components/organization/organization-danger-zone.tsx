"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Alert, AlertDescription, Input, Label } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface OrganizationDangerZoneProps {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export function OrganizationDangerZone({
  organization,
}: OrganizationDangerZoneProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDeleteOrganization = async () => {
    if (deleteConfirmation !== organization.name) {
      setError("Please type the organization name to confirm deletion");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/organizations/${organization.slug}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete organization");
      }

      // Redirect to dashboard after deletion
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-destructive">Delete Organization</h4>
          <p className="text-sm text-muted-foreground">
            Permanently delete this organization and all associated data. This
            action cannot be undone.
          </p>
        </div>

        {!showDeleteConfirmation ? (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Icon name="trash2" className="mr-2 h-4 w-4" />
            Delete Organization
          </Button>
        ) : (
          <div className="space-y-4 rounded-lg border border-destructive/20 p-4">
            <div className="space-y-2">
              <Label htmlFor="deleteConfirmation">
                Type the organization name to confirm:{" "}
                <span className="font-medium">{organization.name}</span>
              </Label>
              <Input
                id="deleteConfirmation"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Enter organization name"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteOrganization}
                disabled={isLoading || deleteConfirmation !== organization.name}
              >
                {isLoading ? (
                  <>
                    <Icon
                      name="refresh-cw"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Icon name="trash2" className="mr-2 h-4 w-4" />
                    Yes, Delete Organization
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setDeleteConfirmation("");
                  setError(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
