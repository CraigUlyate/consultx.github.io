import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

export const database = connectionString
  ? new Pool({ connectionString, max: 5, ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: true } })
  : null;

export async function requireDatabase() {
  if (!database) throw new Error("DATABASE_URL is not configured.");
  return database;
}
