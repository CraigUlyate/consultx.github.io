-- Human-in-the-loop CIPC filing sessions. CAPTCHA is completed only by an authorised ConsultX operator.
CREATE TYPE filing_session_status AS ENUM ('queued', 'awaiting_operator', 'active', 'expired', 'closed');

CREATE TABLE filing_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status filing_session_status NOT NULL DEFAULT 'queued',
  operator_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  expires_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE submission_attempts
  ADD COLUMN filing_session_id uuid REFERENCES filing_sessions(id) ON DELETE SET NULL;

CREATE INDEX filing_sessions_status_requested_idx ON filing_sessions (status, requested_at);
