type MarketingEvent = "consultx_page_view" | "consultx_contact_click" | "consultx_consultation_click" | "consultx_onboarding_click" | "consultx_enquiry_success";

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

// Deliberately exclude query strings, form values, chat text and client identifiers.
export function trackMarketingEvent(event: MarketingEvent, contactMethod?: "phone" | "email" | "whatsapp") {
  if (typeof window === "undefined" || /^\/(portal|advisor)(\/|$)/.test(window.location.pathname)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    page_location: window.location.origin + window.location.pathname,
    ...(contactMethod ? { contact_method: contactMethod } : {}),
  });
}
