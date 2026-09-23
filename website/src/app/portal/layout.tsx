import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "ConsultX client services portal",
};

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
