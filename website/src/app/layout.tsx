import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SiteFrame } from "@/components/SiteFrame";
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
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
