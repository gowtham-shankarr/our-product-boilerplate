import { z } from "zod";
import type {
  Organization,
  OrganizationMember,
  Team,
  TeamMember,
  Subscription,
  Usage,
  Invoice,
  OrganizationSettings,
  OrganizationAnalytics,
  OrganizationInvitation,
  OrganizationAuditLog,
  OrganizationFilters,
  MemberFilters,
  TeamFilters,
  SubscriptionFilters,
  PaginationParams,
  PaginatedResponse,
} from "./types";
import {
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
  OrganizationSchema,
  InviteMemberSchema,
  UpdateMemberSchema,
  OrganizationMemberSchema,
  CreateTeamSchema,
  UpdateTeamSchema,
  TeamSchema,
  TeamMemberSchema,
  AssignTeamMemberSchema,
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SubscriptionSchema,
  UsageSchema,
  InvoiceSchema,
  OrganizationSettingsSchema,
  OrganizationAnalyticsSchema,
  OrganizationInvitationSchema,
  OrganizationAuditLogSchema,
  OrganizationFiltersSchema,
  MemberFiltersSchema,
  TeamFiltersSchema,
  SubscriptionFiltersSchema,
  PaginationParamsSchema,
  PaginatedResponseSchema,
} from "./schemas";

// Organization contracts
export const organizationContracts = {
  // Create organization
  create: {
    body: CreateOrganizationSchema,
    result: OrganizationSchema,
  },

  // Get organization by ID
  getById: {
    params: z.object({ id: z.string().uuid() }),
    result: OrganizationSchema,
  },

  // Get organization by slug
  getBySlug: {
    params: z.object({ slug: z.string() }),
    result: OrganizationSchema,
  },

  // Get organization by subdomain
  getBySubdomain: {
    params: z.object({ subdomain: z.string() }),
    result: OrganizationSchema,
  },

  // Update organization
  update: {
    params: z.object({ id: z.string().uuid() }),
    body: UpdateOrganizationSchema,
    result: OrganizationSchema,
  },

  // Delete organization
  delete: {
    params: z.object({ id: z.string().uuid() }),
    result: z.object({ success: z.boolean() }),
  },

  // List organizations
  list: {
    query: OrganizationFiltersSchema.merge(PaginationParamsSchema),
    result: PaginatedResponseSchema(OrganizationSchema),
  },

  // Get organization settings
  getSettings: {
    params: z.object({ id: z.string().uuid() }),
    result: OrganizationSettingsSchema,
  },

  // Update organization settings
  updateSettings: {
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      featureFlags: z.record(z.boolean()).optional(),
      integrations: z.record(z.any()).optional(),
      security: z
        .object({
          requireMFA: z.boolean().optional(),
          passwordPolicy: z.string().optional(),
          sessionTimeout: z.number().positive().optional(),
        })
        .optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          slack: z.boolean().optional(),
          webhook: z.array(z.string().url()).optional(),
        })
        .optional(),
      branding: z
        .object({
          logo: z.string().url().optional(),
          colors: z
            .object({
              primary: z
                .string()
                .regex(/^#[0-9A-F]{6}$/i)
                .optional(),
              secondary: z
                .string()
                .regex(/^#[0-9A-F]{6}$/i)
                .optional(),
            })
            .optional(),
          customDomain: z.string().optional(),
        })
        .optional(),
    }),
    result: OrganizationSettingsSchema,
  },
};

// Member contracts
export const memberContracts = {
  // Invite member
  invite: {
    params: z.object({ organizationId: z.string().uuid() }),
    body: InviteMemberSchema,
    result: OrganizationInvitationSchema,
  },

  // Get member by ID
  getById: {
    params: z.object({
      organizationId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    result: OrganizationMemberSchema,
  },

  // Update member
  update: {
    params: z.object({
      organizationId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    body: UpdateMemberSchema,
    result: OrganizationMemberSchema,
  },

  // Remove member
  remove: {
    params: z.object({
      organizationId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    result: z.object({ success: z.boolean() }),
  },

  // List members
  list: {
    params: z.object({ organizationId: z.string().uuid() }),
    query: MemberFiltersSchema.merge(PaginationParamsSchema),
    result: PaginatedResponseSchema(OrganizationMemberSchema),
  },

  // Accept invitation
  acceptInvitation: {
    params: z.object({ token: z.string() }),
    result: OrganizationMemberSchema,
  },

  // Decline invitation
  declineInvitation: {
    params: z.object({ token: z.string() }),
    result: z.object({ success: z.boolean() }),
  },

  // Resend invitation
  resendInvitation: {
    params: z.object({
      organizationId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    result: OrganizationInvitationSchema,
  },
};

// Team contracts
export const teamContracts = {
  // Create team
  create: {
    params: z.object({ organizationId: z.string().uuid() }),
    body: CreateTeamSchema,
    result: TeamSchema,
  },

  // Get team by ID
  getById: {
    params: z.object({
      organizationId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    result: TeamSchema,
  },

  // Update team
  update: {
    params: z.object({
      organizationId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    body: UpdateTeamSchema,
    result: TeamSchema,
  },

  // Delete team
  delete: {
    params: z.object({
      organizationId: z.string().uuid(),
      id: z.string().uuid(),
    }),
    result: z.object({ success: z.boolean() }),
  },

  // List teams
  list: {
    params: z.object({ organizationId: z.string().uuid() }),
    query: TeamFiltersSchema.merge(PaginationParamsSchema),
    result: PaginatedResponseSchema(TeamSchema),
  },

  // Assign member to team
  assignMember: {
    params: z.object({
      organizationId: z.string().uuid(),
      teamId: z.string().uuid(),
    }),
    body: AssignTeamMemberSchema,
    result: TeamMemberSchema,
  },

  // Remove member from team
  removeMember: {
    params: z.object({
      organizationId: z.string().uuid(),
      teamId: z.string().uuid(),
      memberId: z.string().uuid(),
    }),
    result: z.object({ success: z.boolean() }),
  },

  // Get team members
  getMembers: {
    params: z.object({
      organizationId: z.string().uuid(),
      teamId: z.string().uuid(),
    }),
    query: PaginationParamsSchema,
    result: PaginatedResponseSchema(OrganizationMemberSchema),
  },
};

// Subscription contracts
export const subscriptionContracts = {
  // Create subscription
  create: {
    params: z.object({ organizationId: z.string().uuid() }),
    body: CreateSubscriptionSchema,
    result: SubscriptionSchema,
  },

  // Get subscription
  get: {
    params: z.object({ organizationId: z.string().uuid() }),
    result: SubscriptionSchema,
  },

  // Update subscription
  update: {
    params: z.object({ organizationId: z.string().uuid() }),
    body: UpdateSubscriptionSchema,
    result: SubscriptionSchema,
  },

  // Cancel subscription
  cancel: {
    params: z.object({ organizationId: z.string().uuid() }),
    body: z.object({ cancelAtPeriodEnd: z.boolean().optional() }),
    result: SubscriptionSchema,
  },

  // Reactivate subscription
  reactivate: {
    params: z.object({ organizationId: z.string().uuid() }),
    result: SubscriptionSchema,
  },

  // List invoices
  listInvoices: {
    params: z.object({ organizationId: z.string().uuid() }),
    query: PaginationParamsSchema,
    result: PaginatedResponseSchema(InvoiceSchema),
  },

  // Get invoice
  getInvoice: {
    params: z.object({
      organizationId: z.string().uuid(),
      invoiceId: z.string().uuid(),
    }),
    result: InvoiceSchema,
  },
};

// Usage contracts
export const usageContracts = {
  // Get usage
  get: {
    params: z.object({ organizationId: z.string().uuid() }),
    query: z.object({
      metric: z.string().optional(),
      period: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
    result: z.array(UsageSchema),
  },

  // Record usage
  record: {
    params: z.object({ organizationId: z.string().uuid() }),
    body: z.object({
      metric: z.string(),
      value: z.number().nonnegative(),
      period: z.string(),
    }),
    result: UsageSchema,
  },

  // Get usage limits
  getLimits: {
    params: z.object({ organizationId: z.string().uuid() }),
    result: z.object({
      limits: z.record(
        z.object({
          current: z.number().nonnegative(),
          limit: z.number().positive(),
          percentage: z.number().min(0).max(100),
        })
      ),
    }),
  },
};

// Analytics contracts
export const analyticsContracts = {
  // Get organization analytics
  get: {
    params: z.object({ organizationId: z.string().uuid() }),
    query: z.object({
      period: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
    result: OrganizationAnalyticsSchema,
  },

  // Get member analytics
  getMemberAnalytics: {
    params: z.object({ organizationId: z.string().uuid() }),
    query: z.object({
      period: z.string().optional(),
      teamId: z.string().uuid().optional(),
    }),
    result: z.object({
      totalMembers: z.number().nonnegative(),
      activeMembers: z.number().nonnegative(),
      newMembers: z.number().nonnegative(),
      memberGrowth: z.number(),
      topTeams: z.array(
        z.object({
          teamId: z.string().uuid(),
          teamName: z.string(),
          memberCount: z.number().nonnegative(),
        })
      ),
    }),
  },

  // Get usage analytics
  getUsageAnalytics: {
    params: z.object({ organizationId: z.string().uuid() }),
    query: z.object({
      period: z.string().optional(),
      metric: z.string().optional(),
    }),
    result: z.object({
      totalUsage: z.number().nonnegative(),
      usageGrowth: z.number(),
      topMetrics: z.array(
        z.object({
          metric: z.string(),
          value: z.number().nonnegative(),
          growth: z.number(),
        })
      ),
    }),
  },
};

// Audit log contracts
export const auditLogContracts = {
  // List audit logs
  list: {
    params: z.object({ organizationId: z.string().uuid() }),
    query: z
      .object({
        action: z.string().optional(),
        resource: z.string().optional(),
        userId: z.string().uuid().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .merge(PaginationParamsSchema),
    result: PaginatedResponseSchema(OrganizationAuditLogSchema),
  },

  // Create audit log entry
  create: {
    params: z.object({ organizationId: z.string().uuid() }),
    body: z.object({
      action: z.string(),
      resource: z.string(),
      resourceId: z.string().optional(),
      details: z.record(z.any()),
      userId: z.string().uuid().optional(),
      ipAddress: z.string().ip().optional(),
      userAgent: z.string().optional(),
    }),
    result: OrganizationAuditLogSchema,
  },
};

// Export all contracts
export const contracts = {
  organizations: organizationContracts,
  members: memberContracts,
  teams: teamContracts,
  subscriptions: subscriptionContracts,
  usage: usageContracts,
  analytics: analyticsContracts,
  auditLogs: auditLogContracts,
};
