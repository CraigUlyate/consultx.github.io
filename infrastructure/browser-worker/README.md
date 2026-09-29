# ConsultX CIPC browser worker (proof of concept)

This host is the controlled, human-in-the-loop execution environment for authorised CIPC annual-return filing. It is not a CAPTCHA solver or a web-scraping host.

## Azure resources

- VM: `vm-consultx-cipc-worker-dev`
- Operator account: `consultxoperator`
- Network: private address only, in `snet-browser-worker`
- Remote access: `bas-consultx-dev` (Azure Bastion Developer in South Africa North); no public RDP or browser port is exposed
- Runtime identity: `id-consultx-filing-worker-dev`

The user password is held in Key Vault as `cipc-worker-operator-password-dev`; it must never be put in source control, application logs, or a client-facing page.

## Operator session procedure

1. Start the VM only for a controlled test or a queued filing batch. Open it through Bastion Developer in the Azure portal and connect with RDP as `consultxoperator`.
2. Start the headed browser manually in the remote desktop. The current session agent does not launch, inspect or solve CAPTCHA.
3. The authorised ConsultX operator signs in to CIPC and enters CAPTCHA personally.
4. After confirming that the correct authorised CIPC account is signed in, run `consultx-cipc-session activate` in the VM terminal. This explicitly activates the session; it expires if the agent stops receiving a heartbeat.
5. Keep the remote browser running for the batch. On any unknown screen, error, expiry or unclear outcome, the worker pauses the job and creates an intervention task.
6. At the end of the batch, stop the worker and sign out of CIPC. Do not leave an authenticated session open unnecessarily.

## On-demand lifecycle

The VM is deallocated by default. A daily queue-check task starts it only when there is at least one paid, authorised filing awaiting operator login. The task sends the operator a notification after the VM is available.

When the batch is complete or the worker has been idle for the configured timeout, it must persist the audit state and deallocate the VM. A separate end-of-day safety task deallocates it even if the normal shutdown path fails. This is required to prevent the browser VM becoming a fixed monthly compute cost.

## POC acceptance tests

- The VM has no public IP and RDP is reachable only through Bastion.
- A person can perform CIPC login and CAPTCHA in the headed browser.
- Playwright detects the authenticated state without reading or entering CAPTCHA.
- The same browser profile supports two sequential authorised filing journeys.
- Closing the viewer does not make a job run unsupervised; worker/session heartbeat logic pauses it.
- A failed or ambiguous submission is recorded once and is never automatically re-filed.

## Session-agent deployment

The VM starts `consultx-cipc-session-agent` at boot. It retrieves the database connection only at runtime through its managed identity and Key Vault; no database or CIPC credentials are put into the VM image or service file. The agent only maintains the human-approved session state. It deliberately does **not** enter CIPC data until the browser proof of concept and feature-gated Playwright adapter are complete.

To finish an active batch, run `consultx-cipc-session stop`. The agent closes the session; the separate on-demand shutdown workflow then deallocates the VM.

## What remains before a filing test

The application worker and Filing Centre API must still be deployed to this host. Begin only with a controlled, authorised CIPC journey. Do not run a real production submission until the CIPC process and the full approval/payment/audit path have been tested.
