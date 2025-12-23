const { createClient } = require("@libsql/client");
const { readFileSync, existsSync } = require("fs");
const { join } = require("path");

// Load environment variables from .env.local
function loadEnv() {
  const envPath = join(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

loadEnv();

async function migrateDatabase() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("❌ TURSO_DATABASE_URL environment variable is required");
    process.exit(1);
  }

  console.log("🔌 Connecting to database...");
  const client = createClient({
    url,
    authToken,
  });

  try {
    // Read the migration SQL file
    const migrationPath = join(process.cwd(), "scripts", "002-add-stripe-connect-columns.sql");
    const migration = readFileSync(migrationPath, "utf-8");

    console.log("📝 Executing migration...");

    // Split by semicolons and execute each statement
    const cleanedMigration = migration
      .split("\n")
      .map((line) => {
        const commentIndex = line.indexOf("--");
        if (commentIndex >= 0) {
          return line.substring(0, commentIndex).trim();
        }
        return line.trim();
      })
      .filter((line) => line.length > 0)
      .join("\n");

    const statements = cleanedMigration
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.execute(statement);
          console.log(`✅ Executed: ${statement.substring(0, 60)}...`);
          successCount++;
        } catch (error) {
          // Ignore "duplicate column" errors (column already exists)
          const errorMsg = error.message || "";
          if (errorMsg.includes("duplicate column") || errorMsg.includes("already exists")) {
            console.log(`ℹ️  Column already exists, skipping: ${statement.substring(0, 60)}...`);
            successCount++;
          } else {
            console.warn(`⚠️  Error executing statement: ${errorMsg}`);
            console.warn(`   Statement: ${statement.substring(0, 100)}...`);
            errorCount++;
          }
        }
      }
    }

    console.log(`\n✅ Migration completed! ${successCount} statements executed successfully`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} statements had errors`);
    }
  } catch (error) {
    console.error("❌ Error running migration:", error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

migrateDatabase();
