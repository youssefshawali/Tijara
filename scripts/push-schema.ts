import { readFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { pool } from "@/lib/db";

config({ path: join(process.cwd(), ".env.local") });

async function pushSchema() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required in .env.local");
  }

  const sql = readFileSync(join(process.cwd(), "sql", "schema.sql"), "utf-8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    await pool.query(statement);
  }

  console.log("PostgreSQL schema applied successfully.");
  await pool.end();
}

pushSchema().catch((error) => {
  console.error("Schema push failed:", error);
  process.exit(1);
});
