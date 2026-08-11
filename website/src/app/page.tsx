import { HeroSection } from "@/components/home/HeroSection";

const highlights = [
  {
    title: "Financial Management",
    text: "Strengthen controls, reporting and decision-ready finance operations.",
  },
  {
    title: "Process Re-engineering",
    text: "Remove friction from finance and operational workflows.",
  },
  {
    title: "Business Technology",
    text: "Deploy practical tools that automate work and surface insight.",
  },
];

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <section className="mx-auto grid max-w-[1500px] gap-8 px-5 py-16 md:grid-cols-3 md:px-8">
        {highlights.map((item) => (
          <div key={item.title}>
            <h2 className="text-xl font-bold text-consultx-black">{item.title}</h2>
            <p className="mt-3 leading-7 text-gray-600">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
