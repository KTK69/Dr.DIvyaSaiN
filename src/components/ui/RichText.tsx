"use client";

import { Fragment } from "react";

type RichTextProps = {
  value?: string | null;
  className?: string;
};

function hasHtmlTags(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function normalizeRenderText(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function countRenderWords(value: string) {
  const normalized = normalizeRenderText(value);
  return normalized ? normalized.split(/\s+/).length : 0;
}

function isRenderMarkerCell(value: string) {
  return /^[-*•]+(?:\s+[-*•]+)*$/.test(normalizeRenderText(value));
}

function flattenRenderTable(table: HTMLTableElement) {
  const fragment = document.createDocumentFragment();

  for (const row of Array.from(table.rows)) {
    const parts = Array.from(row.cells)
      .map((cell) => cell.innerHTML.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      continue;
    }

    const paragraph = document.createElement("p");
    paragraph.innerHTML = parts.join(" ");
    fragment.appendChild(paragraph);
  }

  if (!fragment.childNodes.length) {
    const text = normalizeRenderText(table.textContent ?? "");
    if (text) {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      fragment.appendChild(paragraph);
    }
  }

  return fragment;
}

function shouldFlattenRenderTable(table: HTMLTableElement) {
  if (table.classList.contains("docx-table")) {
    return true;
  }

  const cells = Array.from(table.querySelectorAll("td, th")).map((cell) =>
    normalizeRenderText(cell.textContent ?? "")
  );

  const longCells = cells.filter((cell) => countRenderWords(cell) >= 10).length;
  const markerCells = cells.filter((cell) => isRenderMarkerCell(cell)).length;

  return longCells >= 2 || markerCells > 0;
}

function normalizeRichTextHtml(value: string) {
  if (typeof window === "undefined" || !value.trim()) {
    return value;
  }

  const parser = new DOMParser();
  const documentValue = parser.parseFromString(`<div id="rich-text-root">${value}</div>`, "text/html");
  const root = documentValue.getElementById("rich-text-root");

  if (!root) {
    return value;
  }

  for (const table of Array.from(root.querySelectorAll("table"))) {
    if (shouldFlattenRenderTable(table)) {
      table.replaceWith(flattenRenderTable(table));
    }
  }

  return root.innerHTML;
}

export default function RichText({ value, className = "" }: RichTextProps) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (hasHtmlTags(trimmed)) {
    const normalizedHtml = normalizeRichTextHtml(trimmed);
    return (
      <div
        className={`rich-text ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: normalizedHtml }}
      />
    );
  }

  const paragraphs = splitParagraphs(trimmed);

  return (
    <div className={`rich-text ${className}`.trim()}>
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split(/\n/);
        return (
          <p key={`${paragraphIndex}-${paragraph.slice(0, 16)}`}>
            {lines.map((line, lineIndex) => (
              <Fragment key={`${paragraphIndex}-${lineIndex}`}>
                {line}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
