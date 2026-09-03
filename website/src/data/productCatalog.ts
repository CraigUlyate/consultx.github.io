import type { Product } from "@/lib/types";
import { products as existingProducts } from "@/data/products";

const brevlyt: Product = {
  id: "brevlyt",
  name: "Brevlyt AI CFO",
  shortName: "Brevlyt",
  category: "Autonomous Financial Intelligence",
  status: "ConsultX Partner Product",
  description:
    "Always-on AI CFO intelligence that monitors financial and operational data, investigates changes and helps management focus on what matters next.",
  features: [
    "Continuous Financial Monitoring",
    "Variance & Anomaly Investigation",
    "Forecasting & Scenario Analysis",
    "Recommended Next Actions",
    "Business Context",
    "Human Oversight",
  ],
  cta: "Explore Brevlyt",
  href: "/products/brevlyt/",
  workflowTitle: "How Brevlyt Works",
  workflow: [
    {
      title: "Connect",
      description: "Connect approved accounting, ERP and operational data sources.",
      tone: "teal",
      icon: "upload",
    },
    {
      title: "Monitor",
      description: "Continuously watch the financial and operational signals that matter.",
      tone: "green",
      icon: "search",
    },
    {
      title: "Investigate",
      description: "Look beyond a change to understand what may be driving it.",
      tone: "teal",
      icon: "process",
    },
    {
      title: "Act",
      description: "Surface context, recommendations and follow-ups for management review.",
      tone: "blue",
      icon: "report",
    },
  ],
};

export const products: Product[] = [brevlyt, ...existingProducts];
