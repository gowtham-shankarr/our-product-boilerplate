import { db } from "./index.js";

async function main() {
  console.log("🌱 Seeding database...");

  // Create a test user
  const user = await db.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
    },
  });

  // Create a test organization
  const organization = await db.organization.upsert({
    where: { slug: "test-org" },
    update: {},
    create: {
      name: "Test Organization",
      slug: "test-org",
      description: "A test organization for development",
    },
  });

  // Create membership
  await db.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: "owner",
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
