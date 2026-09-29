import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/data/blog";
import { services } from "@/data/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about/", "/services/", "/products/", "/products/ai-finance-tools/", "/products/brevlyt/", "/products/workflow-automation/", "/blog/", "/contact/", "/faqs/",
    ...services.map((service) => `/services/${service.slug}/`),
    ...getPublishedPosts().map((post) => `/blog/${post.slug}/`),
  ];
  return paths.map((path) => ({ url: `https://consultx.co.za${path}` }));
}
