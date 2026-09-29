import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import pg from "pg";

const action = process.argv[2];
if (!['activate', 'stop'].includes(action) || !process.argv.includes('--confirmed')) {
  throw new Error("Use: node operator-session.mjs <activate|stop> --confirmed");
}
for (const name of ["AZURE_CLIENT_ID", "KEY_VAULT_URL", "DATABASE_SECRET_NAME"]) if (!process.env[name]) throw new Error(`${name} is required.`);

const credential = new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID });
const secretClient = new SecretClient(process.env.KEY_VAULT_URL, credential);
const databaseUrl = (await secretClient.getSecret(process.env.DATABASE_SECRET_NAME)).value;
if (!databaseUrl) throw new Error("Database connection secret is empty.");
const database = new pg.Pool({ connectionString: databaseUrl, max: 1, ssl: { rejectUnauthorized: true } });

try {
  if (action === 'activate') {
    const result = await database.query(`UPDATE filing_sessions
      SET status = 'active', activated_at = now(), operator_confirmed_at = now(), last_heartbeat_at = now(),
          expires_at = now() + interval '30 minutes'
      WHERE id = (SELECT id FROM filing_sessions WHERE status = 'awaiting_operator' ORDER BY requested_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED)
      RETURNING id, expires_at`);
    if (!result.rowCount) throw new Error("There is no filing session awaiting operator login.");
    console.log(`Activated filing session ${result.rows[0].id}; it expires at ${result.rows[0].expires_at.toISOString()}.`);
  } else {
    const result = await database.query(`UPDATE filing_sessions
      SET status = 'closed', closed_at = now(), closed_reason = 'operator ended the browser session'
      WHERE status = 'active'
      RETURNING id`);
    console.log(result.rowCount ? `Closed filing session ${result.rows[0].id}.` : "No active filing session to close.");
  }
} finally {
  await database.end();
}
