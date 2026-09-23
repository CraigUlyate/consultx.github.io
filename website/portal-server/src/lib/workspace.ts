import { requireDatabase } from "@/lib/database";
import { z } from "zod";

export type WorkspaceCompany = {
  id: string;
  registeredName: string;
  registrationNumber: string;
  annualReturnDueOn: string | null;
};

export async function ensurePortalUser(input: { entraSubject: string; email: string; displayName: string }) {
  const db = await requireDatabase();
  const userResult = await db.query<{ id: string }>(
    `INSERT INTO users (entra_subject, email, display_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (entra_subject) DO UPDATE
       SET email = EXCLUDED.email, display_name = EXCLUDED.display_name, last_signed_in_at = now()
     RETURNING id`,
    [input.entraSubject, input.email, input.displayName],
  );
  const userId = userResult.rows[0].id;
  const membership = await db.query<{ organisation_id: string }>(
    `SELECT organisation_id FROM organisation_members WHERE user_id = $1 LIMIT 1`, [userId]);

  if (!membership.rowCount) {
    const organisation = await db.query<{ id: string }>(
      `INSERT INTO organisations (name) VALUES ($1) RETURNING id`,
      [`${input.displayName}'s organisation`],
    );
    await db.query(
      `INSERT INTO organisation_members (organisation_id, user_id, role) VALUES ($1, $2, 'client_admin')`,
      [organisation.rows[0].id, userId],
    );
  }
}

export async function listWorkspaceCompanies(entraSubject: string): Promise<WorkspaceCompany[]> {
  const db = await requireDatabase();
  const result = await db.query<{
    id: string;
    registered_name: string;
    registration_number: string;
    annual_return_due_on: string | null;
  }>(`SELECT c.id, c.registered_name, c.registration_number, c.annual_return_due_on::text
      FROM companies c
      JOIN organisation_members m ON m.organisation_id = c.organisation_id
      JOIN users u ON u.id = m.user_id
      WHERE u.entra_subject = $1
      ORDER BY c.registered_name`, [entraSubject]);

  return result.rows.map((row) => ({
    id: row.id,
    registeredName: row.registered_name,
    registrationNumber: row.registration_number,
    annualReturnDueOn: row.annual_return_due_on,
  }));
}

const companyInput = z.object({
  registeredName: z.string().trim().min(2).max(200),
  registrationNumber: z.string().trim().min(5).max(50),
  entityType: z.enum(["company", "close_corporation"]),
  financialYearEndMonth: z.coerce.number().int().min(1).max(12),
  primaryContactEmail: z.string().trim().email(),
});

export async function createWorkspaceCompany(entraSubject: string, rawInput: unknown) {
  const input = companyInput.parse(rawInput);
  const db = await requireDatabase();
  const membership = await db.query<{ organisation_id: string }>(
    `SELECT m.organisation_id FROM organisation_members m
     JOIN users u ON u.id = m.user_id
     WHERE u.entra_subject = $1 AND m.role IN ('client_admin', 'consultx_admin')
     LIMIT 1`, [entraSubject]);
  if (!membership.rowCount) throw new Error("You do not have permission to add a company.");

  await db.query(
    `INSERT INTO companies (organisation_id, registered_name, registration_number, entity_type, financial_year_end_month, primary_contact_email)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [membership.rows[0].organisation_id, input.registeredName, input.registrationNumber, input.entityType, input.financialYearEndMonth, input.primaryContactEmail],
  );
}
