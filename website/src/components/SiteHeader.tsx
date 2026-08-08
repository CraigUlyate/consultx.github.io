"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ConsultXLogo } from "@/components/ConsultXLogo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  {
    label: "Services",
    href: "/services/",
    children: [
      { label: "Financial Management", href: "/services/financial-management/" },
      { label: "Process Re-engineering", href: "/services/process-reengineering/" },
      { label: "Business Consulting", href: "/services/business-consulting/" },
      { label: "Business Valuations", href: "/services/business-valuations/" },
      { label: "Outsourced CFO", href: "/services/outsourced-cfo/" },
    ],
  },
  { label: "Products", href: "/products/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-consultx-border/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-6 px-5 md:h-24 md:px-8">
        <ConsultXLogo />

        <nav className="hidden items-center gap-10 text-sm font-medium text-consultx-charcoal lg:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <div key={item.href} className="group relative flex h-20 items-center md:h-24">
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 transition ${
                    active
                      ? "font-bold text-consultx-green"
                      : "hover:text-consultx-green"
                  }`}
                >
                  {item.label}
                  {item.children ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                </Link>
                {active ? (
                  <span className="absolute bottom-6 left-0 h-0.5 w-full rounded bg-consultx-green md:bottom-8" />
                ) : null}
                {item.children ? (
                  <div className="invisible absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 pt-0 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-xl border border-consultx-border bg-white p-2 shadow-soft">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 text-sm text-consultx-charcoal hover:bg-consultx-green-soft hover:text-consultx-green-dark"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact/"
            className="hidden rounded-md bg-consultx-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-consultx-green-dark md:inline-flex"
          >
            Book a Consultation
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-consultx-border lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-consultx-border bg-white px-5 py-4 lg:hidden">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 text-sm font-semibold ${
                  isActive(pathname, item.href)
                    ? "bg-consultx-green-soft text-consultx-green-dark"
                    : "text-consultx-charcoal"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact/"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-consultx-green px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
