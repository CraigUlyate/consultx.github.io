import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SkylineDivider } from "@/components/SkylineDivider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ConsultX | Business Science",
    template: "%s | ConsultX",
  },
  description:
    "ConsultX helps businesses unlock efficiency through financial management, process re-engineering, consulting and intelligent product tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <SiteHeader />
        <main>{children}</main>
        <SkylineDivider />
        <SiteFooter />
      </body>
    </html>
  );
}
