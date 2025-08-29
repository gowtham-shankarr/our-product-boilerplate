import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { z } from "zod";

const updateOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateOrganizationSchema.parse(body);

    // Check if user is a member of this organization with admin/owner role
    const membership = await db.membership.findFirst({
      where: {
        organization: { slug: params.slug },
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You don't have permission to update this organization" },
        { status: 403 }
      );
    }

    // Update organization
    const updatedOrganization = await db.organization.update({
      where: { slug: params.slug },
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: updatedOrganization.id,
        name: updatedOrganization.name,
        slug: updatedOrganization.slug,
        description: updatedOrganization.description,
      },
    });
  } catch (error) {
    console.error("Organization update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is the owner of this organization
    const membership = await db.membership.findFirst({
      where: {
        organization: { slug: params.slug },
        userId: session.user.id,
        role: "owner",
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Only the organization owner can delete the organization" },
        { status: 403 }
      );
    }

    // Delete organization (this will cascade delete all memberships)
    await db.organization.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("Organization deletion error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
