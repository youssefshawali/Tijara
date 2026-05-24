import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

function getPool(): Pool {
  if (globalForDb.pool) return globalForDb.pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Please define DATABASE_URL in .env.local");
  }

  globalForDb.pool = new Pool({ connectionString });
  return globalForDb.pool;
}

function getDb() {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getPool(), { schema });
  }
  return globalForDb.db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});

export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const value = Reflect.get(getPool(), prop);
    return typeof value === "function" ? value.bind(getPool()) : value;
  },
});
