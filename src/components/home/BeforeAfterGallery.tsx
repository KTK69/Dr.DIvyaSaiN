"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function BeforeAfterGallery() {
  const { content } = useSiteContent();
  const gallery = content.home.beforeAfterGallery;

  return (
    <section className="section-padding" aria-label="Before and after gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={gallery.eyebrow}
          title={gallery.title}
          subtitle={gallery.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {gallery.images.map((image, index) => (
            <figure key={`${image.src}-${image.label}-${index}`} className="glass-card rounded-2xl overflow-hidden border border-(--border)">
              <div className="relative aspect-video">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
              <figcaption className="px-4 py-3 text-xs text-(--foreground-muted)">
                {image.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
