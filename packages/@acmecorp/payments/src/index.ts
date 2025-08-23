// Payment integration stubs
export const paymentService = {
  // Placeholder for payment service methods
  createCustomer: async (data: any) => ({ id: "cus_123", ...data }),
  createSubscription: async (data: any) => ({ id: "sub_123", ...data }),
  createPaymentIntent: async (data: any) => ({ id: "pi_123", ...data }),
} as const;
