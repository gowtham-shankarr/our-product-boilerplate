"use client";

import { useState } from "react";
import { Button } from "@acmecorp/ui";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/api/users";
import { createErrorHandlers } from "@acmecorp/api/rq";

export default function ApiDemoPage() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const { getFieldErrors, getErrorMessage } = createErrorHandlers();

  // Query hooks
  const { data: users, isLoading, error } = useUsers({ limit: 10 });

  // Mutation hooks
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser.mutateAsync(formData);
      setFormData({ name: "", email: "" });
    } catch (error: any) {
      console.log("Field errors:", getFieldErrors(error));
    }
  };

  const handleUpdateUser = async (id: string, updates: any) => {
    try {
      await updateUser.mutateAsync({ id, data: updates });
    } catch (error: any) {
      console.log("Update error:", getErrorMessage(error));
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
    } catch (error: any) {
      console.log("Delete error:", getErrorMessage(error));
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {getErrorMessage(error)}</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">API Package Demo</h1>

        <div className="space-y-8">
          {/* Create User Form */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Create User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={createUser.isPending}
                className="w-full"
              >
                {createUser.isPending ? "Creating..." : "Create User"}
              </Button>
            </form>

            {createUser.error && (
              <div className="text-red-600">
                Error: {getErrorMessage(createUser.error)}
              </div>
            )}
          </section>

          {/* Users List */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Users ({users?.items.length || 0})
            </h2>
            <div className="grid gap-4">
              {users?.items.map((user: any) => (
                <div key={user.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Status: {user.status}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateUser(user.id, { status: "inactive" })
                        }
                        disabled={updateUser.isPending}
                      >
                        {updateUser.isPending ? "Updating..." : "Deactivate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteUser.isPending}
                      >
                        {deleteUser.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* API Features Demo */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">API Features</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Type Safety</h3>
                <p className="text-sm text-gray-600">
                  Full TypeScript support with Zod validation. Auto-completion
                  and compile-time error detection.
                </p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Error Handling</h3>
                <p className="text-sm text-gray-600">
                  Consistent error responses with field-level validation.
                  Automatic retry logic for network issues.
                </p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Caching</h3>
                <p className="text-sm text-gray-600">
                  Smart caching with React Query. Background refetching and
                  optimistic updates.
                </p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Performance</h3>
                <p className="text-sm text-gray-600">
                  Request deduplication, ETag support, and exponential backoff
                  retries.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
