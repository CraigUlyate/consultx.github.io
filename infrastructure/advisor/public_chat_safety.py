"""Best-effort public input screening; never a substitute for access control or DLP."""
import re

PUBLIC_BOUNDARY = (
    "Please describe the business issue without sensitive details. Do not share identity "
    "documents, bank statements, payroll records, passwords or API keys in public chat. "
    "Sensitive documents must wait for an authenticated upload workflow whose deployed "
    "controls have been verified. No such upload handoff is available through this chat."
)

_PATTERNS = [
    r"\b(?:password|api[_ -]?key|secret[_ -]?key|access[_ -]?token)\s*[:=]\s*\S+",
    r"\bAIza[\w-]{25,}\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
    r"\b(?:id(?:entity)?(?: number| no)?|passport(?: number)?|bank account(?: number)?)\s*[:=]\s*[\w-]{6,}",
    r"\b\d{13}\b",
    r"\b(?:gross pay|net pay|employee salary|account holder|opening balance|closing balance)\s*[:=]",
]


def contains_sensitive_input(text: str) -> bool:
    return any(re.search(pattern, text, re.IGNORECASE) for pattern in _PATTERNS)
