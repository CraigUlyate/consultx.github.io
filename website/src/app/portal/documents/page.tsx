import React from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata = {
  title: "Secure Document Vault | ConsultX Client Portal",
  description: "Access encrypted corporate governance records, signed AFS, tax clearance certificates, and CIPC confirmations.",
};

const demoDocuments = [
  {
    id: "doc-1",
    name: "COR14.3 Registration Certificate — ABC Trading (Pty) Ltd.pdf",
    category: "CIPC Statutory",
    size: "420 KB",
    date: "14 Feb 2026",
    status: "Verified",
  },
  {
    id: "doc-2",
    name: "SARS Tax Compliance Status (TCS PIN) — 2026.pdf",
    category: "Tax Compliance",
    size: "185 KB",
    date: "28 Jan 2026",
    status: "Active",
  },
  {
    id: "doc-3",
    name: "Signed Annual Financial Statements — FY2025.pdf",
    category: "Financial Statements",
    size: "1.8 MB",
    date: "15 Oct 2025",
    status: "Signed CA(SA)",
  },
];

export default function DocumentsPage() {
  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-consultx-green-dark">CLIENT PORTAL · VAULT</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-consultx-black md:text-4xl">
              Secure Document Vault
            </h1>
            <p className="mt-2 text-sm text-consultx-charcoal">
              Encrypted repository for official company certificates, tax clearance PINs, and signed AFS packs.
            </p>
          </div>
          <Link
            href="/portal/services/onboard/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 text-sm font-bold text-white transition hover:bg-consultx-green-dark"
          >
            <Upload className="h-4 w-4" /> Upload Verification Document
          </Link>
        </div>

        {/* Security Reassurance Banner */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-consultx-green/30 bg-consultx-green-soft p-4 text-xs text-consultx-green-dark leading-relaxed">
          <ShieldCheck className="h-5 w-5 shrink-0 text-consultx-green-dark mt-0.5" />
          <p>
            <strong>POPIA & ISO Compliant Storage:</strong> All files uploaded or issued through the ConsultX vault are encrypted at rest using AES-256 in private Google Cloud Storage buckets. Accessible only by authorised company representatives.
          </p>
        </div>

        {/* Document List */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-consultx-border bg-white shadow-soft">
          <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-4 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Document Name</span>
            <span className="hidden sm:inline">Category & Size</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-gray-100">
            {demoDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-5 text-xs transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-consultx-green-soft text-consultx-green-dark">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-sm font-bold text-consultx-black block">
                      {doc.name}
                    </strong>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span className="rounded bg-gray-100 px-1.5 py-0.2 text-gray-600">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-gray-600 font-medium block">{doc.category}</span>
                  <span className="text-gray-400 text-[11px]">{doc.size}</span>
                </div>

                <a
                  href="#download"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-consultx-black hover:border-consultx-green hover:text-consultx-green-dark transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
