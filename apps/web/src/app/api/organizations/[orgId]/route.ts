import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orgId } = params;

    // Check if user has permission to delete this organization
    const membership = await db.membership.findFirst({
      where: {
        userId: session.user.id,
        orgId: orgId,
        role: {
          in: ["owner", "admin"],
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        {
          error:
            "Access denied. Only owners and admins can delete organizations.",
        },
        { status: 403 }
      );
    }

    // Delete the organization and all related data
    await db.$transaction([
      // Delete all memberships for this organization
      db.membership.deleteMany({
        where: { orgId },
      }),
      // Delete the organization
      db.organization.delete({
        where: { id: orgId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("Organization delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
