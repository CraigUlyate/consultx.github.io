import type { Metadata } from "next";
import { RootDocument } from "@/components/RootDocument";
import { MarketingAnalytics } from "@/components/MarketingAnalytics";
import { SiteFrame } from "@/components/SiteFrame";

export const metadata: Metadata = {
  title: {
    default: "ConsultX | Business Science",
    template: "%s | ConsultX",
  },
  description:
    "ConsultX helps businesses unlock efficiency through financial management, process re-engineering, consulting and intelligent product tools.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootDocument marketing>
        <MarketingAnalytics />
        <SiteFrame>{children}</SiteFrame>
    </RootDocument>
  );
}
