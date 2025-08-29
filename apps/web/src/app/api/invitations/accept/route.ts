import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const email = formData.get("email") as string;
    const orgSlug = formData.get("org") as string;
    const role = formData.get("role") as string;
    const token = formData.get("token") as string;

    if (!email || !orgSlug || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if organization exists
    const organization = await db.organization.findUnique({
      where: { slug: orgSlug },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMembership = await db.membership.findFirst({
      where: {
        organizationId: organization.id,
        userId: session.user.id,
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "Already a member of this organization" },
        { status: 400 }
      );
    }

    // TODO: In a real implementation, you would:
    // 1. Validate the invitation token
    // 2. Check if the invitation is still valid
    // 3. Verify the email matches the invitation
    // 4. Delete the invitation record after acceptance

    // Create membership
    await db.membership.create({
      data: {
        userId: session.user.id,
        organizationId: organization.id,
        role: role as "member" | "admin",
      },
    });

    // Redirect to the organization settings page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/org/${orgSlug}/settings?accepted=true`
    );
  } catch (error) {
    console.error("Accept invitation error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
