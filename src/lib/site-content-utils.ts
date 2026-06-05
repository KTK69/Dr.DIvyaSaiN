import type { SiteContent } from "@/lib/site-content";
import type { Blog } from "@/types/content";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeGallerySlot(defaultSlot: Record<string, unknown>, storedSlot: unknown, fallbackLabel: string) {
  const source = isPlainObject(storedSlot) ? storedSlot : {};

  return {
    src: String(source.src ?? defaultSlot.src ?? ""),
    alt: String(source.alt ?? defaultSlot.alt ?? fallbackLabel),
    label: String(source.label ?? defaultSlot.label ?? fallbackLabel),
  };
}

function normalizeGalleryProcedure(defaultProcedure: Record<string, unknown>, storedProcedure: unknown, fallbackName: string) {
  const storedObject = isPlainObject(storedProcedure) ? storedProcedure : {};
  
  let images: Array<{ src: string; alt: string; label: string }> = [];
  if (Array.isArray(storedObject.images)) {
    images = storedObject.images.map((img, i) => normalizeGallerySlot({}, img, `Image ${i + 1}`));
  } else {
    const storedBefore = isPlainObject(storedObject.before) ? storedObject.before : {};
    const storedAfter = isPlainObject(storedObject.after) ? storedObject.after : {};
    
    if (storedBefore.front) {
      images.push(normalizeGallerySlot({}, storedBefore.front, "Before Front"));
    }
    if (storedBefore.back) {
      images.push(normalizeGallerySlot({}, storedBefore.back, "Before Back"));
    }
    if (storedAfter.front) {
      images.push(normalizeGallerySlot({}, storedAfter.front, "After Front"));
    }
    if (storedAfter.back) {
      images.push(normalizeGallerySlot({}, storedAfter.back, "After Back"));
    }
  }

  if (images.length === 0 && Array.isArray(defaultProcedure.images)) {
    images = (defaultProcedure.images as Array<any>).map((img, i) => normalizeGallerySlot({}, img, `Image ${i + 1}`));
  }

  let previewImage = String(storedObject.previewImage ?? "");
  if (!previewImage) {
    if (images.length > 0) {
      previewImage = images[0].src;
    } else {
      const storedBefore = isPlainObject(storedObject.before) ? storedObject.before : {};
      const frontSlot = isPlainObject(storedBefore.front) ? storedBefore.front : {};
      previewImage = String(frontSlot.src ?? defaultProcedure.previewImage ?? "");
    }
  }

  return {
    procedureName: String(storedObject.procedureName ?? defaultProcedure.procedureName ?? fallbackName),
    description: String(storedObject.description ?? defaultProcedure.description ?? ""),
    previewImage,
    images,
  };
}

const STORED_ARRAY_KEYS = new Set(["blog", "services", "testimonials", "doctorTalk"]);

/** Merge stored CMS data without substituting seed blogs/services when arrays are empty. */
export function mergeStoredSiteContent(
  defaults: SiteContent,
  stored: unknown,
): SiteContent {
  const merged = mergeWithDefaults(defaults, stored);
  const storedObject = isPlainObject(stored) ? stored : {};

  for (const key of STORED_ARRAY_KEYS) {
    if (Array.isArray(storedObject[key])) {
      (merged as Record<string, unknown>)[key] = storedObject[key];
    }
  }

  if (Array.isArray(storedObject.blog)) {
    merged.blog = storedObject.blog as Blog[];
  }

  return merged;
}

export function mergeWithDefaults<T>(defaults: T, stored: unknown): T {
  if (!isPlainObject(defaults)) {
    return (stored ?? defaults) as T;
  }

  const storedObject = isPlainObject(stored) ? stored : {};
  const merged: Record<string, unknown> = { ...defaults, ...storedObject };

  for (const key of Object.keys(defaults as Record<string, unknown>)) {
    const defaultValue = (defaults as Record<string, unknown>)[key];
    const storedValue = storedObject[key];

    if (
      key === "beforeAfterGallery" &&
      isPlainObject(defaultValue) &&
      isPlainObject(storedValue)
    ) {
      const galleryValue = storedValue as Record<string, unknown>;
      const defaultGallery = defaultValue as Record<string, unknown>;
      const defaultProcedures = Array.isArray(defaultGallery.procedures)
        ? defaultGallery.procedures.filter(isPlainObject)
        : [];
      const defaultProcedure = defaultProcedures[0] ?? {};
      const legacyImages = Array.isArray(galleryValue.images) ? galleryValue.images : [];

      let procedures: Array<Record<string, unknown>> = [];

      if (Array.isArray(galleryValue.procedures) && galleryValue.procedures.length > 0) {
        procedures = galleryValue.procedures.map((procedure, index) =>
          normalizeGalleryProcedure(
            defaultProcedure,
            procedure,
            `Procedure ${index + 1}`,
          ),
        );

        if (defaultProcedures.length > procedures.length) {
          const missingProcedures = defaultProcedures
            .slice(procedures.length)
            .map((procedure, index) =>
              normalizeGalleryProcedure(
                defaultProcedure,
                procedure,
                `Procedure ${procedures.length + index + 1}`,
              ),
            );

          procedures = [...procedures, ...missingProcedures];
        }
      } else if (legacyImages.length > 0 || isPlainObject(galleryValue.before) || isPlainObject(galleryValue.after) || galleryValue.procedureName) {
        const fallbackProcedure = {
          procedureName: String(galleryValue.procedureName ?? defaultProcedure.procedureName ?? galleryValue.title ?? "Procedure"),
          description: String(galleryValue.description ?? defaultGallery.description ?? ""),
          before: galleryValue.before,
          after: galleryValue.after,
        };

        const migratedProcedure = normalizeGalleryProcedure(defaultProcedure, fallbackProcedure, "Procedure 1");
        const defaultRemainder = defaultProcedures.slice(1).map((procedure, index) =>
          normalizeGalleryProcedure(defaultProcedure, procedure, `Procedure ${index + 2}`),
        );

        procedures = [migratedProcedure, ...defaultRemainder];
      } else if (defaultProcedures.length > 0) {
        procedures = defaultProcedures.map((procedure, index) =>
          normalizeGalleryProcedure(defaultProcedure, procedure, `Procedure ${index + 1}`),
        );
      }

      merged[key] = {
        eyebrow: String(galleryValue.eyebrow ?? defaultGallery.eyebrow ?? ""),
        title: String(galleryValue.title ?? defaultGallery.title ?? ""),
        subtitle: String(galleryValue.subtitle ?? defaultGallery.subtitle ?? ""),
        description: String(galleryValue.description ?? defaultGallery.description ?? ""),
        procedures,
      };
      continue;
    }

    if (Array.isArray(defaultValue)) {
      merged[key] = Array.isArray(storedValue) ? storedValue : defaultValue;
      continue;
    }

    if (isPlainObject(defaultValue)) {
      merged[key] = mergeWithDefaults(defaultValue, storedValue);
      continue;
    }

    merged[key] = storedValue ?? defaultValue;
  }

  return merged as T;
}

export type SiteContentEnvelope = {
  content: SiteContent;
  updatedAt: string;
};
