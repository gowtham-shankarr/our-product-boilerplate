"use client";

import { useState } from "react";
import { Button, Input, Label } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface OnboardingInviteProps {
  onComplete: (data?: any) => void;
  onSkip: () => void;
  loading: boolean;
  progress?: any;
}

export function OnboardingInvite({
  onComplete,
  onSkip,
  loading,
}: OnboardingInviteProps) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [message, setMessage] = useState("");

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmails = emails.filter(
      (email) => email.trim() && email.includes("@")
    );
    onComplete({ emails: validEmails, message });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Icon name="mail" className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Invite Your Team
        </h3>
        <p className="text-gray-600">
          Get your team onboard and start collaborating together.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <Label>Team Member Emails</Label>
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="colleague@company.com"
                className="flex-1"
              />
              {emails.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveEmail(index)}
                  className="px-3"
                >
                  <Icon name="trash2" className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddEmail}
            className="w-full"
          >
            <Icon name="plus" className="w-4 h-4 mr-2" />
            Add Another Email
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Personal Message (Optional)</Label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message to your invitation..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="info" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">What happens next?</h4>
              <p className="text-sm text-blue-700">
                Your team members will receive an email invitation. They can
                join your organization and start collaborating immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={loading}
            className="flex-1"
          >
            Skip for now
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Icon name="refresh-cw" className="w-4 h-4 mr-2 animate-spin" />
                Sending invites...
              </>
            ) : (
              <>
                Send Invitations
                <Icon name="arrow-right" className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
