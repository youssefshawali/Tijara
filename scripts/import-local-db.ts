/**
 * Copy all app data from a local/old Postgres database into DATABASE_URL (Neon).
 *
 * Usage:
 *   1. Add to .env.local (do not commit):
 *      LOCAL_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/tijara
 *      DATABASE_URL=your-neon-url-with-sslmode=require
 *   2. npm run db:push
 *   3. npm run db:import
 */
import { config } from "dotenv";
import { join } from "path";
import { Pool } from "pg";

config({ path: join(process.cwd(), ".env.local") });

const TABLES = [
  "admin_users",
  "site_settings",
  "services",
  "testimonials",
  "blog_posts",
  "contact_submissions",
  "team_members",
  "media_files",
] as const;

async function tableExists(pool: Pool, table: string) {
  const { rows } = await pool.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = $1`,
    [table]
  );
  return rows.length > 0;
}

async function copyTable(source: Pool, target: Pool, table: string) {
  const existsOnSource = await tableExists(source, table);
  if (!existsOnSource) {
    console.log(`  skip ${table} (not on source)`);
    return 0;
  }

  const { rows } = await source.query(`SELECT * FROM "${table}"`);
  if (rows.length === 0) {
    console.log(`  skip ${table} (empty)`);
    return 0;
  }

  const columns = Object.keys(rows[0] as Record<string, unknown>);
  const colList = columns.map((c) => `"${c}"`).join(", ");
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

  let imported = 0;
  for (const row of rows) {
    const values = columns.map((c) => (row as Record<string, unknown>)[c]);
    await target.query(
      `INSERT INTO "${table}" (${colList}) VALUES (${placeholders})
       ON CONFLICT DO NOTHING`,
      values
    );
    imported++;
  }

  console.log(`  ${table}: ${imported} row(s)`);
  return imported;
}

async function main() {
  const sourceUrl = process.env.LOCAL_DATABASE_URL;
  const targetUrl = process.env.DATABASE_URL;

  if (!sourceUrl) {
    throw new Error("LOCAL_DATABASE_URL is required in .env.local (old local Postgres)");
  }
  if (!targetUrl) {
    throw new Error("DATABASE_URL is required in .env.local (Neon)");
  }

  if (sourceUrl === targetUrl) {
    throw new Error("LOCAL_DATABASE_URL and DATABASE_URL must be different");
  }

  const source = new Pool({ connectionString: sourceUrl });
  const target = new Pool({ connectionString: targetUrl });

  try {
    console.log("Checking target database...");
    const targetHasAdmin = await tableExists(target, "admin_users");
    if (!targetHasAdmin) {
      throw new Error(
        'Target has no tables. Run "npm run db:push" against Neon first.'
      );
    }

    console.log("Importing data (existing Neon rows with same id are kept)...\n");
    let total = 0;
    for (const table of TABLES) {
      total += await copyTable(source, target, table);
    }

    console.log(`\nImport finished (${total} rows processed).`);
    console.log("Restart npm run dev and check Admin → Messages, Services, etc.");
  } finally {
    await source.end();
    await target.end();
  }
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
