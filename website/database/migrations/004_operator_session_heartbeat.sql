-- Runtime controls for the human-operated CIPC browser session.
-- A session cannot keep the browser worker active indefinitely without an operator heartbeat.

ALTER TABLE filing_sessions
  ADD COLUMN operator_confirmed_at timestamptz,
  ADD COLUMN last_heartbeat_at timestamptz,
  ADD COLUMN closed_reason text;

CREATE INDEX filing_sessions_active_expiry_idx
  ON filing_sessions (status, expires_at)
  WHERE status = 'active';
