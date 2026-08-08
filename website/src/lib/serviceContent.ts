import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAllServiceSlugs } from "@/data/services";

const contentDir = path.join(process.cwd(), "content", "services");

export function getServiceMarkdown(slug: string) {
  const filePath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing service content: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);
  return content.trim();
}

export function assertAllServiceContentExists() {
  for (const slug of getAllServiceSlugs()) {
    getServiceMarkdown(slug);
  }
}
