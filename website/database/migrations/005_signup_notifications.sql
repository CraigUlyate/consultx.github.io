BEGIN;
-- Existing users are not backfilled; only users created after this migration notify.
ALTER TABLE users ADD COLUMN IF NOT EXISTS signup_notification_pending boolean NOT NULL DEFAULT false;
ALTER TABLE users ALTER COLUMN signup_notification_pending SET DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS signup_notified_at timestamptz;
COMMIT;
