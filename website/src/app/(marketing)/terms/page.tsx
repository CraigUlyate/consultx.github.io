import { Metadata } from "next";
import Link from "next/link";
import { Scale, ArrowRight, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Website & Engagement Terms | ConsultX",
  description:
    "ConsultX Website Terms and Conditions of Service, covering digital advisory scoping, fee quotes, monthly retainers, AFS amortization, and payment terms.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
            <Scale className="h-4 w-4" />
            Terms of Service &middot; ConsultX (Pty) Ltd
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-consultx-charcoal sm:text-4xl">
            Website &amp; Service Engagement Terms
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Last Updated: October 2026 &middot; Reg No: 2018/395679/07 &middot; Sandton, South Africa
          </p>
        </div>

        {/* Content */}
        <div className="mt-10 space-y-10 text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              1. Scope of Digital Services &amp; AI Advisory
            </h2>
            <p className="mt-3">
              ConsultX (Pty) Ltd provides accounting, statutory compliance, fractional CFO advisory, business valuation, and financial automation services. All professional work is directed and reviewed by <strong>Craig Ulyate (CA(SA))</strong>.
            </p>
            <p className="mt-2">
              Our interactive website tools, diagnostic forms, and AI assistant (&ldquo;Ask AnNa&rdquo;) provide indicative business scoping, operational analysis, and fee calculations based on published ConsultX rates. Preliminary scoping in chat does not constitute an audit opinion or formal tax advice until an official engagement letter is executed.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-700" />
              2. Quotation, Incomplete Checkouts &amp; Payment Terms
            </h2>
            <div className="mt-4 space-y-4 text-gray-700">
              <div>
                <h3 className="font-bold text-consultx-charcoal">2.1 Fixed-Bracket Monthly Retainers</h3>
                <p className="text-sm">
                  Monthly bookkeeping and accounting packages are quantity-based according to transaction volume brackets (bank lines and slip captures) processed using AI-augmented workflows. Services are billed monthly in advance via Paystack or recurring EFT.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-consultx-charcoal">2.2 Annual Financial Statements (AFS) Amortization Commitment</h3>
                <p className="text-sm">
                  Where Annual Financial Statements (AFS) compilation is contracted on an <strong>amortized monthly retainer</strong>, the annual compilation fee is divided over the remaining months until the company&rsquo;s next financial year-end. By accepting an amortized quote, the client agrees:
                </p>
                <ul className="mt-1.5 list-disc space-y-1 pl-6 text-xs text-gray-600">
                  <li>To maintain the monthly payments until delivery of signed financial statements and IT14 submission.</li>
                  <li>In the event of premature cancellation before year-end, the pro-rata balance of completed preparation work and ledger reconciliations becomes immediately payable.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-consultx-charcoal">2.3 Overdue &amp; Catch-up Accounting</h3>
                <p className="text-sm">
                  Where prior-year Annual Financial Statements or tax returns are already overdue or required immediately, <strong>100% of the compilation fee is payable upfront</strong> prior to the commencement of historical reconstruction.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-consultx-charcoal">2.4 Incomplete Checkout &amp; Abandoned Session Follow-up</h3>
                <p className="text-sm">
                  Where you initiate a quotation, scoping dialogue, or payment checkout but do not complete the transaction, ConsultX records the pending session to provide customer assistance, follow-up proposals, or alternative payment arrangements (in accordance with Section 11(1)(b) of POPIA). You may opt out of follow-up communications at any time.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-consultx-charcoal">2.5 Out-of-Scope Work Guarantee</h3>
                <p className="text-sm">
                  All routine recurring services agreed in your scope are covered by your fixed monthly retainer. Any ad-hoc, retroactive, or out-of-scope advisory requests will always be scoped and quoted in advance for your approval before proceeding.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              3. Payment Providers &amp; VAT
            </h2>
            <p className="mt-3">
              All prices quoted on the website and within the AI advisor exclude South African Value-Added Tax (15% VAT) unless expressly stated. Electronic credit/debit card and Instant EFT transactions are processed securely via <strong>Paystack Payments (Pty) Ltd</strong> under PCI-DSS Level 1 compliance.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              4. Client Warranties &amp; Document Accuracy
            </h2>
            <p className="mt-3">
              The client warrants that all financial data, invoices, trial balances, and employee information submitted to ConsultX are true, complete, and legally obtained. ConsultX relies upon client-provided records and does not perform an external statutory audit unless an independent review or audit engagement is explicitly contracted in writing.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              5. Confidentiality &amp; Professional Standards
            </h2>
            <p className="mt-3">
              ConsultX upholds the highest standard of professional ethics under the <strong>South African Institute of Chartered Accountants (SAICA) Code of Professional Conduct</strong>. All financial records, proprietary client workflows, and business intelligence are held in strictest confidence under binding non-disclosure obligations.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              6. Limitation of Liability &amp; Governing Law
            </h2>
            <p className="mt-3">
              These terms are governed by the laws of the Republic of South Africa. To the maximum extent permitted by applicable South African law, ConsultX shall not be liable for indirect, incidental, or consequential damages resulting from third-party software outages (e.g., SARS eFiling, CIPC, Xero, Sage) or inaccurate client-supplied documentation.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-wrap gap-4 border-t border-gray-200 pt-6 text-sm">
          <Link href="/privacy/" className="inline-flex items-center gap-1 font-semibold text-consultx-green-dark hover:text-consultx-green">
            View Privacy Policy (POPIA Statement) <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact/" className="inline-flex items-center gap-1 font-semibold text-consultx-charcoal hover:text-consultx-green">
            Contact ConsultX
          </Link>
        </div>
      </div>
    </div>
  );
}
