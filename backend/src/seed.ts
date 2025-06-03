import { checkAndPrepareDatabaseAsync } from "./database-seeder";

// This script runs the database seeding process
console.log("Starting database preparation...");

checkAndPrepareDatabaseAsync()
  .then(() => {
    console.log("Database preparation completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database preparation failed:", error);
    process.exit(1);
  });
