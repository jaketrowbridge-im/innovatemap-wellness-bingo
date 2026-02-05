import * as schema from "./schema";

function createDb() {
  if (process.env.TURSO_DATABASE_URL) {
    // Production: use Turso / libsql
    const { drizzle } = require("drizzle-orm/libsql");
    const { createClient } = require("@libsql/client");
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return drizzle(client, { schema });
  } else {
    // Local: use better-sqlite3
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    const Database = require("better-sqlite3");
    const sqlite = new Database(process.env.DATABASE_URL?.replace("file:", "") || "local.db");
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    return drizzle(sqlite, { schema });
  }
}

export const db = createDb();
