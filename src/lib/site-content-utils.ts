import type { SiteContent } from "@/lib/site-content";

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
  const defaultBefore = isPlainObject(defaultProcedure.before) ? defaultProcedure.before : {};
  const defaultAfter = isPlainObject(defaultProcedure.after) ? defaultProcedure.after : {};
  const storedBefore = isPlainObject(storedObject.before) ? storedObject.before : {};
  const storedAfter = isPlainObject(storedObject.after) ? storedObject.after : {};

  return {
    procedureName: String(storedObject.procedureName ?? defaultProcedure.procedureName ?? fallbackName),
    description: String(storedObject.description ?? defaultProcedure.description ?? ""),
    before: {
      front: normalizeGallerySlot(
        isPlainObject(defaultBefore.front) ? defaultBefore.front : {},
        storedBefore.front,
        "Before front",
      ),
      back: normalizeGallerySlot(
        isPlainObject(defaultBefore.back) ? defaultBefore.back : {},
        storedBefore.back,
        "Before back",
      ),
    },
    after: {
      front: normalizeGallerySlot(
        isPlainObject(defaultAfter.front) ? defaultAfter.front : {},
        storedAfter.front,
        "After front",
      ),
      back: normalizeGallerySlot(
        isPlainObject(defaultAfter.back) ? defaultAfter.back : {},
        storedAfter.back,
        "After back",
      ),
    },
  };
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
