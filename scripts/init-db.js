const { createClient } = require("@libsql/client")
const { readFileSync, existsSync } = require("fs")
const { join } = require("path")

// Load environment variables from .env.local
function loadEnv() {
  const envPath = join(process.cwd(), ".env.local")
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf-8")
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=")
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "")
          process.env[key.trim()] = value
        }
      }
    })
  }
}

loadEnv()

async function initDatabase() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    console.error("❌ TURSO_DATABASE_URL environment variable is required")
    process.exit(1)
  }

  console.log("🔌 Connecting to database...")
  const client = createClient({
    url,
    authToken,
  })

  try {
    // Read the SQL schema file
    const schemaPath = join(process.cwd(), "scripts", "001-init-schema.sql")
    const schema = readFileSync(schemaPath, "utf-8")

    console.log("📝 Executing schema...")
    
    // Split by semicolons and execute each statement
    // Remove comments and empty lines, then split by semicolon
    const cleanedSchema = schema
      .split("\n")
      .map((line) => {
        // Remove inline comments
        const commentIndex = line.indexOf("--")
        if (commentIndex >= 0) {
          return line.substring(0, commentIndex).trim()
        }
        return line.trim()
      })
      .filter((line) => line.length > 0)
      .join("\n")

    const statements = cleanedSchema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    let successCount = 0
    let errorCount = 0

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.execute(statement)
          successCount++
        } catch (error) {
          // Ignore "table already exists" and "index already exists" errors
          const errorMsg = error.message || ""
          if (
            !errorMsg.includes("already exists") &&
            !errorMsg.includes("duplicate")
          ) {
            console.warn(`⚠️  Warning executing statement: ${errorMsg}`)
            console.warn(`   Statement: ${statement.substring(0, 100)}...`)
            errorCount++
          } else {
            successCount++
          }
        }
      }
    }

    console.log(`✅ Executed ${successCount} statements successfully`)
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} statements had errors`)
    }

    console.log("✅ Database initialized successfully!")
    
    // Verify tables exist
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )
    console.log(`📊 Created ${tables.rows.length} tables:`)
    tables.rows.forEach((row) => {
      console.log(`   - ${row.name}`)
    })
  } catch (error) {
    console.error("❌ Error initializing database:", error.message)
    process.exit(1)
  } finally {
    client.close()
  }
}

initDatabase()
