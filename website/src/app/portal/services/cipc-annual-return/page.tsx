import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { AnnualReturnWizard } from "@/components/portal/AnnualReturnWizard";

export default function CipcAnnualReturnPage() {
  return <PortalShell>
    <div className="mx-auto max-w-4xl">
      <Link href="/portal/" className="inline-flex items-center gap-2 text-sm font-bold text-consultx-charcoal hover:text-consultx-green-dark"><ArrowLeft className="h-4 w-4" />Portal overview</Link>
      <div className="mt-6"><p className="text-sm font-bold text-consultx-green-dark">CIPC ANNUAL RETURN · AR-000128</p><h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Let’s prepare your annual return</h1><p className="mt-3 max-w-2xl leading-7 text-consultx-charcoal">We’ll ask for the information needed to assess your filing. Nothing is submitted to CIPC until you have reviewed and authorised it.</p></div>
      <AnnualReturnWizard />
    </div>
  </PortalShell>;
}
