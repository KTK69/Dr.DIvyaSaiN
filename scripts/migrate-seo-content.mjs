import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDirectory =
  process.env.SITE_CONTENT_DATA_DIR?.trim() ||
  path.join(process.cwd(), "data");
const contentPath = path.join(dataDirectory, "site-content.runtime.json");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = path.join(
  dataDirectory,
  `site-content.runtime.before-seo-migration.${timestamp}.json`,
);

const brand = "Dr. Divya Sai Narsingam";

function cleanText(value) {
  return typeof value === "string"
    ? value
        .replace(/\r?\n/g, " ")
        .replace(/\s+/g, " ")
        .replace(/Hyderabad\.\s*and/gi, "Hyderabad and")
        .replace(/\.\s*,/g, ",")
        .trim()
    : value;
}

function cleanTitle(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "")
    .replace(/\s*\|\s*/g, " | ")
    .replace(/\s*\|\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s|–—-]+|[\s|–—-]+$/g, "")
    .trim();
}

function demoteBodyHeadings(html) {
  if (typeof html !== "string") {
    return html;
  }

  return html.replace(/<h1\b/gi, "<h2").replace(/<\/h1>/gi, "</h2>");
}

const raw = JSON.parse(await readFile(contentPath, "utf8"));
const content = raw.content || raw;

await copyFile(contentPath, backupPath);

if (content.siteSeo) {
  content.siteSeo.description = cleanText(
    content.siteSeo.description?.replace(/board-certified\s+/gi, ""),
  );
}

for (const page of Object.values(content.pageSeo || {})) {
  if (page && typeof page === "object") {
    page.title = cleanTitle(page.title);
    page.description = cleanText(page.description);
  }
}

if (content.about) {
  content.about.summary = cleanText(
    content.about.summary?.replace(/board-certified\s+/gi, ""),
  );
  content.about.bio = cleanText(
    content.about.bio?.replace(/board-certified\s+/gi, ""),
  );
  content.about.meta_title = cleanTitle(content.about.meta_title);
  content.about.meta_description = cleanText(content.about.meta_description);
}

if (content.home?.hero) {
  content.home.hero.summary = cleanText(
    content.home.hero.summary?.replace(/board-certified\s+/gi, ""),
  );
}

for (const blog of content.blog || []) {
  if (!blog || typeof blog !== "object") {
    continue;
  }

  blog.meta_title = cleanTitle(blog.meta_title);
  blog.meta_description = cleanText(blog.meta_description);
  blog.content = demoteBodyHeadings(blog.content);

  if (blog.id === "blog-1783155145253") {
    blog.slug = "hernia-repair-with-tummy-tuck";
  }
}

for (const service of content.services || []) {
  if (!service || typeof service !== "object") {
    continue;
  }

  service.meta_title = cleanTitle(service.meta_title);
  service.meta_description = cleanText(service.meta_description);
}

if (raw.content) {
  raw.content = content;
  raw.updatedAt = new Date().toISOString();
}

await writeFile(contentPath, `${JSON.stringify(raw, null, 2)}\n`, "utf8");

console.log(`Backed up CMS data to ${backupPath}`);
console.log(`Migrated SEO content in ${contentPath}`);
