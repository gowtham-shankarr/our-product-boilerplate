import type {
  Team,
  TeamMember,
  OrganizationMember,
  CreateTeamForm,
  UpdateTeamForm,
  AssignTeamMemberForm,
  TeamFilters,
  PaginationParams,
  PaginatedResponse,
} from "../types";
import {
  CreateTeamSchema,
  UpdateTeamSchema,
  TeamSchema,
  TeamMemberSchema,
  AssignTeamMemberSchema,
} from "../schemas";

/**
 * Teams service for organization team management
 */
export class TeamService {
  /**
   * Create a new team
   */
  async create(organizationId: string, data: CreateTeamForm): Promise<Team> {
    // Validate input
    const validatedData = CreateTeamSchema.parse(data);

    // This would integrate with your database
    // For now, return a mock team
    const team: Team = {
      id: `team_${Date.now()}`,
      organizationId,
      name: validatedData.name,
      description: validatedData.description,
      color: validatedData.color || "#3B82F6",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return TeamSchema.parse(team);
  }

  /**
   * Get team by ID
   */
  async getById(organizationId: string, teamId: string): Promise<Team | null> {
    // This would query your database
    // For now, return a mock team
    const team: Team = {
      id: teamId,
      organizationId,
      name: "Engineering Team",
      description: "Core engineering team responsible for product development",
      color: "#3B82F6",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    return TeamSchema.parse(team);
  }

  /**
   * Update team
   */
  async update(
    organizationId: string,
    teamId: string,
    data: UpdateTeamForm
  ): Promise<Team> {
    // Validate input
    const validatedData = UpdateTeamSchema.parse(data);

    // Get existing team
    const existing = await this.getById(organizationId, teamId);
    if (!existing) {
      throw new Error("Team not found");
    }

    // Update team
    const updated: Team = {
      ...existing,
      ...validatedData,
      updatedAt: new Date(),
    };

    return TeamSchema.parse(updated);
  }

  /**
   * Delete team
   */
  async delete(
    organizationId: string,
    teamId: string
  ): Promise<{ success: boolean }> {
    // This would delete from your database
    // For now, return success
    return { success: true };
  }

  /**
   * List teams in organization
   */
  async list(
    organizationId: string,
    filters: TeamFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<Team>> {
    const { page = 1, limit = 20 } = pagination;

    // This would query your database with filters
    // For now, return mock data
    const mockTeams: Team[] = [
      {
        id: "team_1",
        organizationId,
        name: "Engineering",
        description: "Core engineering team",
        color: "#3B82F6",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "team_2",
        organizationId,
        name: "Design",
        description: "Product design team",
        color: "#10B981",
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "team_3",
        organizationId,
        name: "Marketing",
        description: "Marketing and growth team",
        color: "#F59E0B",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "team_4",
        organizationId,
        name: "Sales",
        description: "Sales and customer success team",
        color: "#EF4444",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ];

    // Apply filters
    let filteredTeams = mockTeams;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredTeams = filteredTeams.filter(
        (team) =>
          team.name.toLowerCase().includes(search) ||
          team.description?.toLowerCase().includes(search)
      );
    }

    const total = filteredTeams.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filteredTeams.slice(startIndex, endIndex);

    return {
      items: items.map((team) => TeamSchema.parse(team)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Assign member to team
   */
  async assignMember(
    organizationId: string,
    teamId: string,
    data: AssignTeamMemberForm
  ): Promise<TeamMember> {
    // Validate input
    const validatedData = AssignTeamMemberSchema.parse(data);

    // This would integrate with your database
    // For now, return a mock team member
    const teamMember: TeamMember = {
      id: `tm_${Date.now()}`,
      teamId,
      memberId: validatedData.memberId,
      role: validatedData.role,
      joinedAt: new Date(),
    };

    return TeamMemberSchema.parse(teamMember);
  }

  /**
   * Remove member from team
   */
  async removeMember(
    organizationId: string,
    teamId: string,
    memberId: string
  ): Promise<{ success: boolean }> {
    // This would remove from your database
    // For now, return success
    return { success: true };
  }

  /**
   * Get team members
   */
  async getMembers(
    organizationId: string,
    teamId: string,
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<OrganizationMember>> {
    const { page = 1, limit = 20 } = pagination;

    // This would query your database
    // For now, return mock data
    const mockMembers: OrganizationMember[] = [
      {
        id: "member_1",
        organizationId,
        userId: "user_1",
        email: "john@example.com",
        name: "John Doe",
        avatar: "https://example.com/avatar1.jpg",
        role: "manager",
        status: "active",
        invitedBy: "admin-user-id",
        invitedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
        lastActiveAt: new Date(),
        permissions: ["projects:read", "projects:write"],
        metadata: {},
      },
      {
        id: "member_2",
        organizationId,
        userId: "user_2",
        email: "jane@example.com",
        name: "Jane Smith",
        avatar: "https://example.com/avatar2.jpg",
        role: "member",
        status: "active",
        invitedBy: "admin-user-id",
        invitedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        lastActiveAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        permissions: ["projects:read"],
        metadata: {},
      },
    ];

    const total = mockMembers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = mockMembers.slice(startIndex, endIndex);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Get team statistics
   */
  async getStats(organizationId: string): Promise<{
    totalTeams: number;
    totalMembers: number;
    averageTeamSize: number;
    teamDistribution: Record<string, number>;
  }> {
    // This would query your database for statistics
    return {
      totalTeams: 4,
      totalMembers: 25,
      averageTeamSize: 6.25,
      teamDistribution: {
        Engineering: 8,
        Design: 5,
        Marketing: 6,
        Sales: 6,
      },
    };
  }

  /**
   * Get teams for member
   */
  async getMemberTeams(
    organizationId: string,
    memberId: string
  ): Promise<Team[]> {
    // This would query your database
    // For now, return mock data
    const mockTeams: Team[] = [
      {
        id: "team_1",
        organizationId,
        name: "Engineering",
        description: "Core engineering team",
        color: "#3B82F6",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "team_2",
        organizationId,
        name: "Design",
        description: "Product design team",
        color: "#10B981",
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ];

    return mockTeams.map((team) => TeamSchema.parse(team));
  }

  /**
   * Check if member is in team
   */
  async isMemberInTeam(
    organizationId: string,
    teamId: string,
    memberId: string
  ): Promise<boolean> {
    // This would check your database
    // For now, return true
    return true;
  }

  /**
   * Get member role in team
   */
  async getMemberTeamRole(
    organizationId: string,
    teamId: string,
    memberId: string
  ): Promise<string | null> {
    // This would query your database
    // For now, return a mock role
    return "member";
  }
}

// Export singleton instance
export const teamService = new TeamService();
