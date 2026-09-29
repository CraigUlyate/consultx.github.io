import type { Metadata } from "next";
import { RootDocument } from "@/components/RootDocument";

export const metadata: Metadata = {
  title: { default: "Client Portal | ConsultX", template: "%s | ConsultX" },
  icons: { icon: "/favicon.png" },
  description: "ConsultX client services portal",
};

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument><main>{children}</main></RootDocument>;
}
