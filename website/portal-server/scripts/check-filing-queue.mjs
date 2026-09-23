import { DefaultAzureCredential } from "@azure/identity";
import { EmailClient } from "@azure/communication-email";
import { ServiceBusClient } from "@azure/service-bus";
import pg from "pg";

const required = ["DATABASE_URL", "AZURE_SUBSCRIPTION_ID", "AZURE_RESOURCE_GROUP", "CIPC_BROWSER_VM_NAME", "SERVICE_BUS_NAMESPACE", "ACS_ENDPOINT", "CIPC_NOTIFICATION_SENDER", "CIPC_OPERATOR_EMAIL"];
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required.`);

const database = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1, ssl: { rejectUnauthorized: true } });
const credential = new DefaultAzureCredential();
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
const resourceGroup = process.env.AZURE_RESOURCE_GROUP;
const vmName = process.env.CIPC_BROWSER_VM_NAME;
const serviceBusNamespace = process.env.SERVICE_BUS_NAMESPACE.replace(/^sb:\/\//, "");
const vmResourceUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Compute/virtualMachines/${vmName}`;
const emailClient = new EmailClient(process.env.ACS_ENDPOINT, credential);

async function vmPowerState() {
  const token = await credential.getToken("https://management.azure.com/.default");
  const response = await fetch(`${vmResourceUrl}/instanceView?api-version=2024-07-01`, { headers: { Authorization: `Bearer ${token.token}` } });
  if (!response.ok) throw new Error(`Unable to inspect browser VM: ${response.status} ${await response.text()}`);
  const instanceView = await response.json();
  return instanceView.statuses?.find((status) => status.code?.startsWith("PowerState/"))?.code ?? "PowerState/unknown";
}

async function startVm() {
  const token = await credential.getToken("https://management.azure.com/.default");
  const response = await fetch(`${vmResourceUrl}/start?api-version=2024-07-01`, { method: "POST", headers: { Authorization: `Bearer ${token.token}` } });
  if (![200, 202, 204, 409].includes(response.status)) throw new Error(`Unable to start browser VM: ${response.status} ${await response.text()}`);
}

async function deallocateVm() {
  const token = await credential.getToken("https://management.azure.com/.default");
  const response = await fetch(`${vmResourceUrl}/deallocate?api-version=2024-07-01`, { method: "POST", headers: { Authorization: `Bearer ${token.token}` } });
  if (![200, 202, 204, 409].includes(response.status)) throw new Error(`Unable to deallocate browser VM: ${response.status} ${await response.text()}`);
}

async function sendOperatorEmail(filingCount) {
  const poller = await emailClient.beginSend({
    senderAddress: process.env.CIPC_NOTIFICATION_SENDER,
    content: {
      subject: "CIPC filing batch ready — operator login required",
      plainText: `A ConsultX CIPC filing batch with ${filingCount} authorised filing(s) is ready. Open the Azure browser VM through Bastion, sign in to CIPC, and complete the CAPTCHA personally. The worker will continue only after the session is activated.`,
    },
    recipients: { to: [{ address: process.env.CIPC_OPERATOR_EMAIL }] },
  });
  const result = await poller.pollUntilDone();
  if (result.status !== "Succeeded") throw new Error(`Operator email was not accepted: ${result.status}`);
}

async function main() {
  const queued = await database.query("SELECT id, public_reference FROM jobs WHERE status = 'ready_to_file' ORDER BY created_at ASC FOR UPDATE SKIP LOCKED");
  if (queued.rowCount === 0) return console.log("No paid, authorised filings are ready. Browser VM will remain deallocated.");

  const session = await database.query(`INSERT INTO filing_sessions (status)
    SELECT 'awaiting_operator'
    WHERE NOT EXISTS (SELECT 1 FROM filing_sessions WHERE status IN ('awaiting_operator', 'active'))
    RETURNING id`);
  if (session.rowCount === 0) return console.log("An operator filing session already exists. No duplicate notification was sent.");

  let startedByScheduler = false;
  try {
    const currentPowerState = await vmPowerState();
    if (currentPowerState !== "PowerState/running") {
      await startVm();
      startedByScheduler = true;
    }

    const serviceBus = new ServiceBusClient(serviceBusNamespace, credential);
    const sender = serviceBus.createSender("send-notification");
    await sender.sendMessages({
      body: { type: "cipc.operator_login_required", filingSessionId: session.rows[0].id, queuedJobs: queued.rows.map((job) => ({ id: job.id, reference: job.public_reference })), vmName, requestedAt: new Date().toISOString() },
      contentType: "application/json",
      subject: "CIPC operator CAPTCHA login required",
    });
    await sender.close();
    await serviceBus.close();
    await sendOperatorEmail(queued.rowCount);
    console.log(`Started or confirmed ${vmName}; operator email and audit notification sent for ${queued.rowCount} filing(s).`);
  } catch (error) {
    await database.query("UPDATE filing_sessions SET status = 'closed', closed_at = now() WHERE id = $1", [session.rows[0].id]);
    if (startedByScheduler) await deallocateVm();
    throw error;
  }
}

try { await main(); } finally { await database.end(); }
