import Link from "next/link";
import { Crosshair } from "lucide-react";

export function ConsultationBanner() {
  return (
    <section className="mx-auto mt-10 flex max-w-[1500px] flex-col items-start justify-between gap-5 rounded-xl border border-consultx-green/50 bg-white px-6 py-6 md:flex-row md:items-center md:px-10">
      <div className="flex items-start gap-4 md:items-center">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-consultx-green-soft text-consultx-green md:mt-0">
          <Crosshair className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-consultx-black">More products. More impact.</h2>
          <p className="mt-1 text-consultx-grey">
            We&apos;re continuously building tools that help you work smarter and grow stronger.
          </p>
        </div>
      </div>
      <Link
        href="/contact/"
        className="inline-flex items-center gap-2 rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-consultx-green-dark"
      >
        Book a Consultation →
      </Link>
    </section>
  );
}
