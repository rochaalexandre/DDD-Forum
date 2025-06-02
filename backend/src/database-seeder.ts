import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

const prisma = new PrismaClient();

async function checkAndPrepareDatabaseAsync() {
  try {
    // Try to query the database to check connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful");

    // Run pending migrations
    console.log("Checking for pending migrations...");
    await execAsync("npx prisma migrate deploy");
    console.log("Migrations completed");

    // Run seeding
    console.log("Checking if database needs seeding...");
    await seedDatabase();

    return true;
  } catch (error) {
    console.error("Database preparation failed:", error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    // Check if database is already seeded by looking for admin user
    const adminUser = await prisma.user.findFirst({
      where: { username: "admin" },
    });

    if (adminUser) {
      console.log("Database already seeded");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Admin",
      },
    });

    // Create an admin member
    const adminMember = await prisma.member.create({
      data: {
        userId: admin.id,
      },
    });

    // Create sample posts
    const posts = await Promise.all([
      prisma.post.create({
        data: {
          title: "Introduction to Domain-Driven Design",
          content:
            "DDD is a software development approach focusing on the core domain...",
          postType: "Discussion",
          memberId: adminMember.id,
        },
      }),
      prisma.post.create({
        data: {
          title: "Clean Architecture Principles",
          content:
            "Clean Architecture is a software design philosophy that separates concerns...",
          postType: "Discussion",
          memberId: adminMember.id,
        },
      }),
    ]);

    // Add some sample votes
    await Promise.all([
      prisma.vote.create({
        data: {
          postId: posts[0].id,
          memberId: adminMember.id,
          voteType: "Upvote",
        },
      }),
      prisma.vote.create({
        data: {
          postId: posts[1].id,
          memberId: adminMember.id,
          voteType: "Upvote",
        },
      }),
    ]);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { checkAndPrepareDatabaseAsync };
