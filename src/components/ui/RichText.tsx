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

export default function RichText({ value, className = "" }: RichTextProps) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (hasHtmlTags(trimmed)) {
    return (
      <div
        className={`rich-text ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: trimmed }}
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
