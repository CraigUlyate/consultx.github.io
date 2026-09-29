/* eslint-disable @next/next/no-head-element, @next/next/next-script-for-ga -- App Router root document: retain the supplied GTM head placement and pre-hydration bootstrap. */
import { Montserrat } from "next/font/google";
import "@/app/globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export function RootDocument({ children, marketing = false }: { children: React.ReactNode; marketing?: boolean }) {
  return (
    <html lang="en">
      <head>
        {marketing && (
          <script id="consultx-gtm" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P3HWX62P');` }} />
        )}
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        {marketing && <noscript><iframe title="Google Tag Manager" src="https://www.googletagmanager.com/ns.html?id=GTM-P3HWX62P" height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>}
        {children}
      </body>
    </html>
  );
}
