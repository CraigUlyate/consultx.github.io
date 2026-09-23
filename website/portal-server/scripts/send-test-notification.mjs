import { DefaultAzureCredential } from "@azure/identity";
import { EmailClient } from "@azure/communication-email";

const required = ["ACS_ENDPOINT", "CIPC_NOTIFICATION_SENDER", "CIPC_OPERATOR_EMAIL"];
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required.`);

const emailClient = new EmailClient(process.env.ACS_ENDPOINT, new DefaultAzureCredential());
const poller = await emailClient.beginSend({
  senderAddress: process.env.CIPC_NOTIFICATION_SENDER,
  content: {
    subject: "ConsultX CIPC notification test",
    plainText: "This confirms that the ConsultX CIPC Annual Returns scheduler can send branded operator notifications. No filing was created and no browser VM was started.",
  },
  recipients: { to: [{ address: process.env.CIPC_OPERATOR_EMAIL }] },
});
const result = await poller.pollUntilDone();
if (result.status !== "Succeeded") throw new Error(`Test email was not accepted: ${result.status}`);
console.log("Branded CIPC notification test email accepted.");
