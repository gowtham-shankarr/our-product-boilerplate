import type {
  Subscription,
  Invoice,
  SubscriptionFilters,
  PaginationParams,
  PaginatedResponse,
} from "../types";
import {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SubscriptionSchema,
  InvoiceSchema,
} from "../schemas";
import type {
  CreateSubscriptionForm,
  UpdateSubscriptionForm,
} from "../schemas";

/**
 * Subscription service for billing and subscription management
 */
export class SubscriptionService {
  /**
   * Create a new subscription
   */
  async create(
    organizationId: string,
    data: CreateSubscriptionForm
  ): Promise<Subscription> {
    // Validate input
    const validatedData = CreateSubscriptionSchema.parse(data);

    // This would integrate with your payment provider (Stripe, etc.)
    // For now, return a mock subscription
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      organizationId,
      plan: validatedData.plan,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
      billingCycle: validatedData.billingCycle,
      amount: validatedData.amount,
      currency: validatedData.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return SubscriptionSchema.parse(subscription);
  }

  /**
   * Get subscription for organization
   */
  async get(organizationId: string): Promise<Subscription | null> {
    // This would query your database
    // For now, return a mock subscription
    const subscription: Subscription = {
      id: "sub_1",
      organizationId,
      plan: "pro",
      status: "active",
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      billingCycle: "monthly",
      amount: 29.99,
      currency: "USD",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    return SubscriptionSchema.parse(subscription);
  }

  /**
   * Update subscription
   */
  async update(
    organizationId: string,
    data: UpdateSubscriptionForm
  ): Promise<Subscription> {
    // Validate input
    const validatedData = UpdateSubscriptionSchema.parse(data);

    // Get existing subscription
    const existing = await this.get(organizationId);
    if (!existing) {
      throw new Error("Subscription not found");
    }

    // Update subscription
    const updated: Subscription = {
      ...existing,
      ...validatedData,
      updatedAt: new Date(),
    };

    return SubscriptionSchema.parse(updated);
  }

  /**
   * Cancel subscription
   */
  async cancel(
    organizationId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Subscription> {
    // Get existing subscription
    const existing = await this.get(organizationId);
    if (!existing) {
      throw new Error("Subscription not found");
    }

    // Cancel subscription
    const canceled: Subscription = {
      ...existing,
      cancelAtPeriodEnd,
      canceledAt: cancelAtPeriodEnd ? new Date() : undefined,
      updatedAt: new Date(),
    };

    return SubscriptionSchema.parse(canceled);
  }

  /**
   * Reactivate subscription
   */
  async reactivate(organizationId: string): Promise<Subscription> {
    // Get existing subscription
    const existing = await this.get(organizationId);
    if (!existing) {
      throw new Error("Subscription not found");
    }

    // Reactivate subscription
    const reactivated: Subscription = {
      ...existing,
      cancelAtPeriodEnd: false,
      canceledAt: undefined,
      updatedAt: new Date(),
    };

    return SubscriptionSchema.parse(reactivated);
  }

  /**
   * List invoices for organization
   */
  async listInvoices(
    organizationId: string,
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<Invoice>> {
    const { page = 1, limit = 20 } = pagination;

    // This would query your database
    // For now, return mock data
    const mockInvoices: Invoice[] = [
      {
        id: "inv_1",
        organizationId,
        subscriptionId: "sub_1",
        amount: 29.99,
        currency: "USD",
        status: "paid",
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        invoiceUrl: "https://example.com/invoice/1",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv_2",
        organizationId,
        subscriptionId: "sub_1",
        amount: 29.99,
        currency: "USD",
        status: "open",
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        invoiceUrl: "https://example.com/invoice/2",
        createdAt: new Date(),
      },
    ];

    const total = mockInvoices.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = mockInvoices.slice(startIndex, endIndex);

    return {
      items: items.map((invoice) => InvoiceSchema.parse(invoice)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Get invoice by ID
   */
  async getInvoice(
    organizationId: string,
    invoiceId: string
  ): Promise<Invoice | null> {
    // This would query your database
    // For now, return a mock invoice
    const invoice: Invoice = {
      id: invoiceId,
      organizationId,
      subscriptionId: "sub_1",
      amount: 29.99,
      currency: "USD",
      status: "paid",
      dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      invoiceUrl: `https://example.com/invoice/${invoiceId}`,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    };

    return InvoiceSchema.parse(invoice);
  }

  /**
   * Get subscription usage
   */
  async getUsage(organizationId: string): Promise<{
    currentPeriod: {
      start: Date;
      end: Date;
    };
    usage: Record<
      string,
      {
        current: number;
        limit: number;
        percentage: number;
      }
    >;
  }> {
    // This would query your database for usage data
    return {
      currentPeriod: {
        start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      usage: {
        members: {
          current: 25,
          limit: 50,
          percentage: 50,
        },
        projects: {
          current: 12,
          limit: 20,
          percentage: 60,
        },
        storage: {
          current: 5.2, // GB
          limit: 10, // GB
          percentage: 52,
        },
        apiCalls: {
          current: 15000,
          limit: 50000,
          percentage: 30,
        },
      },
    };
  }

  /**
   * Get subscription statistics
   */
  async getStats(organizationId: string): Promise<{
    totalInvoices: number;
    totalPaid: number;
    averageInvoiceAmount: number;
    paymentHistory: Array<{
      date: Date;
      amount: number;
      status: string;
    }>;
  }> {
    // This would query your database for statistics
    return {
      totalInvoices: 12,
      totalPaid: 359.88,
      averageInvoiceAmount: 29.99,
      paymentHistory: [
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          amount: 29.99,
          status: "paid",
        },
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          amount: 29.99,
          status: "paid",
        },
        {
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          amount: 29.99,
          status: "paid",
        },
      ],
    };
  }

  /**
   * Check if subscription is active
   */
  async isActive(organizationId: string): Promise<boolean> {
    const subscription = await this.get(organizationId);
    return subscription?.status === "active";
  }

  /**
   * Check if subscription is in trial
   */
  async isInTrial(organizationId: string): Promise<boolean> {
    const subscription = await this.get(organizationId);
    return subscription?.status === "trialing";
  }

  /**
   * Get subscription plan limits
   */
  async getPlanLimits(organizationId: string): Promise<Record<string, number>> {
    const subscription = await this.get(organizationId);
    const plan = subscription?.plan || "free";

    // Define plan limits
    const planLimits: Record<string, Record<string, number>> = {
      free: {
        members: 5,
        projects: 3,
        storage: 1, // GB
        apiCalls: 1000,
      },
      pro: {
        members: 50,
        projects: 20,
        storage: 10, // GB
        apiCalls: 50000,
      },
      enterprise: {
        members: 1000,
        projects: 100,
        storage: 100, // GB
        apiCalls: 1000000,
      },
      custom: {
        members: 10000,
        projects: 1000,
        storage: 1000, // GB
        apiCalls: 10000000,
      },
    };

    return planLimits[plan] || planLimits.free;
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
