import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { EmailService } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Initialize email service
    const emailService = new EmailService(process.env.EMAIL_API_KEY || "");

    // Generate verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?email=${encodeURIComponent(user.email)}&token=verification-token`;

    // Send verification email
    const emailResult = await emailService.sendEmailVerificationEmail(
      user.email,
      verificationUrl,
      "User"
    );

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
