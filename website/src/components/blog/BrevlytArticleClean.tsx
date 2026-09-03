import Link from "next/link";
import {
  Activity,
  BarChart3,
  Check,
  Eye,
  LineChart,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "lucide-react";

const bodyClass = "space-y-5 text-[17px] leading-8 text-[#5f6877]";

export function BrevlytArticleClean() {
  return (
    <article className="relative overflow-hidden bg-[#f6f7f9] text-[#17191d]">
      <div className="pointer-events-none absolute left-[-120px] top-[760px] h-[340px] w-[340px] rounded-full bg-[#6d8cf5]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-140px] top-[1750px] h-[420px] w-[420px] rounded-full bg-[#4c6fe7]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[12%] top-[3300px] h-[280px] w-[280px] rounded-full bg-[#95a9ef]/10 blur-3xl" />

      <section className="relative mx-auto max-w-[1180px] px-5 pb-14 pt-10 md:px-8 md:pb-20 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#edf2ff] px-3 py-2 text-xs font-bold tracking-[0.14em] text-[#315fd9] uppercase">
              <span className="h-2 w-2 rounded-full bg-[#4c6fe7]" />
              Partnership announcement
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-[-0.035em] text-[#15171a] sm:text-5xl lg:text-[64px]">
              ConsultX Partners with Brevlyt to Bring Autonomous CFO AI to South Africa
            </h1>
            <p className="mt-7 text-lg font-semibold text-[#283246] italic">
              This is not another AI influencer demo!
            </p>
            <p className="mt-3 max-w-[650px] text-lg leading-8 text-[#596273] italic">
              It is a sophisticated financial intelligence platform, delivered with the expertise of finance professionals and technology specialists to guarantee successful outcomes for your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact/" className="rounded-full bg-[linear-gradient(135deg,#3f66dc,#6d8cf5)] px-7 py-3.5 font-semibold text-white shadow-[0_14px_30px_rgba(66,98,220,.22)] transition hover:-translate-y-0.5">
                Book a demo
              </Link>
              <Link href="/contact/" className="rounded-full bg-[#e7e9ed] px-7 py-3.5 font-semibold text-[#3155bd] transition hover:bg-[#dde1e7]">
                Talk to us
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[30px] bg-white p-4 shadow-[0_28px_75px_rgba(29,42,72,.12)] md:p-5">
            <div className="overflow-hidden rounded-[20px] border border-[#eceef2] bg-white">
              <video className="block h-full w-full object-cover" src="/assets/products/Brevlyt_vid.mp4" autoPlay loop muted playsInline preload="metadata" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Eye, title: "Continuous analysis rather than periodic analysis" },
            { icon: Search, title: "Watch, investigate and assist" },
            { icon: TrendingUp, title: "AI analysis + financial expertise + management judgement" },
          ].map(({ icon: Icon, title }) => (
            <div key={title} className="group rounded-[26px] bg-white p-7 shadow-[0_18px_45px_rgba(29,42,72,.055)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(29,42,72,.11)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8eefc] text-[#315fd9] transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-xl font-bold leading-tight tracking-[-0.02em] text-[#17191d]">{title}</h2>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1080px] px-5 pb-20 md:px-8">
        <div className="space-y-7">
          <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_18px_55px_rgba(29,42,72,.05)]">
            <div className="grid gap-0 lg:grid-cols-[.86fr_1.14fr]">
              <div className="relative overflow-hidden bg-[#eef3ff] p-7 md:p-10">
                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#6d8cf5]/18" />
                <div className="relative">
                  <p className="text-xs font-bold tracking-[0.15em] text-[#315fd9] uppercase">The question</p>
                  <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-[-0.03em] text-[#15171a] md:text-4xl">
                    What if your financial data could tell you what needs attention - before you had to go looking for it?
                  </h2>
                  <div className="mt-8 rounded-[22px] bg-white/85 p-5 shadow-[0_12px_30px_rgba(29,42,72,.06)] backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#315fd9]">Management still has to ask</p>
                    <p className="mt-3 text-lg font-bold leading-7 text-[#20242a]">What changed? Why did it change? Is there a problem? What should we do about it?</p>
                  </div>
                </div>
              </div>

              <div className="p-7 md:p-10 lg:p-11">
                <div className={`${bodyClass} max-w-[660px]`}>
                  <p>We're excited to announce that <strong className="text-[#17191d]">ConsultX has partnered with Brevlyt to bring its AI-powered CFO platform to the South African market.</strong></p>
                  <p>For many businesses, there is no shortage of financial data. The problem is turning that data into useful information quickly enough to make better decisions.</p>
                  <p>Management accounts are prepared. Reports are circulated. Spreadsheets are updated. Dashboards are refreshed.</p>
                  <p>But someone still has to look through all of it and ask:</p>
                  <p>In our experience, generic AI interfaces are not enough to answer these questions reliably. General-purpose AI tools often lack the financial context, continuous monitoring and specialised analysis required to identify what matters in a business and explain what action may be needed.</p>
                  <p>Brevlyt is designed to help answer those questions.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
            <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,#3f65d8,#6f8ff6)] p-6 text-white shadow-[0_20px_55px_rgba(63,101,216,.2)] md:p-8">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" />
              <div className="absolute -right-5 top-24 h-20 w-20 rounded-full bg-white/10" />
              <div className="relative">
                <p className="text-xs font-bold tracking-[0.16em] text-white/80 uppercase">Brevlyt</p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em]">Meet Brevlyt: an Autonomous AI CFO</h2>
                <div className="mt-7 overflow-hidden rounded-[22px] border border-white/20 bg-white shadow-[0_16px_38px_rgba(19,42,110,.2)]">
                  <video className="block w-full object-cover" src="/assets/products/Brevlyt_vid.mp4" autoPlay loop muted playsInline preload="metadata" />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-7 shadow-[0_18px_55px_rgba(29,42,72,.05)] md:p-10">
              <div className={`${bodyClass} max-w-[690px]`}>
                <p>Brevlyt describes its platform as an <strong className="text-[#17191d]">Autonomous AI CFO</strong> - a financial intelligence layer that connects to a company's accounting and operational information and continuously analyses what is happening in the business.</p>
                <p>Rather than simply presenting another dashboard, Brevlyt is designed to actively monitor financial and operational data, identify risks and opportunities, investigate what is driving changes, and surface recommendations for management to consider.</p>
                <p>That distinction is important.</p>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#f5f7fb] p-4">
                  <BarChart3 className="h-5 w-5 text-[#315fd9]" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#6b7280]">Traditional reporting</p>
                  <p className="mt-2 font-semibold text-[#20242a]">what happened</p>
                </div>
                <div className="rounded-2xl bg-[#f5f7fb] p-4">
                  <LineChart className="h-5 w-5 text-[#315fd9]" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#6b7280]">Business intelligence</p>
                  <p className="mt-2 font-semibold text-[#20242a]">see what happened</p>
                </div>
                <div className="rounded-2xl bg-[#edf2ff] p-4">
                  <Sparkles className="h-5 w-5 text-[#315fd9]" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#315fd9]">AI CFO</p>
                  <p className="mt-2 font-semibold text-[#20242a]">why it happened, what deserves attention and what you may need to do next.</p>
                </div>
              </div>

              <div className={`${bodyClass} mt-7 max-w-[690px]`}>
                <p>Traditional reporting tells you <strong className="text-[#17191d]">what happened</strong>.</p>
                <p>Business intelligence tools make it easier to <strong className="text-[#17191d]">see what happened</strong>.</p>
                <p>An AI CFO should increasingly be able to help explain <strong className="text-[#17191d]">why it happened, what deserves attention and what you may need to do next.</strong></p>
                <p>That is the opportunity we see with Brevlyt.</p>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[32px] bg-white p-7 shadow-[0_18px_55px_rgba(29,42,72,.05)] md:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[120px] bg-[#edf2ff]" />
            <div className="relative">
              <div className="max-w-[760px]">
                <p className="text-xs font-bold tracking-[0.15em] text-[#315fd9] uppercase">Continuous intelligence</p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-[#15171a] md:text-4xl">From financial reporting to continuous financial intelligence</h2>
              </div>

              <div className={`${bodyClass} mt-7 max-w-[760px]`}>
                <p>Consider some of the questions a CFO, finance manager or business owner deals with every month:</p>
              </div>

              <div className="mt-7 grid gap-3 md:grid-cols-2">
                {[
                  "Why has our gross margin declined?",
                  "Which costs have increased unexpectedly?",
                  "Are collections starting to slow down?",
                  "Where are we missing budget or forecast?",
                  "Is there an emerging cash-flow problem?",
                  "Which customers, products or business units are driving the change?",
                  "What happens to cash if revenue drops by 10%?",
                  "Which anomalies in the accounts deserve investigation?",
                  "What should management focus on this week?",
                ].map((item) => (
                  <div key={item} className="group flex gap-3 rounded-2xl bg-[#f6f8fc] p-4 text-[#303846] transition-all duration-300 hover:-translate-y-1 hover:bg-[#eef3ff] hover:shadow-[0_12px_28px_rgba(29,42,72,.06)]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#315fd9] shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className={`${bodyClass} mt-8 max-w-[760px]`}>
                <p>These are often answered through a combination of spreadsheets, reports, meetings and manual investigation.</p>
                <p>Brevlyt is being built around a different model: <strong className="text-[#17191d]">continuous analysis rather than periodic analysis</strong>.</p>
                <p>The platform can monitor areas such as cash and runway, margins, costs, collections, variances, anomalies, forecasts and other important business indicators. When something significant changes, Brevlyt can investigate the underlying drivers and bring that information to the user instead of waiting for someone to find it.</p>
                <p>For finance teams, that has the potential to change where their time is spent.</p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-[#e4e8f2] bg-[#fbfcff] p-5">
                  <Activity className="h-5 w-5 text-[#315fd9]" />
                  <p className="mt-3 font-semibold text-[#20242a]">Less time gathering, reconciling and explaining information.</p>
                </div>
                <div className="rounded-[22px] bg-[#315fd9] p-5 text-white shadow-[0_16px_34px_rgba(49,95,217,.2)]">
                  <TrendingUp className="h-5 w-5" />
                  <p className="mt-3 font-semibold">More time evaluating options and making decisions.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[32px] bg-[#101827] p-7 text-white shadow-[0_18px_55px_rgba(15,24,39,.16)] md:p-10">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute right-14 top-10 h-20 w-20 rounded-full bg-[#4c6fe7]/20 blur-xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#91a9ff] uppercase">Security and control</p>
                <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">But security!? I'm not sharing my financial data with an unknown AI.</h2>
                <div className="mt-7 space-y-5 text-[17px] leading-8 text-white/76">
                  <p>That concern is completely understandable. Financial information is sensitive, and businesses should be careful about which systems they connect to their accounts and operational data.</p>
                  <p>Brevlyt is designed around a secure, permission-based architecture. It connects to approved business systems through controlled integrations, rather than requiring users to manually upload sensitive files to an unknown public AI tool. Access is limited to the information and permissions required for the analysis, and the platform is designed to keep business data separate from the underlying AI models used to interpret it.</p>
                  <p>In practical terms, Brevlyt is not a chatbot that takes your financial information and makes it available for general AI training. It operates as a dedicated financial intelligence layer for your business, using your authorised data to identify trends, investigate variances and generate insights within your business context.</p>
                  <p>The platform is also designed with human oversight in mind. Brevlyt can surface findings and recommendations, but management remains responsible for deciding what action to take. It does not independently move money, change accounting records or make financial decisions on the company's behalf.</p>
                  <p>As with any technology connected to financial systems, security should be evaluated properly before implementation. Businesses should confirm the relevant access controls, data-handling practices, hosting arrangements, retention policies and integration permissions as part of their onboarding process.</p>
                  <p>The important point is that adopting an AI CFO should not mean handing your financial data to an uncontrolled black-box tool.</p>
                  <p>It should mean connecting approved business information to a purpose-built system, with appropriate controls, clear permissions and people still firmly in charge.</p>
                </div>
              </div>

              <div className="grid content-start gap-4 lg:pt-16">
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                  <ShieldCheck className="h-6 w-6 text-[#91a9ff]" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-white/55">Architecture</p>
                  <p className="mt-2 font-semibold text-white">secure, permission-based architecture</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                  <LockKeyhole className="h-6 w-6 text-[#91a9ff]" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-white/55">Connections</p>
                  <p className="mt-2 font-semibold text-white">controlled integrations</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                  <UserCheck className="h-6 w-6 text-[#91a9ff]" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-white/55">Decision making</p>
                  <p className="mt-2 font-semibold text-white">people still firmly in charge</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_18px_55px_rgba(29,42,72,.05)] md:p-10">
              <div className="absolute right-5 top-5 h-14 w-14 rounded-2xl bg-[#edf2ff]" />
              <div className="relative">
                <h2 className="max-w-[520px] text-3xl font-extrabold tracking-[-0.03em] text-[#15171a]">You don't always need to know what question to ask</h2>
                <div className="mt-6 rounded-[22px] bg-[#f7f9fd] p-5">
                  <p className="text-sm font-semibold text-[#687180]">Most AI tools today are reactive.</p>
                  <p className="mt-2 text-lg font-bold text-[#20242a]">You open a chatbot and ask a question.</p>
                </div>
                <div className={`${bodyClass} mt-6 max-w-[560px]`}>
                  <p>This is also where we believe the next generation of business AI becomes particularly interesting.</p>
                  <p>But what happens when you don't know that there is a question you should be asking?</p>
                  <p>Brevlyt is <strong className="text-[#17191d]">designed to continuously monitor the signals that matter</strong> to the business and identify changes that may require attention. According to Brevlyt, the system can then investigate those changes and surface the context and recommended actions, while keeping people in control of decisions requiring human approval.</p>
                  <p>This moves AI from being simply a tool you <strong className="text-[#17191d]">ask</strong> to becoming a system that can increasingly <strong className="text-[#17191d]">watch, investigate and assist</strong>.</p>
                  <p>For us, that is a significant evolution.</p>
                </div>
                <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#edf2ff] px-4 py-2 text-sm font-semibold text-[#315fd9]">
                  <Sparkles className="h-4 w-4" />
                  watch, investigate and assist
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_18px_55px_rgba(29,42,72,.05)] md:p-10">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#edf2ff]" />
              <div className="relative">
                <h2 className="max-w-[540px] text-3xl font-extrabold tracking-[-0.03em] text-[#15171a]">Why we believe this matters for South African businesses</h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["cash flow", "margins", "working capital", "costs", "forecasts", "operational performance"].map((item) => (
                    <span key={item} className="rounded-full border border-[#e1e6f0] bg-[#fafbfe] px-3 py-1.5 text-sm font-medium text-[#566071]">{item}</span>
                  ))}
                </div>
                <div className={`${bodyClass} mt-6 max-w-[560px]`}>
                  <p>Many South African businesses face a familiar challenge.</p>
                  <p>They need better financial insight, but building a larger finance team isn't always economically practical.</p>
                  <p>At the same time, the complexity of running a business continues to increase.</p>
                  <p>Management needs better information on cash flow, margins, working capital, costs, forecasts and operational performance - and they need it faster.</p>
                  <p>AI creates the possibility of giving smaller and mid-sized businesses access to analytical capabilities that historically required substantial finance teams, sophisticated BI infrastructure or significant consulting support.</p>
                  <p>Brevlyt's proposition is specifically focused on bringing that type of financial intelligence to growing businesses. The platform is designed to connect to accounting software, ERPs and other business systems and combine the information required for financial analysis.</p>
                  <p>We believe that can be particularly powerful when combined with strong financial management processes and experienced human judgement.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[32px] bg-white p-7 shadow-[0_18px_55px_rgba(29,42,72,.05)] md:p-10">
            <div className="absolute right-[-70px] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#edf2ff]" />
            <div className="relative grid gap-9 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <h2 className="max-w-3xl text-3xl font-extrabold tracking-[-0.03em] text-[#15171a] md:text-4xl">AI doesn't remove the CFO. It changes what the CFO can do.</h2>
                <div className={`${bodyClass} mt-7 max-w-[660px]`}>
                  <p>We don't see AI CFO technology as simply replacing finance professionals.</p>
                  <p>The bigger opportunity is <strong className="text-[#17191d]">leverage</strong>.</p>
                  <p>A CFO who spends hours gathering information can instead spend that time making decisions.</p>
                  <p>A finance manager who manually investigates every variance can focus on the exceptions that matter.</p>
                  <p>A business owner who previously received management accounts once a month can potentially have much more continuous visibility over the financial health of the business.</p>
                  <p>And an organisation without a full-time CFO can gain access to a level of monitoring and analytical capability that may previously have been difficult to justify.</p>
                  <p>Human judgement remains essential.</p>
                  <p>AI can identify an unexpected movement in margin.</p>
                  <p>Management still decides whether the response should be a price increase, supplier negotiation, operational change or no action at all.</p>
                  <p>The combination of <strong className="text-[#17191d]">AI analysis + financial expertise + management judgement</strong> is where we believe much of the value will be created.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-[#cfd9fb] bg-white shadow-[0_24px_55px_rgba(29,42,72,.08)]">
                  <div className="absolute inset-5 rounded-full border border-dashed border-[#b8c7f8]" />
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#315fd9]">The opportunity</p>
                    <p className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#15171a]">leverage</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#eef3ff,#ffffff)] p-7 shadow-[0_18px_55px_rgba(29,42,72,.05)] md:p-10">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#315fd9] uppercase">ConsultX + Brevlyt</p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-[#15171a] md:text-4xl">The ConsultX + Brevlyt partnership</h2>
              </div>
              <div className={`${bodyClass} max-w-[700px]`}>
                <p>Our role at ConsultX will be to help introduce Brevlyt to the South African market and, importantly, help businesses translate the technology into practical financial outcomes.</p>
                <p>That means looking beyond simply installing another piece of software.</p>
                <p>We want to help organisations identify the financial questions that matter, connect the relevant information, define the metrics and business context Brevlyt should understand, and determine how AI-generated insights can fit into management's existing decision-making processes.</p>
                <p>The objective is straightforward:</p>
                <p><strong className="text-[#17191d]">Turn more of the financial data businesses already have into useful, timely and actionable intelligence.</strong></p>
                <p>And do it without adding another layer of reporting administration.</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {["identify", "connect", "define", "determine"].map((item, index) => (
                <div key={item} className="rounded-[18px] bg-white p-4 shadow-[0_10px_24px_rgba(29,42,72,.05)]">
                  <span className="text-xs font-bold text-[#315fd9]">0{index + 1}</span>
                  <p className="mt-2 font-semibold capitalize text-[#20242a]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#eaf0ff,#f8faff)] p-8 shadow-[0_18px_55px_rgba(29,42,72,.06)] md:p-11">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#6d8cf5]/16" />
            <div className="absolute bottom-[-120px] right-[20%] h-56 w-56 rounded-full bg-[#4c6fe7]/8" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="max-w-4xl text-3xl font-extrabold tracking-[-0.03em] text-[#15171a] md:text-4xl">Want to see what an AI CFO could identify in your business?</h2>
                <div className="mt-6 max-w-[780px] space-y-4 text-[17px] leading-8 text-[#5a6270]">
                  <p>We are currently speaking to South African businesses interested in exploring how autonomous financial intelligence could be applied within their finance function.</p>
                  <p>If you're a <strong className="text-[#17191d]">business owner, CFO, Finance Director or Finance Manager</strong> and you'd like to see what Brevlyt could do with your financial information, we'd be happy to take you through it.</p>
                  <p><strong className="text-[#17191d]">Contact ConsultX to arrange a demonstration of Brevlyt and explore how an AI CFO could work within your business.</strong></p>
                  <p>The future of finance won't just be about producing reports faster.</p>
                  <p>It will be about building finance functions that <strong className="text-[#17191d]">continuously monitor, investigate, explain and help management act.</strong></p>
                  <p>And that future is arriving quickly.</p>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["monitor", "investigate", "explain", "help management act"].map((item) => (
                    <span key={item} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#315fd9] shadow-sm">{item}</span>
                  ))}
                </div>
              </div>
              <Link href="/contact/" className="inline-flex justify-center rounded-full bg-[linear-gradient(135deg,#3f66dc,#6d8cf5)] px-8 py-4 font-semibold text-white shadow-[0_14px_30px_rgba(66,98,220,.22)] transition hover:-translate-y-0.5">
                Arrange a demo
              </Link>
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}
