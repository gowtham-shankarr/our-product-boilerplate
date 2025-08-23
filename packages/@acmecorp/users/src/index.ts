// User domain stubs
export const userService = {
  // Placeholder for user service methods
  create: async (data: any) => ({ id: "user-1", ...data }),
  findById: async (id: string) => ({ id, name: "Test User", email: "test@example.com" }),
  update: async (id: string, data: any) => ({ id, ...data }),
  delete: async (id: string) => ({ success: true }),
};

export type User = {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
