import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { z } from "zod";

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    // Update user settings
    // Note: We'll need to add these fields to the User model later
    // For now, we'll store them in a JSON field or create a separate settings table
    await db.user.update({
      where: { id: session.user.id },
      data: {
        // TODO: Add settings fields to User model
        // settings: validatedData,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: validatedData,
    });
  } catch (error) {
    console.error("Settings update error:", error);

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
