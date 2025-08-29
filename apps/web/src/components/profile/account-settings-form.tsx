"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, Alert, AlertDescription, Switch } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface AccountSettingsFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
  };
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/profile/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update settings");
      }

      setSuccess("Settings updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/profile/resend-verification", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to resend verification");
      }

      setSuccess("Verification email sent successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Email Verification Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Email Verification</h4>
            <p className="text-sm text-muted-foreground">
              {user.emailVerified
                ? "Your email is verified"
                : "Please verify your email address"}
            </p>
          </div>
          {!user.emailVerified && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={isLoading}
            >
              <Icon name="mail" className="mr-2 h-4 w-4" />
              Resend Verification
            </Button>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4">
        <h4 className="font-medium">Notification Settings</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your account activity
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("emailNotifications", checked)
              }
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              id="marketingEmails"
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                handleSettingChange("marketingEmails", checked)
              }
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="securityAlerts">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about security-related activities
              </p>
            </div>
            <Switch
              id="securityAlerts"
              checked={settings.securityAlerts}
              onCheckedChange={(checked) =>
                handleSettingChange("securityAlerts", checked)
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSaveSettings} disabled={isLoading}>
        {isLoading ? (
          <>
            <Icon name="refresh-cw" className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Icon name="check" className="mr-2 h-4 w-4" />
            Save Settings
          </>
        )}
      </Button>
    </div>
  );
}
