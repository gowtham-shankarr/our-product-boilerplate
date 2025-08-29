"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
  Alert,
  AlertDescription,
  Textarea,
} from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { z } from "zod";

const organizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationGeneralFormProps {
  organization: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
}

export function OrganizationGeneralForm({
  organization,
}: OrganizationGeneralFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: organization.name,
    description: organization.description || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const validatedData = organizationSchema.parse(formData);

      const response = await fetch(`/api/organizations/${organization.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update organization");
      }

      setSuccess("Organization updated successfully!");
      router.refresh();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter organization name"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter organization description"
          disabled={isLoading}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Organization Slug</Label>
        <Input value={organization.slug} disabled className="bg-muted" />
        <p className="text-sm text-muted-foreground">
          The organization slug cannot be changed after creation.
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Icon name="refresh-cw" className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Icon name="check" className="mr-2 h-4 w-4" />
            Update Organization
          </>
        )}
      </Button>
    </form>
  );
}
