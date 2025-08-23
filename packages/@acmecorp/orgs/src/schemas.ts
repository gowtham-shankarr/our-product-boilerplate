import { z } from "zod";

// Base schemas
export const IdSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const NameSchema = z.string().min(1).max(255);
export const SlugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/);
export const SubdomainSchema = z
  .string()
  .min(1)
  .max(63)
  .regex(/^[a-z0-9-]+$/);

// Enum schemas
export const OrganizationStatusSchema = z.enum([
  "active",
  "suspended",
  "archived",
  "trial",
  "pending",
]);

export const OrganizationPlanSchema = z.enum([
  "free",
  "pro",
  "enterprise",
  "custom",
]);

export const OrganizationRoleSchema = z.enum([
  "owner",
  "admin",
  "manager",
  "member",
  "viewer",
]);

export const MemberStatusSchema = z.enum([
  "active",
  "pending",
  "suspended",
  "removed",
]);

export const TeamRoleSchema = z.enum(["lead", "member", "viewer"]);

export const SubscriptionStatusSchema = z.enum([
  "active",
  "canceled",
  "past_due",
  "unpaid",
  "trialing",
]);

export const BillingCycleSchema = z.enum(["monthly", "yearly", "custom"]);

// Organization schemas
export const CreateOrganizationSchema = z.object({
  name: NameSchema,
  slug: SlugSchema,
  subdomain: SubdomainSchema.optional(),
  description: z.string().max(1000).optional(),
  industry: z.string().max(100).optional(),
  timezone: z.string().default("UTC"),
  locale: z.string().default("en-US"),
  currency: z.string().default("USD"),
});

export const UpdateOrganizationSchema = z.object({
  name: NameSchema.optional(),
  description: z.string().max(1000).optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
  industry: z.string().max(100).optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  currency: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const OrganizationSchema = z.object({
  id: IdSchema,
  name: NameSchema,
  slug: SlugSchema,
  subdomain: SubdomainSchema.optional(),
  description: z.string().max(1000).nullable().optional(),
  logo: z.string().url().nullable().optional(),
  website: z.string().url().nullable().optional(),
  industry: z.string().max(100).nullable().optional(),
  size: z.string().max(50).nullable().optional(),
  timezone: z.string(),
  locale: z.string(),
  currency: z.string(),
  dateFormat: z.string(),
  status: OrganizationStatusSchema,
  plan: OrganizationPlanSchema,
  trialEndsAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  metadata: z.record(z.any()).optional(),
});

// Member schemas
export const InviteMemberSchema = z.object({
  email: EmailSchema,
  role: OrganizationRoleSchema,
  teamIds: z.array(IdSchema).optional(),
  message: z.string().max(500).optional(),
});

export const UpdateMemberSchema = z.object({
  role: OrganizationRoleSchema.optional(),
  status: MemberStatusSchema.optional(),
  permissions: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const OrganizationMemberSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  userId: IdSchema,
  email: EmailSchema,
  name: z.string().max(255).nullable().optional(),
  avatar: z.string().url().nullable().optional(),
  role: OrganizationRoleSchema,
  status: MemberStatusSchema,
  invitedBy: IdSchema.optional(),
  invitedAt: z.date().nullable().optional(),
  joinedAt: z.date().nullable().optional(),
  lastActiveAt: z.date().nullable().optional(),
  permissions: z.array(z.string()),
  metadata: z.record(z.any()).optional(),
});

// Team schemas
export const CreateTeamSchema = z.object({
  name: NameSchema,
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

export const UpdateTeamSchema = z.object({
  name: NameSchema.optional(),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

export const TeamSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  name: NameSchema,
  description: z.string().max(500).nullable().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .nullable()
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TeamMemberSchema = z.object({
  id: IdSchema,
  teamId: IdSchema,
  memberId: IdSchema,
  role: TeamRoleSchema,
  joinedAt: z.date(),
});

export const AssignTeamMemberSchema = z.object({
  memberId: IdSchema,
  role: TeamRoleSchema,
});

// Subscription schemas
export const CreateSubscriptionSchema = z.object({
  plan: OrganizationPlanSchema,
  billingCycle: BillingCycleSchema,
  amount: z.number().positive(),
  currency: z.string().default("USD"),
});

export const UpdateSubscriptionSchema = z.object({
  plan: OrganizationPlanSchema.optional(),
  billingCycle: BillingCycleSchema.optional(),
  amount: z.number().positive().optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
});

export const SubscriptionSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  plan: OrganizationPlanSchema,
  status: SubscriptionStatusSchema,
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.date().nullable().optional(),
  trialStart: z.date().nullable().optional(),
  trialEnd: z.date().nullable().optional(),
  billingCycle: BillingCycleSchema,
  amount: z.number().positive(),
  currency: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Usage schemas
export const UsageSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  metric: z.string(),
  value: z.number().nonnegative(),
  limit: z.number().positive().optional(),
  period: z.string(),
  recordedAt: z.date(),
});

// Invoice schemas
export const InvoiceSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  subscriptionId: IdSchema,
  amount: z.number().positive(),
  currency: z.string(),
  status: z.enum(["draft", "open", "paid", "void", "uncollectible"]),
  dueDate: z.date(),
  paidAt: z.date().nullable().optional(),
  invoiceUrl: z.string().url().optional(),
  createdAt: z.date(),
});

// Settings schemas
export const OrganizationSettingsSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  featureFlags: z.record(z.boolean()),
  integrations: z.record(z.any()),
  security: z.object({
    requireMFA: z.boolean(),
    passwordPolicy: z.string(),
    sessionTimeout: z.number().positive(),
  }),
  notifications: z.object({
    email: z.boolean(),
    slack: z.boolean(),
    webhook: z.array(z.string().url()),
  }),
  branding: z.object({
    logo: z.string().url().optional(),
    colors: z.object({
      primary: z.string().regex(/^#[0-9A-F]{6}$/i),
      secondary: z.string().regex(/^#[0-9A-F]{6}$/i),
    }),
    customDomain: z.string().optional(),
  }),
  updatedAt: z.date(),
});

// Analytics schemas
export const OrganizationAnalyticsSchema = z.object({
  organizationId: IdSchema,
  period: z.string(),
  metrics: z.object({
    memberCount: z.number().nonnegative(),
    activeMembers: z.number().nonnegative(),
    teamCount: z.number().nonnegative(),
    apiCalls: z.number().nonnegative(),
    storageUsed: z.number().nonnegative(),
    revenue: z.number().nonnegative(),
  }),
  trends: z.object({
    memberGrowth: z.number(),
    usageGrowth: z.number(),
    revenueGrowth: z.number(),
  }),
  recordedAt: z.date(),
});

// Invitation schemas
export const OrganizationInvitationSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  email: EmailSchema,
  role: OrganizationRoleSchema,
  invitedBy: IdSchema,
  token: z.string(),
  expiresAt: z.date(),
  acceptedAt: z.date().nullable().optional(),
  createdAt: z.date(),
});

// Audit log schemas
export const OrganizationAuditLogSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  userId: IdSchema.optional(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  details: z.record(z.any()),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  createdAt: z.date(),
});

// Filter schemas
export const OrganizationFiltersSchema = z.object({
  status: OrganizationStatusSchema.optional(),
  plan: OrganizationPlanSchema.optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  search: z.string().optional(),
});

export const MemberFiltersSchema = z.object({
  role: OrganizationRoleSchema.optional(),
  status: MemberStatusSchema.optional(),
  teamId: IdSchema.optional(),
  search: z.string().optional(),
});

export const TeamFiltersSchema = z.object({
  search: z.string().optional(),
});

export const SubscriptionFiltersSchema = z.object({
  status: SubscriptionStatusSchema.optional(),
  plan: OrganizationPlanSchema.optional(),
});

// Pagination schemas
export const PaginationParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Response schemas
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().nonnegative(),
    page: z.number().min(1),
    limit: z.number().min(1),
    totalPages: z.number().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  });

// Inferred types
export type CreateOrganizationForm = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganizationForm = z.infer<typeof UpdateOrganizationSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type InviteMemberForm = z.infer<typeof InviteMemberSchema>;
export type UpdateMemberForm = z.infer<typeof UpdateMemberSchema>;
export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>;
export type CreateTeamForm = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamForm = z.infer<typeof UpdateTeamSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type AssignTeamMemberForm = z.infer<typeof AssignTeamMemberSchema>;
export type CreateSubscriptionForm = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionForm = z.infer<typeof UpdateSubscriptionSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type Usage = z.infer<typeof UsageSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type OrganizationSettings = z.infer<typeof OrganizationSettingsSchema>;
export type OrganizationAnalytics = z.infer<typeof OrganizationAnalyticsSchema>;
export type OrganizationInvitation = z.infer<
  typeof OrganizationInvitationSchema
>;
export type OrganizationAuditLog = z.infer<typeof OrganizationAuditLogSchema>;
export type OrganizationFilters = z.infer<typeof OrganizationFiltersSchema>;
export type MemberFilters = z.infer<typeof MemberFiltersSchema>;
export type TeamFilters = z.infer<typeof TeamFiltersSchema>;
export type SubscriptionFilters = z.infer<typeof SubscriptionFiltersSchema>;
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
