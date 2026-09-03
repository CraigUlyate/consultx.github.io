import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Search, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Brevlyt AI CFO",
  description:
    "Continuous AI-powered financial intelligence for South African businesses, delivered through ConsultX in partnership with Brevlyt.",
};

const featureCards = [
  {
    icon: Eye,
    title: "Always watching",
    text: "Continuously monitors financial and operational signals so important changes, risks and opportunities do not wait for someone to find them.",
  },
  {
    icon: Search,
    title: "Investigates automatically",
    text: "When something changes, Brevlyt looks beyond the numbers to understand what may be driving it.",
  },
  {
    icon: TrendingUp,
    title: "Turns insight into action",
    text: "Surface recommendations, alerts and follow-ups so management can focus on decisions rather than data hunting.",
  },
];

export default function BrevlytProductPage() {
  return (
    <main className="bg-[#f6f7f9] text-[#15171a]">
      <section className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#edf2ff] px-3 py-2 text-xs font-bold tracking-[0.14em] text-[#315fd9] uppercase">
              <span className="h-2 w-2 rounded-full bg-[#4c6fe7]" />
              Autonomous AI CFO
            </div>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.03] tracking-[-0.04em] sm:text-6xl lg:text-[72px]">
              Your finance function, always on.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-[#596273]">
              Brevlyt continuously monitors your financial and operational data, identifies what needs attention, and does the work of investigating what changed and why.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact/"
                className="rounded-full bg-[linear-gradient(135deg,#3f66dc,#6d8cf5)] px-7 py-3.5 font-semibold text-white shadow-[0_14px_30px_rgba(66,98,220,.22)] transition hover:-translate-y-0.5"
              >
                Book a demo
              </Link>
              <Link
                href="/blog/brevlyt-ai-cfo-south-africa/"
                className="rounded-full bg-[#e7e9ed] px-7 py-3.5 font-semibold text-[#3155bd] transition hover:bg-[#dde1e7]"
              >
                Read the announcement
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[30px] bg-white p-4 shadow-[0_28px_75px_rgba(29,42,72,.12)] md:p-5">
            <div className="overflow-hidden rounded-[20px] border border-[#eceef2] bg-white">
              <video
                className="block h-full w-full object-cover"
                src="/assets/products/Brevlyt_vid.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[28px] bg-white p-7 shadow-[0_18px_45px_rgba(29,42,72,.055)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8eefc] text-[#315fd9]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-[-0.02em]">{title}</h2>
              <p className="mt-3 leading-7 text-[#5a6270]">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-4xl font-extrabold tracking-[-0.035em]">Built for businesses without a Fortune 500 CFO.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#596273]">
            Whether you are managing the finances yourself or leading a growing finance team, Brevlyt gives you continuous financial oversight without adding more people, reports or manual analysis.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[30px] bg-[linear-gradient(145deg,#3f65d8,#6f8ff6)] p-8 text-white">
            <p className="text-xs font-bold tracking-[0.14em] text-white/80 uppercase">For business owners</p>
            <h3 className="mt-6 text-3xl font-extrabold">Stay lean. Move fast.</h3>
            <p className="mt-4 leading-7 text-white/85">Stay on top of performance without wasting time in spreadsheets.</p>
            <ul className="mt-6 space-y-3 text-sm text-white/90">
              <li>Cash and runway monitoring</li>
              <li>Early warning of financial risks</li>
              <li>Recommended next actions</li>
            </ul>
          </div>
          <div className="rounded-[30px] bg-white p-8 shadow-[0_18px_45px_rgba(29,42,72,.055)]">
            <p className="text-xs font-bold tracking-[0.14em] text-[#465064] uppercase">For finance teams</p>
            <h3 className="mt-6 text-3xl font-extrabold">Scale without complexity.</h3>
            <p className="mt-4 leading-7 text-[#596273]">Spend less time gathering and explaining data, and more time making decisions.</p>
            <ul className="mt-6 space-y-3 text-sm text-[#465064]">
              <li>Variance and anomaly investigation</li>
              <li>Forecasting and scenario analysis</li>
              <li>Proactive insights and follow-ups</li>
            </ul>
          </div>
          <div className="rounded-[30px] bg-white p-8 shadow-[0_18px_45px_rgba(29,42,72,.055)]">
            <p className="text-xs font-bold tracking-[0.14em] text-[#465064] uppercase">As you grow</p>
            <h3 className="mt-6 text-3xl font-extrabold">Full visibility at scale.</h3>
            <p className="mt-4 leading-7 text-[#596273]">Brevlyt grows with the complexity of your business.</p>
            <ul className="mt-6 space-y-3 text-sm text-[#465064]">
              <li>Large datasets</li>
              <li>Custom business context</li>
              <li>Deeper agentic workflows</li>
            </ul>
          </div>
        </div>

        <section className="mt-12 rounded-[34px] bg-[linear-gradient(135deg,#eaf0ff,#f8faff)] p-8 md:p-11">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-[#315fd9] uppercase">ConsultX + Brevlyt</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.035em]">Want to see what an AI CFO could identify in your business?</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[#596273]">
                ConsultX can take you through Brevlyt and explore how autonomous financial intelligence could work within your finance function.
              </p>
            </div>
            <Link
              href="/contact/"
              className="inline-flex justify-center rounded-full bg-[linear-gradient(135deg,#3f66dc,#6d8cf5)] px-8 py-4 font-semibold text-white shadow-[0_14px_30px_rgba(66,98,220,.22)] transition hover:-translate-y-0.5"
            >
              Arrange a demo
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
