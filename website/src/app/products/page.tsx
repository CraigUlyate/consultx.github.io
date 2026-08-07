import type { Metadata } from "next";
import { ProductShowcase } from "@/components/products/ProductShowcase";
import { ConsultationBanner } from "@/components/ConsultationBanner";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore ConsultX products including AnNa Expense, Iris Carbon XBRL, CIPC Compliance, financial modelling and AI finance tools.",
};

export default function ProductsPage() {
  return (
    <>
      <ProductShowcase />
      <div className="px-5 pb-8 md:px-8">
        <ConsultationBanner />
      </div>
    </>
  );
}
