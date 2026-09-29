import { businessAddress } from "@/data/business";

export function BusinessAddress({ directions = false }: { directions?: boolean }) {
  if (!businessAddress) return null;
  return (
    <div className="space-y-2 text-sm leading-6">
      <address className="not-italic">{businessAddress.lines.map((line) => <div key={line}>{line}</div>)}</address>
      {businessAddress.visitsByAppointment && <p>Visits by appointment.</p>}
      {directions && <a className="inline-block font-semibold text-consultx-green hover:underline" href={businessAddress.mapUrl} target="_blank" rel="noreferrer">Get directions →</a>}
    </div>
  );
}
