// Organization status types
export type OrganizationStatus =
  | "active"
  | "suspended"
  | "archived"
  | "trial"
  | "pending";

// Organization plan types
export type OrganizationPlan = "free" | "pro" | "enterprise" | "custom";

// Member role types
export type OrganizationRole =
  | "owner"
  | "admin"
  | "manager"
  | "member"
  | "viewer";

// Member status types
export type MemberStatus = "active" | "pending" | "suspended" | "removed";

// Team role types
export type TeamRole = "lead" | "member" | "viewer";

// Subscription status types
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "unpaid"
  | "trialing";

// Billing cycle types
export type BillingCycle = "monthly" | "yearly" | "custom";

// Organization interface
export interface Organization {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  timezone: string;
  locale: string;
  currency: string;
  dateFormat: string;
  status: OrganizationStatus;
  plan: OrganizationPlan;
  trialEndsAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

// Organization member interface
export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  role: OrganizationRole;
  status: MemberStatus;
  invitedBy?: string;
  invitedAt?: Date | null;
  joinedAt?: Date | null;
  lastActiveAt?: Date | null;
  permissions: string[];
  metadata?: Record<string, any>;
}

// Team interface
export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Team member interface
export interface TeamMember {
  id: string;
  teamId: string;
  memberId: string;
  role: TeamRole;
  joinedAt: Date;
}

// Subscription interface
export interface Subscription {
  id: string;
  organizationId: string;
  plan: OrganizationPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date | null;
  trialStart?: Date | null;
  trialEnd?: Date | null;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// Usage interface
export interface Usage {
  id: string;
  organizationId: string;
  metric: string;
  value: number;
  limit?: number;
  period: string;
  recordedAt: Date;
}

// Invoice interface
export interface Invoice {
  id: string;
  organizationId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: "draft" | "open" | "paid" | "void" | "uncollectible";
  dueDate: Date;
  paidAt?: Date | null;
  invoiceUrl?: string;
  createdAt: Date;
}

// Organization settings interface
export interface OrganizationSettings {
  id: string;
  organizationId: string;
  featureFlags: Record<string, boolean>;
  integrations: Record<string, any>;
  security: {
    requireMFA: boolean;
    passwordPolicy: string;
    sessionTimeout: number;
  };
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: string[];
  };
  branding: {
    logo?: string;
    colors: {
      primary: string;
      secondary: string;
    };
    customDomain?: string;
  };
  updatedAt: Date;
}

// Organization analytics interface
export interface OrganizationAnalytics {
  organizationId: string;
  period: string;
  metrics: {
    memberCount: number;
    activeMembers: number;
    teamCount: number;
    apiCalls: number;
    storageUsed: number;
    revenue: number;
  };
  trends: {
    memberGrowth: number;
    usageGrowth: number;
    revenueGrowth: number;
  };
  recordedAt: Date;
}

// Organization invitation interface
export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  invitedBy: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date | null;
  createdAt: Date;
}

// Organization audit log interface
export interface OrganizationAuditLog {
  id: string;
  organizationId: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Form types for API operations
export interface CreateOrganizationForm {
  name: string;
  slug: string;
  subdomain?: string;
  description?: string;
  industry?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
}

export interface UpdateOrganizationForm {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface InviteMemberForm {
  email: string;
  role: OrganizationRole;
  teamIds?: string[];
  message?: string;
}

export interface CreateTeamForm {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateTeamForm {
  name?: string;
  description?: string;
  color?: string;
}

export interface AssignTeamMemberForm {
  memberId: string;
  role: TeamRole;
}

// Query and filter types
export interface OrganizationFilters {
  status?: OrganizationStatus;
  plan?: OrganizationPlan;
  industry?: string;
  size?: string;
  search?: string;
}

export interface MemberFilters {
  role?: OrganizationRole;
  status?: MemberStatus;
  teamId?: string;
  search?: string;
}

export interface TeamFilters {
  search?: string;
}

export interface SubscriptionFilters {
  status?: SubscriptionStatus;
  plan?: OrganizationPlan;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
