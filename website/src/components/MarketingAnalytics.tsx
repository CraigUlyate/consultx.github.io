"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackMarketingEvent } from "@/lib/marketing-analytics";

export function MarketingAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackMarketingEvent("consultx_page_view");
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.closest('[data-analytics-exclude]')) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.protocol === "tel:") trackMarketingEvent("consultx_contact_click", "phone");
      else if (url.protocol === "mailto:") trackMarketingEvent("consultx_contact_click", "email");
      else if (url.hostname === "wa.me") trackMarketingEvent("consultx_contact_click", "whatsapp");
      else if (url.origin === window.location.origin && /^\/contact\/?$/.test(url.pathname)) trackMarketingEvent("consultx_consultation_click");
      else if (url.origin === window.location.origin && /^\/portal\/services\/onboard\/?$/.test(url.pathname)) trackMarketingEvent("consultx_onboarding_click");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
