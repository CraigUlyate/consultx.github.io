import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "ConsultX services spanning financial management, process re-engineering and strategy.",
};

const services = [
  {
    id: "financial-management",
    title: "Financial Management",
    text: "Build reliable finance foundations — controls, reporting, cash visibility and performance tracking.",
  },
  {
    id: "process",
    title: "Business Process Re-engineering",
    text: "Redesign operational workflows to reduce waste, improve speed and create cleaner handovers.",
  },
  {
    id: "strategy",
    title: "Financial & Strategic Consulting",
    text: "Support investment decisions, growth planning and transformation with clear commercial analysis.",
  },
];

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">Services</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
        Advisory that turns complexity into clarity
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
        From finance operations to strategic decisions, ConsultX helps teams work smarter and grow
        with confidence.
      </p>

      <div className="mt-12 space-y-10">
        {services.map((service) => (
          <article key={service.id} id={service.id} className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-consultx-black">{service.title}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-gray-600">{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
