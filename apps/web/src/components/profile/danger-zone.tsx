"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button, Alert, AlertDescription, Input, Label } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface DangerZoneProps {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export function DangerZone({ user }: DangerZoneProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user.email) {
      setError("Please type your email address to confirm deletion");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/delete-account", {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete account");
      }

      // Sign out and redirect to home
      await signOut({ callbackUrl: "/" });
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
          <h4 className="font-medium text-destructive">Delete Account</h4>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
        </div>

        {!showDeleteConfirmation ? (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Icon name="trash2" className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        ) : (
          <div className="space-y-4 rounded-lg border border-destructive/20 p-4">
            <div className="space-y-2">
              <Label htmlFor="deleteConfirmation">
                Type your email address to confirm:{" "}
                <span className="font-medium">{user.email}</span>
              </Label>
              <Input
                id="deleteConfirmation"
                type="email"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isLoading || deleteConfirmation !== user.email}
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
                    Yes, Delete My Account
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
