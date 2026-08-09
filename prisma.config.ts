import "dotenv/config"
import { defineConfig } from "prisma/config"

// Zerops connection strings may omit the database pathname. When absent,
// Prisma's schema engine defaults to "postgres" while the pg module defaults
// to the username. Normalize the URL so both use the same database.
let dbUrl = process.env.DATABASE_URL!
if (dbUrl) {
  try {
    const parsed = new URL(dbUrl)
    if (!parsed.pathname || parsed.pathname === "/") {
      parsed.pathname = "/" + decodeURIComponent(parsed.username)
      dbUrl = parsed.toString()
    }
  } catch {
    // Not a valid URL — use as-is
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
})
