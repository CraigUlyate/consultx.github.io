export type ProductWorkflowStep = {
  title: string;
  description: string;
  tone: "teal" | "green" | "blue";
  icon: "upload" | "process" | "review" | "output" | "search" | "report" | "automate";
};

export type Product = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  status: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  workflowTitle: string;
  workflow: ProductWorkflowStep[];
};
