export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
};

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "ai-supported-automation-falling-behind",
    title: "If You’re Not Implementing AI-Supported Automation, You’re Falling Behind",
    excerpt:
      "AI is here to stay. Concerns about proof, cost and security are being solved in real deployments — and South African finance teams that wait will feel the gap.",
    date: "2026-08-10",
    readTime: "7 min read",
    coverImage: "/blog/ai-supported-automation-falling-behind/cover.png",
    coverAlt: "Modern finance workspace with green workflow dashboards on a laptop",
    tags: ["AI", "Automation", "Finance"],
  },
  {
    slug: "why-expense-automation-pays-for-itself",
    title: "Why Expense Automation Pays for Itself",
    excerpt:
      "How AI extraction, validation and accounting-aware workflows free finance teams from repetitive capture work — and why the ROI can appear surprisingly quickly.",
    date: "2026-08-08",
    readTime: "12 min read",
    coverImage: "/blog/why-expense-automation-pays-for-itself/cover.webp",
    coverAlt: "Invoices and receipts transforming into organised digital finance data",
    tags: ["AnNa Expense", "Automation", "Finance"],
  },
  {
    slug: "xbrl-without-the-headache",
    title: "XBRL without the headache",
    excerpt: "A practical path to cleaner statutory reporting and fewer filing surprises.",
    date: "2026-07-15",
    readTime: "Coming soon",
    coverImage: "",
    coverAlt: "",
    tags: ["XBRL", "Compliance"],
  },
  {
    slug: "process-first-tech-second",
    title: "Process first, tech second",
    excerpt: "The ConsultX approach to automation that actually sticks in SME finance teams.",
    date: "2026-06-20",
    readTime: "Coming soon",
    coverImage: "",
    coverAlt: "",
    tags: ["Process", "Consulting"],
  },
];

export function getPublishedPosts() {
  return blogPosts.filter((post) => post.coverImage);
}

export function getAllBlogSlugs() {
  return getPublishedPosts().map((post) => post.slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
