import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, Lock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & POPIA Notice | ConsultX",
  description:
    "ConsultX Privacy Policy and Protection of Personal Information Act (POPIA) compliance statement regarding website usage, AI advisory, quoting, and payment processing.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-consultx-green-dark border border-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            POPIA Compliant &middot; Act 4 of 2013
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-consultx-charcoal sm:text-4xl">
            Privacy Policy &amp; Data Protection Notice
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Effective Date: October 2026 &middot; ConsultX (Pty) Ltd (Registration No: 2018/395679/07)
          </p>
        </div>

        {/* Content */}
        <div className="mt-10 space-y-10 text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              1. Responsible Party &amp; Commitment to POPIA
            </h2>
            <p className="mt-3">
              ConsultX (Pty) Ltd (&ldquo;ConsultX&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy in strict compliance with the <strong>Protection of Personal Information Act, 4 of 2013 (POPIA)</strong> and the <strong>Promotion of Access to Information Act, 2 of 2000 (PAIA)</strong>.
            </p>
            <p className="mt-2">
              This Privacy Policy explains how we collect, process, store, and protect personal and financial information when you interact with our website (<Link href="/" className="text-consultx-green hover:underline">consultx.co.za</Link>), engage our AI advisory assistant (&ldquo;Ask AnNa&rdquo;), generate service quotes, or transact through our payment channels.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              2. Information We Collect
            </h2>
            <p className="mt-3">
              We collect information that you voluntarily provide to us when scoping services, requesting quotes, or onboarding as a client:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-600">
              <li><strong>Contact &amp; Identity Information:</strong> Full name, business email address, contact telephone number, and company name.</li>
              <li><strong>Operational &amp; Financial Metrics:</strong> Monthly transaction volumes, staff headcount, turnover bracket, balance sheet scale, and accounting software used (e.g. Xero, Sage, QuickBooks), necessary to produce binding service quotes.</li>
              <li><strong>Statutory Compliance Details:</strong> Company registration numbers, CIPC filing details, and tax reference numbers when specifically requested for formal service execution.</li>
              <li><strong>Transactional Records:</strong> Service selection, quotation reference numbers, date and time stamps of accepted proposals, and payment status.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl flex items-center gap-2">
              <Lock className="h-5 w-5 text-consultx-green-dark" />
              3. Incomplete Checkouts &amp; Uncompleted Onboarding Follow-Up
            </h2>
            <p className="mt-3">
              In accordance with <strong>Section 11(1)(b) of POPIA</strong> (processing necessary to take steps at the request of the data subject prior to entering into a contract):
            </p>
            <p className="mt-2 text-gray-700">
              Where you initiate a service quotation, interactive scoping session, or payment checkout but do not finalize transaction completion (e.g., closing your browser before card/EFT payment or leaving a quote unconfirmed), our systems record the initiated session details.
            </p>
            <p className="mt-2 text-gray-700">
              We may send you a courteous electronic follow-up notification (via email or WhatsApp) providing a summary of your requested fee quote, an invoice link for direct EFT settlement, or an opportunity to consult with <strong>Craig Ulyate (CA(SA))</strong> regarding any questions or customizations.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              You maintain the absolute right to opt out of any follow-up communication at any time by simply replying with &ldquo;STOP&rdquo; or clicking the unsubscribe link contained in any automated communication.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              4. Cookies, Local Storage &amp; Tracking Technologies
            </h2>
            <p className="mt-3">
              <strong>We do NOT use invasive third-party cross-site advertising cookies or tracking pixels.</strong>
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-600">
              <li><strong>Strictly Necessary &amp; Functional State:</strong> We utilize first-party browser session storage and secure local storage to retain your active chat dialogue, diagnostic inputs, and quote items during your site visit so your session is not lost if you navigate between pages.</li>
              <li><strong>Privacy-Preserving Aggregate Analytics:</strong> We collect aggregate, anonymized website navigation data (pages visited, device type, country) to evaluate site performance without associating IP addresses or browsing histories with personal identities.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              5. Payment Processing Security (Paystack &amp; Banking)
            </h2>
            <p className="mt-3">
              All electronic payments (credit card, debit card, Capitec Pay, and Instant EFT) are processed via our accredited payment partner, <strong>Paystack Payments (Pty) Ltd</strong>, a registered financial services provider certified to <strong>PCI-DSS Level 1</strong> (the highest global standard for payment security).
            </p>
            <p className="mt-2 text-gray-600">
              ConsultX never collects, processes, or stores your raw credit card numbers, CVV security codes, or banking login credentials.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              6. Your Statutory Rights Under POPIA
            </h2>
            <p className="mt-3">
              Under Sections 23 to 25 of POPIA, you have the right to:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-6 text-gray-600">
              <li>Request confirmation of whether we hold personal information about you.</li>
              <li>Request access to the record of your personal information.</li>
              <li>Request the correction, updating, or destruction of personal information that is inaccurate, irrelevant, excessive, or unlawfully retained.</li>
              <li>Object to the processing of your personal information on reasonable grounds.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-consultx-charcoal sm:text-2xl">
              7. Information Officer Contact Details
            </h2>
            <p className="mt-3">
              If you have any questions regarding this Privacy Policy, wish to exercise your statutory rights under POPIA, or wish to report a data protection concern, please contact our Information Officer:
            </p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-700 space-y-2">
              <p><strong>Information Officer:</strong> Craig Ulyate (CA(SA))</p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-consultx-green" />
                <a href="mailto:craig@consultx.co.za" className="text-consultx-green-dark hover:underline">craig@consultx.co.za</a> / <a href="mailto:info@consultx.co.za" className="text-consultx-green-dark hover:underline">info@consultx.co.za</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-consultx-green" />
                (011) 516 0210 / +27 81 753 6198
              </p>
              <p><strong>Physical Address:</strong> Sandton City Office Towers, Sandton, Johannesburg, South Africa</p>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              You also have the right to lodge a complaint with the South African Information Regulator via their official portal at <a href="https://inforegulator.org.za" target="_blank" rel="noreferrer" className="underline hover:text-gray-700">inforegulator.org.za</a>.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-wrap gap-4 border-t border-gray-200 pt-6 text-sm">
          <Link href="/terms/" className="inline-flex items-center gap-1 font-semibold text-consultx-green-dark hover:text-consultx-green">
            View Website Terms &amp; Conditions <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact/" className="inline-flex items-center gap-1 font-semibold text-consultx-charcoal hover:text-consultx-green">
            Contact Craig Ulyate (CA(SA))
          </Link>
        </div>
      </div>
    </div>
  );
}
