import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { EmailService } from "@/lib/email";
import { z } from "zod";

const invitationSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["member", "admin"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = invitationSchema.parse(body);

    // Check if user is a member of this organization with admin/owner role
    const userMembership = await db.membership.findFirst({
      where: {
        organization: { slug: params.slug },
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: "You don't have permission to invite members" },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
      include: {
        memberships: {
          where: {
            organization: { slug: params.slug },
          },
        },
      },
    });

    if (existingUser?.memberships.length) {
      return NextResponse.json(
        { error: "User is already a member of this organization" },
        { status: 400 }
      );
    }

    // Get organization and inviter details
    const organization = await db.organization.findUnique({
      where: { slug: params.slug },
      select: { id: true, name: true },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const inviter = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    // Initialize email service
    const emailService = new EmailService(process.env.EMAIL_API_KEY || "");

    // Generate invitation URL (in a real app, you'd create a token and store it)
    const invitationUrl = `${process.env.NEXTAUTH_URL}/invitations/accept?email=${encodeURIComponent(validatedData.email)}&org=${params.slug}&role=${validatedData.role}`;

    // Send invitation email
    const emailResult = await emailService.sendInvitationEmail(
      validatedData.email,
      organization.name,
      inviter?.name || "A team member",
      validatedData.role,
      invitationUrl
    );

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      // For development, we'll still return success but log the error
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: Invitation URL:", invitationUrl);
        return NextResponse.json({
          success: true,
          message:
            "Invitation created (email not sent - check console for URL)",
          invitationUrl: invitationUrl,
          messageId: "dev-mode",
        });
      }
      return NextResponse.json(
        { error: "Failed to send invitation email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error("Invitation error:", error);

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
