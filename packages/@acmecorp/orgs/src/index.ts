// Export schemas (includes types)
export * from "./schemas";

// Export contracts
export * from "./contracts";

// Export services
export * from "./services";

// Export hooks
export * from "./hooks";

// Legacy exports for backward compatibility
export const orgService = {
  // Placeholder for organization service methods
  create: async (data: any) => ({ id: "org-1", ...data }),
  findById: async (id: string) => ({ id, name: "Test Org", slug: "test-org" }),
  update: async (id: string, data: any) => ({ id, ...data }),
  delete: async (id: string) => ({ success: true }),
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
