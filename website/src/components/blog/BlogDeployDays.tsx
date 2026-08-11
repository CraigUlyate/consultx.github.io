const days = [
  {
    day: "Day 1",
    title: "Understand the process",
    text: "Review sample documents, required fields, client rules and desired output.",
  },
  {
    day: "Day 2",
    title: "Configure the workflow",
    text: "Configure extraction requirements, accounting rules, validations and templates.",
  },
  {
    day: "Day 3",
    title: "Test and deploy",
    text: "Process actual documents, review exceptions, confirm output and train users.",
  },
];

export function BlogDeployDays() {
  return (
    <div className="my-12 grid gap-5 sm:grid-cols-3">
      {days.map((item, index) => (
        <div
          key={item.day}
          className="relative border-t-2 border-consultx-green pt-5"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-consultx-green uppercase">
            {item.day}
          </p>
          <h3 className="mt-2 text-lg font-bold text-consultx-black">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
