import Image from "next/image";
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

const productLogos: Record<string, string> = {
  "anna-expense": "/assets/products/anna-expense.png",
  "iris-carbon-xbrl": "/assets/products/iris-carbon-logo.png",
  fastleads: "/assets/products/fastleads.png",
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
  const logo = productLogos[product.id];
  const dim = size === "sm" ? "h-14 w-14" : "h-20 w-20";
  const iconDim = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const logoDim = size === "sm" ? "h-9 w-9" : "h-12 w-12";

  return (
    <span
      className={`flex ${dim} items-center justify-center overflow-hidden rounded-full bg-white transition ${
        active
          ? "border-2 border-consultx-green shadow-active ring-4 ring-consultx-green/10"
          : "border border-consultx-border shadow-soft"
      }`}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={96}
          height={96}
          className={`${logoDim} object-contain`}
        />
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
