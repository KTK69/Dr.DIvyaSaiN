import type { Blog } from "@/types/content";

/** Parse common date formats used in admin (ISO, DD/MM/YYYY, DD-MM-YYYY). */
export function parseBlogPublishedAt(value?: string): number {
  const raw = (value ?? "").trim();
  if (!raw) {
    return 0;
  }

  const iso = Date.parse(raw);
  if (!Number.isNaN(iso)) {
    return iso;
  }

  const slashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    const parsed = Date.parse(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return 0;
}

export function sortBlogsByPublishedDate(
  items: Blog[],
  direction: "asc" | "desc",
): Blog[] {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...items].sort((first, second) => {
    const firstTime = parseBlogPublishedAt(first.published_at);
    const secondTime = parseBlogPublishedAt(second.published_at);

    if (firstTime !== secondTime) {
      return (firstTime - secondTime) * multiplier;
    }

    const titleCompare = first.title.localeCompare(second.title, undefined, {
      sensitivity: "base",
    });
    if (titleCompare !== 0) {
      return titleCompare * multiplier;
    }

    return first.id.localeCompare(second.id) * multiplier;
  });
}

export function blogOrderSignature(items: Blog[]): string {
  return items.map((item) => item.id).join("\u0001");
}

export function hasBlogOrderChanged(before: Blog[], after: Blog[]): boolean {
  return blogOrderSignature(before) !== blogOrderSignature(after);
}
