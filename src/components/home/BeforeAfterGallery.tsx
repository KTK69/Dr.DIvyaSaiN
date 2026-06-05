"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function BeforeAfterGallery() {
  const { content } = useSiteContent();
  const gallery = content.home.beforeAfterGallery;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedProcedure = selectedIndex === null ? null : gallery.procedures[selectedIndex] ?? null;

  useEffect(() => {
    if (!selectedProcedure) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProcedure]);

  return (
    <section className="section-padding" aria-label="Before and after gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={gallery.eyebrow}
          title={gallery.title}
          subtitle={gallery.subtitle}
        />
        <p className="mt-3 max-w-3xl text-sm text-(--foreground-muted)">
          {gallery.description}
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.procedures.map((procedure, index) => (
            <button
              key={`${procedure.procedureName}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group text-left"
              aria-label={`Open ${procedure.procedureName}`}
            >
              <GalleryPreview procedure={procedure} />
            </button>
          ))}
        </div>
      </div>

      {selectedProcedure ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Before and after gallery preview"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-(--background) shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-(--border) px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-(--accent-gold)">
                  Before and after
                </p>
                <h3 className="mt-2 text-2xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
                  {selectedProcedure.procedureName}
                </h3>
                <p className="mt-2 max-w-3xl text-sm text-(--foreground-muted)">
                  {selectedProcedure.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="rounded-full border border-(--border) px-4 py-2 text-sm text-(--foreground-muted) transition-colors hover:text-(--foreground)"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <GalleryImageCard image={selectedProcedure.before.front} />
              <GalleryImageCard image={selectedProcedure.before.back} />
              <GalleryImageCard image={selectedProcedure.after.front} />
              <GalleryImageCard image={selectedProcedure.after.back} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function GalleryPreview({
  procedure,
}: {
  procedure: {
    procedureName: string;
    before: { front: { src: string; alt: string; label: string } };
  };
}) {
  return (
    <figure className="glass-card overflow-hidden rounded-2xl border border-(--border)">
      <div className="relative aspect-video">
        <Image
          src={procedure.before.front.src}
          alt={procedure.before.front.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          unoptimized={
            procedure.before.front.src.startsWith("data:") ||
            procedure.before.front.src.startsWith("blob:") ||
            procedure.before.front.src.startsWith("/uploads/")
          }
          sizes="(max-width: 1024px) 100vw, 25vw"
        />
      </div>
      <figcaption className="px-4 py-3 text-xs text-(--foreground-muted)">
        {procedure.procedureName}
      </figcaption>
    </figure>
  );
}

function GalleryImageCard({
  image,
}: {
  image: {
    src: string;
    alt: string;
    label: string;
  };
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-surface)">
      <div className="relative aspect-[4/3]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          unoptimized={
            image.src.startsWith("data:") ||
            image.src.startsWith("blob:") ||
            image.src.startsWith("/uploads/")
          }
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <figcaption className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-(--foreground-muted)">
        {image.label}
      </figcaption>
    </figure>
  );
}
