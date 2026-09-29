import { RootDocument } from "@/components/RootDocument";
import { SiteFrame } from "@/components/SiteFrame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "ConsultX | Business Science", template: "%s | ConsultX" },
  description: "Discuss your business needs with the ConsultX advisor.",
  icons: { icon: "/favicon.png" },
};

export default function AdvisorLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument><SiteFrame>{children}</SiteFrame></RootDocument>;
}
