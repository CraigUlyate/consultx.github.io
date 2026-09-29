export const PUBLIC_CHAT_NOTICE = "Use this public chat for business descriptions and scoping only. Do not share identity documents, bank statements, payroll details, passwords or API keys. Sensitive documents must wait for an authenticated upload workflow whose deployed controls have been verified.";
export const PUBLIC_CHAT_BLOCK_MESSAGE = "Please remove sensitive details and describe the business issue at a high level. Do not paste documents or credentials here. A verified authenticated upload workflow is required for sensitive documents; it is not available through this chat.";

// Best-effort prevention of obvious pasted secrets/records, not comprehensive DLP.
// General questions about these subjects and aggregate headcounts remain allowed.
export function containsSensitivePublicInput(text: string): boolean {
  return /\b(?:password|api[_ -]?key|secret[_ -]?key|access[_ -]?token)\s*[:=]\s*\S+/i.test(text)
    || /\bAIza[\w-]{25,}\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)
    || /\b(?:id(?:entity)?(?: number| no)?|passport(?: number)?|bank account(?: number)?)\s*[:=]\s*[\w-]{6,}/i.test(text)
    || /\b\d{13}\b/.test(text)
    || /\b(?:gross pay|net pay|employee salary|account holder|opening balance|closing balance)\s*[:=]/i.test(text);
}
