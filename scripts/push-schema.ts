import { readFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { pool } from "@/lib/db";

config({ path: join(process.cwd(), ".env.local") });

function stripLineComments(sql: string) {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}

function parseStatements(sql: string) {
  return stripLineComments(sql)
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function pushSchema() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required in .env.local");
  }

  const raw = readFileSync(join(process.cwd(), "sql", "schema.sql"), "utf-8");
  const statements = parseStatements(raw);

  if (process.env.DATABASE_URL.includes("-pooler")) {
    console.warn(
      "Warning: use Neon's direct connection URL (not -pooler) for db:push."
    );
  }

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.slice(0, 60).replace(/\s+/g, " ");
    try {
      await pool.query(statement);
    } catch (err) {
      console.error(`Failed on statement ${i + 1}: ${preview}...`);
      throw err;
    }
  }

  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'admin_users'`
  );
  if (!rows[0]?.n) {
    throw new Error(
      "Schema push finished but admin_users table is missing. Check DATABASE_URL points to the correct Neon database."
    );
  }

  console.log("PostgreSQL schema applied successfully.");
  await pool.end();
}

pushSchema().catch((error) => {
  console.error("Schema push failed:", error);
  process.exit(1);
});
