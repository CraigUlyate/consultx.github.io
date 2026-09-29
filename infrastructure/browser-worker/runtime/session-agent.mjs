import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import pg from "pg";

const required = ["AZURE_CLIENT_ID", "KEY_VAULT_URL", "DATABASE_SECRET_NAME"];
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required.`);

const intervalMs = Number(process.env.SESSION_HEARTBEAT_MS ?? 60_000);
const sessionMaxMinutes = Number(process.env.SESSION_MAX_MINUTES ?? 120);
const credential = new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID });
const secrets = new SecretClient(process.env.KEY_VAULT_URL, credential);
let database;

async function db() {
  if (database) return database;
  const databaseUrl = (await secrets.getSecret(process.env.DATABASE_SECRET_NAME)).value;
  if (!databaseUrl) throw new Error("Database connection secret is empty.");
  database = new pg.Pool({ connectionString: databaseUrl, max: 2, ssl: { rejectUnauthorized: true } });
  return database;
}

async function expireSessions(pool) {
  const expired = await pool.query(`UPDATE filing_sessions
    SET status = 'expired', closed_at = now(), closed_reason = 'operator session timed out'
    WHERE status = 'active' AND expires_at <= now()
    RETURNING id`);
  if (expired.rowCount) console.log(`Expired ${expired.rowCount} operator session(s).`);
}

async function heartbeat(pool) {
  const active = await pool.query(`UPDATE filing_sessions
    SET last_heartbeat_at = now(), expires_at = LEAST(expires_at + interval '1 minute', activated_at + ($1::text || ' minutes')::interval)
    WHERE status = 'active' AND expires_at > now()
    RETURNING id`, [sessionMaxMinutes]);

  if (active.rowCount) {
    // This agent deliberately performs no CIPC browser action yet. Activation is the gate
    // for the later, supervised Playwright adapter after the browser POC is approved.
    console.log(`Operator session ${active.rows[0].id} remains active; automated browser actions are disabled.`);
  }
}

async function tick() {
  const pool = await db();
  await expireSessions(pool);
  await heartbeat(pool);
}

async function main() {
  console.log("ConsultX CIPC session agent started in supervised, no-browser-action mode.");
  await tick();
  setInterval(() => tick().catch((error) => console.error("Session-agent tick failed:", error)), intervalMs);
}

process.on("SIGTERM", async () => { await database?.end(); process.exit(0); });
process.on("SIGINT", async () => { await database?.end(); process.exit(0); });
main().catch(async (error) => { console.error(error); await database?.end(); process.exit(1); });
