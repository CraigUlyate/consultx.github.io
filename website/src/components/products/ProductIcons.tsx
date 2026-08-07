import {
  Building2,
  Calculator,
  Check,
  Download,
  FileSpreadsheet,
  Scale,
  Search,
  Settings2,
  Sparkles,
  Upload,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { Product } from "@/lib/types";

const productIcons: Record<string, LucideIcon> = {
  "anna-expense": FileSpreadsheet,
  "iris-carbon-xbrl": FileSpreadsheet,
  "cipc-compliance": Building2,
  "financial-modelling": Calculator,
  "business-valuations": Scale,
  "pivot-analysis": Search,
  fastleads: Search,
  "workflow-automation": Workflow,
  "ai-finance-tools": Sparkles,
};

const stepIcons: Record<string, LucideIcon> = {
  upload: Upload,
  process: Settings2,
  review: Check,
  output: Download,
  search: Search,
  report: FileSpreadsheet,
  automate: Workflow,
};

const toneClass: Record<string, string> = {
  teal: "bg-consultx-teal",
  green: "bg-consultx-green-dark",
  blue: "bg-consultx-blue",
};

export function ProductIcon({
  product,
  active = false,
  size = "md",
}: {
  product: Product;
  active?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = productIcons[product.id] ?? Sparkles;
  const dim =
    size === "lg" ? "h-20 w-20" : size === "sm" ? "h-14 w-14" : "h-20 w-20";
  const iconDim = size === "lg" ? "h-9 w-9" : size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <span
      className={`flex ${dim} items-center justify-center rounded-full bg-white transition ${
        active
          ? "border-2 border-consultx-green shadow-active ring-4 ring-consultx-green/10"
          : "border border-consultx-border shadow-soft"
      }`}
    >
      {product.id === "anna-expense" ? (
        <span className={`font-black tracking-tight ${active ? "text-[#11A9E5]" : "text-consultx-charcoal"}`}>
          A
        </span>
      ) : (
        <Icon className={`${iconDim} ${active ? "text-consultx-green-dark" : "text-consultx-charcoal"}`} />
      )}
    </span>
  );
}

export function WorkflowIcon({
  icon,
  tone,
}: {
  icon: string;
  tone: "teal" | "green" | "blue";
}) {
  const Icon = stepIcons[icon] ?? Check;
  return (
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${toneClass[tone]}`}>
      <Icon className="h-5 w-5" />
    </span>
  );
}
