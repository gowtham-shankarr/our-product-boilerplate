import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with memberships to check if they're the only owner of any organizations
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          include: {
            organization: {
              include: {
                memberships: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is the only owner of any organizations
    for (const membership of user.memberships) {
      if (membership.role === "owner") {
        const ownerCount = membership.organization.memberships.filter(
          (m: { role: string }) => m.role === "owner"
        ).length;

        if (ownerCount === 1) {
          return NextResponse.json(
            {
              error: `Cannot delete account. You are the only owner of "${membership.organization.name}". Please transfer ownership or delete the organization first.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Delete user account and all associated data
    // This will cascade delete sessions, accounts, memberships, etc.
    await db.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
