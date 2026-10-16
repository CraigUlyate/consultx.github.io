import { DefaultAzureCredential } from "@azure/identity";
import { EmailClient } from "@azure/communication-email";
import { requireDatabase } from "@/lib/database";

/** Retain pending status on failure; retry on the user's next portal visit. */
export async function notifyNewPortalUser(userId: string): Promise<void> {
  const endpoint = process.env.ACS_ENDPOINT;
  const sender = process.env.CIPC_NOTIFICATION_SENDER;
  if (!endpoint || !sender) throw new Error("Portal notification email is not configured.");
  const db = await requireDatabase();
  const connection = await db.connect();
  try {
    await connection.query("BEGIN");
    const result = await connection.query<{ email: string; display_name: string }>(
      "SELECT email, display_name FROM users WHERE id = $1 AND signup_notification_pending = true FOR UPDATE SKIP LOCKED",
      [userId],
    );
    if (result.rowCount) {
      const user = result.rows[0];
      const client = new EmailClient(endpoint, new DefaultAzureCredential());
      const poller = await client.beginSend({
        senderAddress: sender,
        recipients: { to: [{ address: "craig@consultx.co.za" }] },
        content: {
          subject: `ConsultX: New secure portal sign-up — ${user.display_name}`,
          plainText: `A new user has signed in to the secure ConsultX portal.\n\nName: ${user.display_name}\nEmail: ${user.email}\nUser reference: ${userId}\n`,
        },
      });
      const sent = await poller.pollUntilDone();
      if (sent.status !== "Succeeded") throw new Error(`Signup notification not accepted: ${sent.status}`);
      await connection.query(
        "UPDATE users SET signup_notification_pending = false, signup_notified_at = now() WHERE id = $1", [userId],
      );
      console.info("Portal signup notification accepted", { userId, operationId: sent.id });
    }
    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}
