import Link from "next/link";
import {
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { ConsultXLogo } from "@/components/ConsultXLogo";
import { AdvisorDrawer } from "@/components/ai/AdvisorDrawer";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, href: "/portal/" },
  { label: "Companies", icon: Building2, href: "/portal/companies/" },
  { label: "My services", icon: ClipboardList, href: "/portal/services/" },
  { label: "Documents", icon: FileText, href: "/portal/documents/" },
];

export function PortalShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f6f8f6] text-consultx-black">
      <header className="border-b border-consultx-border bg-white">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8">
          <ConsultXLogo />
          <div className="flex items-center gap-3">
            <button
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-consultx-charcoal hover:bg-consultx-light-grey sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-consultx-green" />
            </button>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-consultx-light-grey">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-consultx-black text-sm font-bold text-white">
                CU
              </span>
              <span className="hidden sm:block">
                <span className="block text-sm font-semibold">Craig Ulyate</span>
                <span className="block text-xs text-consultx-grey">ConsultX client</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-consultx-grey sm:block" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-consultx-border bg-white p-5 lg:block">
          <nav className="space-y-1">
            {navigation.map(({ label, icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-all ${
                  href === "/portal/"
                    ? "bg-consultx-green-soft text-consultx-green-dark"
                    : "text-consultx-charcoal hover:bg-consultx-light-grey"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>

          {/* AnNa AI Advisor Card in Portal Sidebar */}
          <div className="mt-6 rounded-xl bg-consultx-black p-4 text-white shadow-soft">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-consultx-green text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold">Ask AnNa AI</div>
                <div className="text-[10px] text-gray-300">CA(SA) AI Advisor</div>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-gray-300 leading-tight">
              Instant fixed quotes, valuation diagnostics, and workflow automation.
            </p>
            <Link
              href="/advisor/"
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-consultx-green py-2 text-xs font-bold text-white hover:bg-consultx-green-dark transition-all"
            >
              Open AI Advisor
            </Link>
          </div>

          <div className="mt-8 border-t border-consultx-border pt-5 space-y-1">
            <Link
              href="/portal/settings/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-consultx-charcoal hover:bg-consultx-light-grey"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-consultx-charcoal hover:bg-consultx-light-grey"
            >
              <LogOut className="h-5 w-5" />
              Return to website
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
      </div>

      {/* Floating AnNa Drawer accessible across all portal routes */}
      <AdvisorDrawer />
    </div>
  );
}
