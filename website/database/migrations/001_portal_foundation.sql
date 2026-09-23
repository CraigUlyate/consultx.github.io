-- ConsultX client platform: Azure Database for PostgreSQL foundation.
-- Apply through the production migration pipeline; do not execute from the browser.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE consultx_role AS ENUM (
  'client_user', 'client_admin', 'accountant', 'consultx_reviewer', 'consultx_admin'
);
CREATE TYPE company_entity_type AS ENUM ('company', 'close_corporation');
CREATE TYPE document_kind AS ENUM ('cipc_disclosure', 'afs', 'fas', 'certificate', 'mandate', 'other');
CREATE TYPE document_status AS ENUM ('uploaded', 'queued_for_extraction', 'extracted', 'failed', 'archived');
CREATE TYPE job_status AS ENUM (
  'information_required', 'under_review', 'awaiting_authorisation',
  'awaiting_payment', 'ready_to_file', 'filing_in_progress', 'completed', 'failed', 'cancelled'
);
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Identity is supplied by Microsoft Entra External ID. No passwords are stored here.
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entra_subject text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_signed_in_at timestamptz
);

CREATE TABLE organisation_members (
  organisation_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role consultx_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organisation_id, user_id)
);

CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  registered_name text NOT NULL,
  registration_number text NOT NULL,
  entity_type company_entity_type NOT NULL DEFAULT 'company',
  financial_year_end_month smallint CHECK (financial_year_end_month BETWEEN 1 AND 12),
  primary_contact_email text,
  annual_return_due_on date,
  beneficial_ownership_current boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organisation_id, registration_number)
);

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_code text NOT NULL UNIQUE,
  name text NOT NULL,
  consultx_fee_cents integer NOT NULL CHECK (consultx_fee_cents >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_reference text NOT NULL UNIQUE,
  organisation_id uuid NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  status job_status NOT NULL DEFAULT 'information_required',
  annual_turnover_cents bigint CHECK (annual_turnover_cents >= 0),
  is_late boolean,
  estimated_cipc_fee_cents integer CHECK (estimated_cipc_fee_cents >= 0),
  confirmed_cipc_fee_cents integer CHECK (confirmed_cipc_fee_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  kind document_kind NOT NULL,
  status document_status NOT NULL DEFAULT 'uploaded',
  original_filename text NOT NULL,
  content_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size > 0),
  blob_key text NOT NULL UNIQUE,
  sha256 text NOT NULL,
  uploaded_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE TABLE job_documents (
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (job_id, document_id)
);

CREATE TABLE extraction_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'azure_document_intelligence',
  provider_operation_id text,
  processor_model text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  error_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Candidate values remain distinct from client-confirmed job values.
CREATE TABLE extracted_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  extraction_run_id uuid NOT NULL REFERENCES extraction_runs(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  value_json jsonb NOT NULL,
  confidence numeric(5,4) CHECK (confidence BETWEEN 0 AND 1),
  source_page integer CHECK (source_page > 0),
  source_text text,
  confirmed_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  confirmed_at timestamptz,
  UNIQUE (extraction_run_id, field_key)
);

CREATE TABLE authorisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  accepted_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  terms_version text NOT NULL,
  input_snapshot jsonb NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE RESTRICT,
  consultx_fee_cents integer NOT NULL CHECK (consultx_fee_cents >= 0),
  cipc_fee_cents integer NOT NULL CHECK (cipc_fee_cents >= 0),
  currency char(3) NOT NULL DEFAULT 'ZAR',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider text NOT NULL DEFAULT 'paystack',
  provider_reference text NOT NULL UNIQUE,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency char(3) NOT NULL DEFAULT 'ZAR',
  status payment_status NOT NULL DEFAULT 'pending',
  provider_event jsonb,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE workflow_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE automation_preferences (
  company_id uuid PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  annual_return_reminders_enabled boolean NOT NULL DEFAULT false,
  reminder_email text,
  reminder_month smallint CHECK (reminder_month BETWEEN 1 AND 12),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX companies_organisation_id_idx ON companies (organisation_id);
CREATE INDEX jobs_company_status_idx ON jobs (company_id, status);
CREATE INDEX documents_organisation_status_idx ON documents (organisation_id, status);
CREATE INDEX extraction_runs_document_status_idx ON extraction_runs (document_id, status);
CREATE INDEX workflow_events_job_created_idx ON workflow_events (job_id, created_at DESC);

INSERT INTO services (service_code, name, consultx_fee_cents)
VALUES ('cipc-annual-return', 'CIPC Annual Return', 15000)
ON CONFLICT (service_code) DO NOTHING;
