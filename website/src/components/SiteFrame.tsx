"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkylineDivider } from "@/components/SkylineDivider";
import { AdvisorDrawer } from "@/components/ai/AdvisorDrawer";

export function SiteFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/portal");
  const isAdvisorPage = pathname.startsWith("/advisor");

  if (isPortal) return <main>{children}</main>;

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SkylineDivider />
      <SiteFooter />
      {!isAdvisorPage && <AdvisorDrawer />}
    </>
  );
}

