import { jobStatusLabel, type JobStatus } from "@/lib/platform";

const statusStyles: Record<JobStatus, string> = {
  information_required: "bg-amber-100 text-amber-800",
  under_review: "bg-blue-100 text-blue-800",
  awaiting_authorisation: "bg-violet-100 text-violet-800",
  awaiting_payment: "bg-orange-100 text-orange-800",
  ready_to_file: "bg-emerald-100 text-emerald-800",
  completed: "bg-consultx-green-soft text-consultx-green-dark",
};

export function StatusBadge({ status }: Readonly<{ status: JobStatus }>) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[status]}`}>{jobStatusLabel[status]}</span>;
}
