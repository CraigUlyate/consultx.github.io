import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";

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

      <form className="space-y-4 rounded-3xl border border-consultx-border bg-white p-8 shadow-soft">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-consultx-charcoal">Name</span>
          <input
            type="text"
            name="name"
            className="w-full rounded-md border border-consultx-border px-4 py-3 outline-none focus:border-consultx-green"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-consultx-charcoal">Email</span>
          <input
            type="email"
            name="email"
            className="w-full rounded-md border border-consultx-border px-4 py-3 outline-none focus:border-consultx-green"
            placeholder="you@company.co.za"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-consultx-charcoal">Message</span>
          <textarea
            name="message"
            rows={5}
            className="w-full rounded-md border border-consultx-border px-4 py-3 outline-none focus:border-consultx-green"
            placeholder="What would you like to discuss?"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:bg-consultx-green-dark"
        >
          Send Message
        </button>
        <p className="text-xs leading-5 text-consultx-grey">
          This form is front-end only for now. Wire it to your Afrihost mail handler or CRM when ready.
        </p>
      </form>
    </section>
  );
}
