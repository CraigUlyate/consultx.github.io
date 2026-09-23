import React, { Suspense } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { OnboardClient } from "./OnboardClient";

export const metadata = {
  title: "Onboard Statutory & Accounting Services | ConsultX Portal",
  description: "Secure client onboarding and checkout for South African statutory compliance, financial statements, and tax services.",
};

export default function OnboardServicesPage() {
  return (
    <PortalShell>
      <Suspense
        fallback={
          <div className="p-12 text-center text-sm text-gray-500">
            Loading ConsultX service onboarding portal...
          </div>
        }
      >
        <OnboardClient />
      </Suspense>
    </PortalShell>
  );
}
