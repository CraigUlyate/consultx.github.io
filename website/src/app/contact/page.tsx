import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a consultation with ConsultX.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-[1100px] gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-8">
      <div>
        <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">Contact</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
          Book a consultation
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-700">
          Tell us where your finance or operations need leverage. We&apos;ll scope a practical next
          step — advisory, product tooling, or both.
        </p>

        <div className="mt-10 space-y-4 text-consultx-charcoal">
          <a href="tel:+27115160210" className="flex items-center gap-3 font-medium hover:text-consultx-green">
            <Phone className="h-5 w-5 text-consultx-green" />
            (011) 516 0210
          </a>
          <a
            href="https://wa.me/27817536198"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 font-medium hover:text-consultx-green"
          >
            <MessageCircle className="h-5 w-5 text-consultx-green" />
            (081) 753 6198
          </a>
          <a
            href="mailto:info@consultx.co.za"
            className="flex items-center gap-3 font-medium hover:text-consultx-green"
          >
            <Mail className="h-5 w-5 text-consultx-green" />
            info@consultx.co.za
          </a>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
