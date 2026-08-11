import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAllBlogSlugs } from "@/data/blog";

const contentDir = path.join(process.cwd(), "content", "blog");

export function getBlogMarkdown(slug: string) {
  const filePath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing blog content: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);
  return content.trim();
}

export function assertAllBlogContentExists() {
  for (const slug of getAllBlogSlugs()) {
    getBlogMarkdown(slug);
  }
}
