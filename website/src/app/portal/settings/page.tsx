import { Landmark, Shield, User } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata = {
  title: "Account Settings | ConsultX Client Portal",
  description: "Manage client profile, notification emails, and statutory authorization settings.",
};

export default function SettingsPage() {
  return (
    <PortalShell>
      <div className="mx-auto max-w-4xl">
        <div>
          <p className="text-sm font-semibold text-consultx-green-dark">CLIENT PORTAL · SETTINGS</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-consultx-black md:text-4xl">
            Account & Notification Settings
          </h1>
          <p className="mt-2 text-sm text-consultx-charcoal">
            Manage your representative profile, notification dispatch addresses, and billing defaults.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* User Profile Card */}
          <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
            <h2 className="text-base font-bold text-consultx-black flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="h-5 w-5 text-consultx-green-dark" />
              Primary Representative Details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block text-gray-500 font-medium">Full Name</label>
                <input
                  defaultValue="Craig Ulyate"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-900 bg-gray-50/50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-500 font-medium">Work Email Address</label>
                <input
                  defaultValue="craig@consultx.co.za"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-900 bg-gray-50/50"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Official Bank EFT Defaults Card */}
          <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
            <h2 className="text-base font-bold text-consultx-black flex items-center gap-2 border-b border-gray-100 pb-3">
              <Landmark className="h-5 w-5 text-amber-700" />
              Settlement & Banking Preference
            </h2>
            <p className="mt-3 text-xs text-gray-600 leading-relaxed">
              Official Pro-Forma Tax Invoices generated for your mandates are issued with ConsultX’s Investec Bank Ltd details:
            </p>
            <div className="mt-4 rounded-xl bg-gray-50 p-4 border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank Name:</span>
                <strong className="text-gray-900">Investec Bank Ltd</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Name:</span>
                <strong className="text-gray-900">ConsultX (Pty) Ltd</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Branch Code:</span>
                <strong className="font-mono text-gray-900">580105</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Type:</span>
                <strong className="text-gray-900">Business Current Account</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dispatch Sender:</span>
                <strong className="text-consultx-green-dark">craig@consultx.co.za</strong>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft text-xs">
            <h2 className="text-base font-bold text-consultx-black flex items-center gap-2 border-b border-gray-100 pb-3">
              <Shield className="h-5 w-5 text-consultx-green-dark" />
              Security & POPIA Compliance
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Your company records and filing documents are stored under strict POPIA controls. Banking details are protected via Google Cloud Secret Manager.
            </p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
