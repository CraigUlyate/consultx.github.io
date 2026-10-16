# ConsultX operator notifications

Recipient: `craig@consultx.co.za`.

The `backend/` directory contains the narrowly scoped Cloud Run overlay for the existing AnNa API. Its Dockerfile pins the pre-change production image, so unrelated local backend changes are not deployed. The two route files originate from the October 12 production build source; the new service records notification acceptance in Firestore and uses Resend idempotency keys.

This local overlay is gitignored to keep separate backend source out of the website repository. The deployed changes and tests are also saved in `C:/Users/craig/ai-accountant-mvp`.

Events:
- `/api/v1/advisor/portal-signup`: website portal onboarding form submitted.
- `/api/v1/tenants/register`: first authenticated client or accountant registration; existing registrations are not backfilled. A pending marker permits retry after failed sending.
- `/api/v1/advisor/lead`: booking/consultation request, not a confirmed calendar appointment.
- `/api/v1/advisor/confirm-with-craig`: requested follow-up before payment.
- `/api/v1/advisor/onboarding-progress`: client progress update.

Provider rejection produces an error instead of a false success. Repeating an accepted event does not resend its operator notification. Firestore `consultx_notifications` records the event kind, recipient, status and provider ID; provider acceptance is distinct from recipient-server delivery. Failed requests can be retried by the caller; this change does not introduce a scheduled retry worker.

Build the overlay using Cloud Build, then update the existing `annasimple-api` service in `europe-west1`, project `gen-lang-client-0118381906`. Preserve its existing secrets and environment. Rollback image: the digest pinned in `backend/Dockerfile`.

Run `backend/tests/test_notifications.py` with Python and the existing backend dependencies, setting `PYTHONPATH` to a backend checkout containing the overlay. These tests mock email and database operations.

Build the website with a reachable Cloud Run `NEXT_PUBLIC_ADVISOR_API_URL`; `.env.local` overrides `.env.production`. Publish the built HTML and hashed assets with `npm run deploy -- --skip-build --notifications`.

The separate Microsoft Entra/Azure application in `website/portal-server` requires its own authenticated deployment and is not changed by this Cloud Run overlay. Its prepared sign-up notification uses the existing Azure Communication Services sender and managed identity. Apply migration `005_signup_notifications.sql` before deploying the portal code. Ensure `ACS_ENDPOINT`, `CIPC_NOTIFICATION_SENDER` and the existing email-sender identity permission are configured on the portal Container App. Existing users are not backfilled; failed sends remain pending for the next visit. This Azure portion is not deployed until Azure authentication is restored.

## Verification — 16 October 2026

- Cloud Run revision `annasimple-api-00117-dxr` serves 100% of traffic.
- Eight mocked notification/registration tests pass; website production build and Azure portal typecheck pass.
- Website onboarding page serves the new signup handler and failure messages.
- Resend reported `delivered` to `craig@consultx.co.za` at approximately 08:31 SAST for all three tests:
  - Portal sign-up: `01a14368-e3f0-7b03-b6d3-0bd866c88a92`.
  - Booking request: `01a14368-e78e-74b4-8085-f4a4e1385a45`.
  - Follow-up request: `01a14368-eb5f-760e-a37b-9b52faef1cd7`.
- Repeating the signup test returned success without a second email. The booking flow also sent its normal client confirmation to the same test recipient.
- Delivery status confirms recipient-server acceptance, not inbox placement or reading.
- Azure deployment is pending a fresh login: the existing credential cache cannot be decrypted in this session.
