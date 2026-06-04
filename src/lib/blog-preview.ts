const HTML_TAG_PATTERN = /<[^>]*>/g;
const HTML_ENTITY_PATTERN = /&(?:nbsp|amp|lt|gt|quot|#39);/g;

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": "\"",
  "&#39;": "'",
};

function textFromHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|h[1-6]|li|td|th)>/gi, " ")
    .replace(HTML_TAG_PATTERN, "")
    .replace(HTML_ENTITY_PATTERN, (entity) => HTML_ENTITIES[entity] ?? entity);
}

export function getBlogPreviewText(excerpt: string | undefined, content: string | undefined, maxLength = 180) {
  const source = (excerpt?.trim() || textFromHtml(content ?? "")).replace(/\s+/g, " ").trim();

  if (source.length <= maxLength) {
    return source;
  }

  return `${source.slice(0, maxLength).trimEnd()}...`;
}

export function getBlogDisplayTitle(title: string | undefined, slug: string | undefined, content: string | undefined) {
  const trimmedTitle = title?.trim();
  if (trimmedTitle) {
    return trimmedTitle;
  }

  const headingMatch = content?.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const headingText = headingMatch ? textFromHtml(headingMatch[1]).replace(/\s+/g, " ").trim() : "";
  if (headingText) {
    return headingText;
  }

  return slug
    ?.replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Untitled post";
}
