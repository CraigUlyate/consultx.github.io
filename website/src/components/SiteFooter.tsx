import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { ConsultXLogo } from "@/components/ConsultXLogo";

const navigate = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Services", href: "/services/" },
  { label: "Products", href: "/products/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

export function SiteFooter() {
  return (
    <footer className="relative z-0 bg-consultx-charcoal text-white">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 pt-12 pb-14 md:grid-cols-2 md:px-8 md:pt-14 lg:grid-cols-4">
        <div>
          <ConsultXLogo variant="light" />
          <p className="mt-6 text-sm leading-7 tracking-wide text-gray-300 uppercase">
            It&apos;s not rocket science,
            <br />
            it&apos;s business science
          </p>
          <p className="mt-8 text-sm text-gray-400">ConsultX © {new Date().getFullYear()}</p>
        </div>

        <div>
          <h3 className="text-base font-semibold">Navigate</h3>
          <div className="mt-4 space-y-2.5 text-sm text-gray-300">
            {navigate.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className="transition hover:text-consultx-green">
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-300">
            <a href="tel:+27115160210" className="flex items-center gap-3 hover:text-white">
              <Phone className="h-4 w-4 text-consultx-green" />
              (011) 516 0210
            </a>
            <a
              href="https://wa.me/27817536198"
              className="flex items-center gap-3 hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4 text-consultx-green" />
              (081) 753 6198
            </a>
            <a href="mailto:info@consultx.co.za" className="flex items-center gap-3 hover:text-white">
              <Mail className="h-4 w-4 text-consultx-green" />
              info@consultx.co.za
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold">Follow Us</h3>
          <div className="mt-5 flex gap-3">
            {[
              { label: "in", href: "https://www.linkedin.com/company/18122520/" },
              { label: "f", href: "https://www.facebook.com/" },
              { label: "▶", href: "https://www.youtube.com/" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-consultx-green text-sm font-bold text-white transition hover:bg-consultx-green-dark"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
