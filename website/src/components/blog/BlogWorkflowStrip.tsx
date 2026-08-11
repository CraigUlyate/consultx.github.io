const steps = ["Upload", "Process", "Validate", "Review", "Export"];

export function BlogWorkflowStrip() {
  return (
    <div className="my-12 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#111111_0%,#343638_55%,#1a2e0f_100%)] px-5 py-7 sm:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-consultx-green uppercase">
        AnNa Expense workflow
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3 text-sm font-semibold text-white sm:text-base">
        {steps.map((step, index) => (
          <span key={step} className="inline-flex items-center gap-2">
            <span className="rounded-md bg-white/10 px-3 py-2 backdrop-blur-sm">{step}</span>
            {index < steps.length - 1 ? (
              <span className="text-consultx-green" aria-hidden>
                →
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
