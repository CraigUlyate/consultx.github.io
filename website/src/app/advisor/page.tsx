import type { Metadata } from "next";
import { Suspense } from "react";
import { AdvisorPageClient } from "./AdvisorPageClient";

export const metadata: Metadata = {
  title: "Ask AnNa | AI Business Solution Advisor",
  description:
    "Diagnose your financial and operational workflows with AnNa, ConsultX's AI accountant and advisor. Get an instant Solution Blueprint and indicative quote.",
};

export default function AdvisorPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center text-sm text-gray-400">Loading AnNa...</div>}>
      <AdvisorPageClient />
    </Suspense>
  );
}
