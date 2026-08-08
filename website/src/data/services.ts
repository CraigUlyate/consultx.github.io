export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  ctaLabel: string;
  order: number;
};

export const services: Service[] = [
  {
    slug: "financial-management",
    title: "Financial Management",
    shortDescription:
      "Build reliable finance foundations — controls, reporting, cash visibility and performance tracking.",
    seoTitle: "Financial Management",
    seoDescription:
      "ConsultX financial management services for clearer reporting, stronger controls and decision-ready finance operations.",
    ctaLabel: "Discuss financial management",
    order: 1,
  },
  {
    slug: "process-reengineering",
    title: "Process Re-engineering",
    shortDescription:
      "Redesign finance and operational workflows to remove friction, improve speed and create cleaner handovers.",
    seoTitle: "Process Re-engineering",
    seoDescription:
      "ConsultX process re-engineering for finance and operations — streamline workflows, reduce waste and improve control.",
    ctaLabel: "Improve your processes",
    order: 2,
  },
  {
    slug: "business-consulting",
    title: "Business Consulting",
    shortDescription:
      "Practical commercial guidance for growth, investment decisions, restructuring and operational improvement.",
    seoTitle: "Business Consulting",
    seoDescription:
      "ConsultX business consulting for strategy, commercial analysis and practical execution support.",
    ctaLabel: "Book a consulting session",
    order: 3,
  },
  {
    slug: "business-valuations",
    title: "Business Valuations",
    shortDescription:
      "Independent, professionally prepared valuations for transactions, reporting, litigation and strategic decisions.",
    seoTitle: "Business Valuations",
    seoDescription:
      "Independent business valuations from ConsultX for transactions, reporting, shareholder matters and strategic planning.",
    ctaLabel: "Request a valuation discussion",
    order: 4,
  },
  {
    slug: "outsourced-cfo",
    title: "Outsourced CFO",
    shortDescription:
      "Senior finance leadership without a full-time hire — reporting, cash, board packs and decision support.",
    seoTitle: "Outsourced CFO",
    seoDescription:
      "Outsourced CFO support from ConsultX for growing businesses that need senior finance leadership on a flexible basis.",
    ctaLabel: "Talk about Outsourced CFO",
    order: 5,
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getAllServiceSlugs() {
  return services.map((service) => service.slug);
}
