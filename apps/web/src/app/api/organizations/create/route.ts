import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { z } from "zod";

const createOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOrganizationSchema.parse(body);

    // Generate a unique slug from the organization name
    const baseSlug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug already exists and generate a unique one
    let slug = baseSlug;
    let counter = 1;

    while (await db.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the organization
    const organization = await db.organization.create({
      data: {
        name: validatedData.name,
        slug: slug,
        description: validatedData.description || "",
      },
    });

    // Create membership for the current user as owner
    await db.membership.create({
      data: {
        userId: session.user.id,
        organizationId: organization.id,
        role: "owner",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Organization created successfully",
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
      },
    });
  } catch (error) {
    console.error("Create organization error:", error);

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
