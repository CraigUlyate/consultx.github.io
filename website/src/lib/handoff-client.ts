/**
 * Client Portal to AnNa SaaS Secure Handoff Utility (Section 4).
 * Replaces legacy base64 and unsupported /redeem routes with opaque references.
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_ADVISOR_API_URL ||
  "https://annasimple-api-37055003117.europe-west1.run.app";
const SAAS_URL = process.env.NEXT_PUBLIC_ANNA_SAAS_URL || "https://anna-accounting.com";

export interface HandoffSessionView {
  handoff_id: string;
  status: "active" | "redeemed" | "expired" | "cancelled";
  offering_id: string;
  destination_path: string;
  facts: Record<string, unknown>;
  pricing_summary: Record<string, unknown>;
  requires_auth: boolean;
  requires_tenant: boolean;
  required_entitlement?: string;
  created_at: string;
  expires_at: string;
}

export interface HandoffRedeemResponse {
  ok: boolean;
  status: string;
  idempotent?: boolean;
  message?: string;
  tenant_id?: string;
  name?: string;
  offering_id?: string;
  facts?: Record<string, unknown>;
}

/**
 * Fetch public session metadata from the server-side handoff store.
 */
export async function fetchHandoffSession(handoffId: string): Promise<HandoffSessionView | null> {
  if (!handoffId || !BACKEND_URL) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/handoff/${encodeURIComponent(handoffId)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 410) {
        return null;
      }
      throw new Error(`Failed to load handoff: ${res.status}`);
    }

    return (await res.json()) as HandoffSessionView;
  } catch (err) {
    console.warn("Could not retrieve handoff session:", err);
    return null;
  }
}

/**
 * Redeem a handoff session and associate it with a user/tenant.
 */
export async function redeemHandoffSession(
  handoffId: string,
  tenantId?: string,
  userToken?: string
): Promise<HandoffRedeemResponse> {
  if (!BACKEND_URL) {
    return { ok: false, status: "unavailable", message: "API backend url not configured." };
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/handoff/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
    },
    body: JSON.stringify({
      handoff_id: handoffId,
      tenant_id: tenantId,
      action: tenantId ? "resume" : "create_tenant",
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    return {
      ok: false,
      status: "error",
      message: errData.detail || `Handoff redemption failed (${res.status})`,
    };
  }

  return (await res.json()) as HandoffRedeemResponse;
}

/**
 * Resolve approved destination URL for a given canonical route and handoff reference.
 */
export function getApprovedDestinationUrl(destinationPath: string, handoffId?: string): string {
  const cleanPath = destinationPath.startsWith("/") ? destinationPath : `/${destinationPath}`;
  const isSaasRoute = [
    "/cipc-annual-returns",
    "/provisional-tax",
    "/expense-dashboard",
    "/debtor-chase",
    "/erp",
    "/apps",
  ].some((prefix) => cleanPath.startsWith(prefix));

  const baseOrigin = isSaasRoute ? SAAS_URL : "";
  const param = handoffId ? `?handoff_id=${encodeURIComponent(handoffId)}` : "";
  return `${baseOrigin}${cleanPath}${param}`;
}
