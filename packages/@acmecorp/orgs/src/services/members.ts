import type {
  OrganizationMember,
  InviteMemberForm,
  OrganizationInvitation,
  MemberFilters,
  PaginationParams,
  PaginatedResponse,
} from "../types";
import type { UpdateMemberForm } from "../schemas";
import {
  InviteMemberSchema,
  UpdateMemberSchema,
  OrganizationMemberSchema,
  OrganizationInvitationSchema,
} from "../schemas";

/**
 * Organization members service
 */
export class MemberService {
  /**
   * Invite a new member to the organization
   */
  async invite(
    organizationId: string,
    data: InviteMemberForm
  ): Promise<OrganizationInvitation> {
    // Validate input
    const validatedData = InviteMemberSchema.parse(data);

    // This would integrate with your database and email service
    // For now, return a mock invitation
    const invitation: OrganizationInvitation = {
      id: `inv_${Date.now()}`,
      organizationId,
      email: validatedData.email,
      role: validatedData.role,
      invitedBy: "current-user-id", // This would come from auth context
      token: `token_${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    };

    return OrganizationInvitationSchema.parse(invitation);
  }

  /**
   * Get member by ID
   */
  async getById(
    organizationId: string,
    memberId: string
  ): Promise<OrganizationMember | null> {
    // This would query your database
    // For now, return a mock member
    const member: OrganizationMember = {
      id: memberId,
      organizationId,
      userId: `user_${memberId}`,
      email: "member@example.com",
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
      role: "member",
      status: "active",
      invitedBy: "admin-user-id",
      invitedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      lastActiveAt: new Date(),
      permissions: ["projects:read", "tasks:read"],
      metadata: {},
    };

    return OrganizationMemberSchema.parse(member);
  }

  /**
   * Update member
   */
  async update(
    organizationId: string,
    memberId: string,
    data: UpdateMemberForm
  ): Promise<OrganizationMember> {
    // Validate input
    const validatedData = UpdateMemberSchema.parse(data);

    // Get existing member
    const existing = await this.getById(organizationId, memberId);
    if (!existing) {
      throw new Error("Member not found");
    }

    // Update member
    const updated: OrganizationMember = {
      ...existing,
      ...validatedData,
    };

    return OrganizationMemberSchema.parse(updated);
  }

  /**
   * Remove member from organization
   */
  async remove(
    organizationId: string,
    memberId: string
  ): Promise<{ success: boolean }> {
    // This would remove from your database
    // For now, return success
    return { success: true };
  }

  /**
   * List organization members
   */
  async list(
    organizationId: string,
    filters: MemberFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<OrganizationMember>> {
    const { page = 1, limit = 20 } = pagination;

    // This would query your database with filters
    // For now, return mock data
    const mockMembers: OrganizationMember[] = [
      {
        id: "member_1",
        organizationId,
        userId: "user_1",
        email: "john@example.com",
        name: "John Doe",
        avatar: "https://example.com/avatar1.jpg",
        role: "admin",
        status: "active",
        invitedBy: "owner-user-id",
        invitedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
        lastActiveAt: new Date(),
        permissions: ["projects:read", "projects:write", "members:manage"],
        metadata: {},
      },
      {
        id: "member_2",
        organizationId,
        userId: "user_2",
        email: "jane@example.com",
        name: "Jane Smith",
        avatar: "https://example.com/avatar2.jpg",
        role: "manager",
        status: "active",
        invitedBy: "admin-user-id",
        invitedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        lastActiveAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        permissions: ["projects:read", "projects:write"],
        metadata: {},
      },
      {
        id: "member_3",
        organizationId,
        userId: "user_3",
        email: "bob@example.com",
        name: "Bob Johnson",
        avatar: "https://example.com/avatar3.jpg",
        role: "member",
        status: "pending",
        invitedBy: "manager-user-id",
        invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        permissions: ["projects:read"],
        metadata: {},
      },
    ];

    // Apply filters
    let filteredMembers = mockMembers;

    if (filters.role) {
      filteredMembers = filteredMembers.filter(
        (member) => member.role === filters.role
      );
    }

    if (filters.status) {
      filteredMembers = filteredMembers.filter(
        (member) => member.status === filters.status
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredMembers = filteredMembers.filter(
        (member) =>
          member.name?.toLowerCase().includes(search) ||
          member.email.toLowerCase().includes(search)
      );
    }

    const total = filteredMembers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filteredMembers.slice(startIndex, endIndex);

    return {
      items: items.map((member) => OrganizationMemberSchema.parse(member)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Accept invitation
   */
  async acceptInvitation(token: string): Promise<OrganizationMember> {
    // This would validate the token and create the member
    // For now, return a mock member
    const member: OrganizationMember = {
      id: "member_new",
      organizationId: "org_1",
      userId: "user_new",
      email: "newmember@example.com",
      name: "New Member",
      role: "member",
      status: "active",
      invitedBy: "admin-user-id",
      invitedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      permissions: ["projects:read"],
      metadata: {},
    };

    return OrganizationMemberSchema.parse(member);
  }

  /**
   * Decline invitation
   */
  async declineInvitation(token: string): Promise<{ success: boolean }> {
    // This would mark the invitation as declined
    return { success: true };
  }

  /**
   * Resend invitation
   */
  async resendInvitation(
    organizationId: string,
    invitationId: string
  ): Promise<OrganizationInvitation> {
    // This would resend the invitation email
    const invitation: OrganizationInvitation = {
      id: invitationId,
      organizationId,
      email: "member@example.com",
      role: "member",
      invitedBy: "admin-user-id",
      token: `token_${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    return OrganizationInvitationSchema.parse(invitation);
  }

  /**
   * Get member statistics
   */
  async getStats(organizationId: string): Promise<{
    totalMembers: number;
    activeMembers: number;
    pendingMembers: number;
    suspendedMembers: number;
    roleDistribution: Record<string, number>;
  }> {
    // This would query your database for statistics
    return {
      totalMembers: 25,
      activeMembers: 22,
      pendingMembers: 2,
      suspendedMembers: 1,
      roleDistribution: {
        owner: 1,
        admin: 3,
        manager: 5,
        member: 15,
        viewer: 1,
      },
    };
  }

  /**
   * Check if user is member of organization
   */
  async isMember(organizationId: string, userId: string): Promise<boolean> {
    // This would check your database
    // For now, return true
    return true;
  }

  /**
   * Get member role in organization
   */
  async getMemberRole(
    organizationId: string,
    userId: string
  ): Promise<string | null> {
    // This would query your database
    // For now, return a mock role
    return "member";
  }
}

// Export singleton instance
export const memberService = new MemberService();
