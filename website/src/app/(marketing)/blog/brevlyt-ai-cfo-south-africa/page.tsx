import type { Metadata } from "next";
import { BrevlytArticleClean } from "@/components/blog/BrevlytArticleClean";

export const metadata: Metadata = {
  title: "ConsultX Partners with Brevlyt to Bring Autonomous CFO AI to South Africa",
  description:
    "ConsultX has partnered with Brevlyt to bring AI-powered CFO intelligence to South African businesses.",
};

export default function BrevlytBlogPage() {
  return <BrevlytArticleClean />;
}
