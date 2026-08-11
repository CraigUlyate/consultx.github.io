export type WorkflowSolution = {
  id: string;
  title: string;
  summary: string;
  outcomes: string[];
};

export const workflowSolutions: WorkflowSolution[] = [
  {
    id: "ap-extraction",
    title: "AI-augmented Accounts Payable extraction",
    summary:
      "Automate invoice and supporting-document capture for AP teams — from extraction through validation to ERP-ready posting.",
    outcomes: [
      "AI extraction of supplier, line items, VAT and coding suggestions",
      "Error and exception detection before posting",
      "Cleaner ERP capture with fewer manual keying steps",
      "Faster AP cycles with stronger control over duplicates and mismatches",
    ],
  },
  {
    id: "tender-mining",
    title: "AI-supported tender mining & lead generation",
    summary:
      "Find, qualify and prepare tender and business-development opportunities with AI-assisted research and drafting support.",
    outcomes: [
      "Mine and monitor relevant tender and opportunity sources",
      "Qualify leads against capability, margin and strategic fit",
      "Accelerate bid / proposal preparation with structured AI support",
      "Improve conversion focus by prioritising winnable work",
    ],
  },
  {
    id: "budgeting-forecasting",
    title: "Automated budgeting & forecasting",
    summary:
      "Combine business structure, operating knowledge and financial history to automate revenue and cost budgets with clearer forecast cycles.",
    outcomes: [
      "Budget models grounded in real organisational structure",
      "Automation of revenue and cost budget build and refresh",
      "Faster scenario updates for leadership and board packs",
      "Less spreadsheet friction between finance and business owners",
    ],
  },
  {
    id: "governance-reporting",
    title: "Automated governance & IFRS reporting",
    summary:
      "Automate critical governance reporting packs with IFRS-aligned workflows across high-risk balance-sheet and revenue areas.",
    outcomes: [
      "Revenue and contracts reporting support",
      "Insurance, assets and inventory control packs",
      "Lease accounting and compliance workflows",
      "Repeatable reporting cadence for boards, audit and management",
    ],
  },
  {
    id: "workforce-digitisation",
    title: "Workforce digitisation",
    summary:
      "Digitise recurring operational and finance workflows so teams spend less time on admin and more time on decisions and delivery.",
    outcomes: [
      "Replace manual handovers with structured digital workflows",
      "Standardise approvals, checklists and task ownership",
      "Improve visibility of work-in-progress across teams",
      "Create a foundation for further automation and AI assist",
    ],
  },
];
