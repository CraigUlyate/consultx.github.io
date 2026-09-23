-- Filing authority and controlled-submission records for CIPC Annual Returns.
-- Apply through the production migration pipeline after 001_portal_foundation.sql.

CREATE TYPE submission_attempt_status AS ENUM (
  'queued', 'running', 'awaiting_human_action', 'submitted', 'confirmed', 'failed', 'cancelled'
);

CREATE TABLE company_mandates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  granted_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  mandate_version text NOT NULL,
  declaration_text text NOT NULL,
  evidence_document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX active_company_mandate_idx
  ON company_mandates (company_id)
  WHERE revoked_at IS NULL;

ALTER TABLE authorisations
  ADD COLUMN mandate_id uuid REFERENCES company_mandates(id) ON DELETE RESTRICT,
  ADD COLUMN approval_reference text NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex');

CREATE UNIQUE INDEX authorisations_approval_reference_idx
  ON authorisations (approval_reference);

CREATE TABLE submission_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  authorisation_id uuid NOT NULL REFERENCES authorisations(id) ON DELETE RESTRICT,
  idempotency_key uuid NOT NULL DEFAULT gen_random_uuid(),
  status submission_attempt_status NOT NULL DEFAULT 'queued',
  connector_version text NOT NULL,
  cipc_reference text,
  result_document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  error_code text,
  error_summary text,
  queued_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  UNIQUE (job_id, idempotency_key)
);

CREATE INDEX submission_attempts_job_status_idx
  ON submission_attempts (job_id, status, queued_at DESC);

CREATE TABLE operation_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  submission_attempt_id uuid REFERENCES submission_attempts(id) ON DELETE SET NULL,
  task_type text NOT NULL CHECK (task_type IN (
    'review_required', 'human_cipc_step', 'payment_mismatch', 'ambiguous_result', 'connector_change'
  )),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'cancelled')),
  notes text,
  assigned_to_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX operation_tasks_status_created_idx
  ON operation_tasks (status, created_at);
