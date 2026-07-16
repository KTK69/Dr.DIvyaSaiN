import type {
  BeforeAfterProcedure,
  NavigationServiceItem,
  PatientGallery,
  SiteContent,
} from "@/lib/site-content";
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

function normalizePatientGallery(storedPatient: unknown, fallbackId: string, fallbackName: string): PatientGallery {
  const source = isPlainObject(storedPatient) ? storedPatient : {};
  const id = String(source.id ?? fallbackId);
  const name = String(source.name ?? fallbackName);
  let images: Array<{ src: string; alt: string; label: string }> = [];
  if (Array.isArray(source.images)) {
    images = source.images.map((img, i) => normalizeGallerySlot({}, img, `Image ${i + 1}`));
  }
  return { id, name, images };
}

function normalizeGalleryProcedure(defaultProcedure: Record<string, unknown>, storedProcedure: unknown, fallbackName: string) {
  const storedObject = isPlainObject(storedProcedure) ? storedProcedure : {};
  
  let patients: PatientGallery[] = [];
  
  if (Array.isArray(storedObject.patients)) {
    patients = storedObject.patients.map((p, i) => normalizePatientGallery(p, `patient-${i + 1}`, `Patient ${i + 1}`));
  } else if (Array.isArray(storedObject.images) && storedObject.images.length > 0) {
    const images = storedObject.images.map((img, i) => normalizeGallerySlot({}, img, `Image ${i + 1}`));
    patients = [{
      id: "patient-1",
      name: "Patient 1",
      images
    }];
  } else {
    const storedBefore = isPlainObject(storedObject.before) ? storedObject.before : {};
    const storedAfter = isPlainObject(storedObject.after) ? storedObject.after : {};
    const legacyImages = [];
    if (storedBefore.front) legacyImages.push(normalizeGallerySlot({}, storedBefore.front, "Before Front"));
    if (storedBefore.back) legacyImages.push(normalizeGallerySlot({}, storedBefore.back, "Before Back"));
    if (storedAfter.front) legacyImages.push(normalizeGallerySlot({}, storedAfter.front, "After Front"));
    if (storedAfter.back) legacyImages.push(normalizeGallerySlot({}, storedAfter.back, "After Back"));
    
    if (legacyImages.length > 0) {
      patients = [{
        id: "patient-1",
        name: "Patient 1",
        images: legacyImages
      }];
    }
  }

  if (patients.length === 0 && isPlainObject(defaultProcedure)) {
    if (Array.isArray(defaultProcedure.patients)) {
      patients = (defaultProcedure.patients as PatientGallery[]).map((p, i) => normalizePatientGallery(p, `patient-${i + 1}`, `Patient ${i + 1}`));
    } else if (Array.isArray(defaultProcedure.images)) {
      const images = (defaultProcedure.images as Array<Record<string, unknown>>).map((img, i) => normalizeGallerySlot({}, img, `Image ${i + 1}`));
      patients = [{
        id: "patient-1",
        name: "Patient 1",
        images
      }];
    }
  }

  let previewImage = String(storedObject.previewImage ?? "");
  if (!previewImage) {
    if (patients.length > 0 && patients[0].images.length > 0) {
      previewImage = patients[0].images[0].src;
    } else {
      previewImage = String(defaultProcedure.previewImage ?? "");
    }
  }

  const legacyImagesList = patients.length > 0 ? patients[0].images : [];

  return {
    procedureName: String(storedObject.procedureName ?? defaultProcedure.procedureName ?? fallbackName),
    description: String(storedObject.description ?? defaultProcedure.description ?? ""),
    previewImage,
    images: legacyImagesList,
    patients,
  } satisfies BeforeAfterProcedure;
}

const STORED_ARRAY_KEYS = new Set(["blog", "services", "testimonials", "doctorTalk"]);

function normalizeNavPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function resolveNavigationServiceItem(
  item: Partial<NavigationServiceItem> & { href?: string; label?: string; slug?: string; category?: string },
  fallbackCategory: "reconstructive" | "cosmetic",
  services: SiteContent["services"],
) {
  const href = normalizeNavPath(item.href ?? "");
  const hrefMatch = href.match(/^\/services\/(?:(reconstructive|cosmetic)\/)?([^/?#]+)/i);
  const hrefCategory = hrefMatch?.[1]?.toLowerCase() as "reconstructive" | "cosmetic" | undefined;
  const hrefSlug = hrefMatch?.[2]?.trim() ?? "";
  const explicitSlug = item.slug?.trim() ?? "";
  const explicitCategory =
    item.category === "reconstructive" || item.category === "cosmetic"
      ? item.category
      : undefined;

  const candidateSlug = explicitSlug || hrefSlug;
  const candidateCategory = explicitCategory ?? hrefCategory ?? fallbackCategory;
  const service =
    (candidateSlug
      ? services.find(
          (entry) =>
            entry.slug === candidateSlug &&
            entry.category === candidateCategory,
        )
      : null) ??
    (candidateSlug
      ? services.find((entry) => entry.slug === candidateSlug)
      : null);

  if (!service) {
    return null;
  }

  const resolvedHref = href || `/services/${service.category}/${service.slug}`;
  const label = String(item.label ?? service.name ?? service.slug).trim();

  if (!label || !resolvedHref) {
    return null;
  }

  return {
    slug: service.slug,
    category: service.category,
    label,
    href: resolvedHref,
  } satisfies NavigationServiceItem;
}

function sanitizeNavigationServiceItems(
  items: Array<Partial<NavigationServiceItem> & { href?: string; label?: string; slug?: string; category?: string }>,
  category: "reconstructive" | "cosmetic",
  services: SiteContent["services"],
  seenKeys: Set<string>,
) {
  return items.reduce<NavigationServiceItem[]>((acc, item) => {
    const resolved = resolveNavigationServiceItem(item, category, services);
    if (!resolved) {
      return acc;
    }

    const slugKey = `slug:${resolved.category}:${resolved.slug}`;
    const hrefKey = `href:${resolved.href.toLowerCase()}`;

    if (seenKeys.has(slugKey) || seenKeys.has(hrefKey)) {
      return acc;
    }

    seenKeys.add(slugKey);
    seenKeys.add(hrefKey);
    acc.push(resolved);

    return acc;
  }, []);
}

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

  const seenNavigationItems = new Set<string>();
  merged.navigation.services = {
    reconstructive: sanitizeNavigationServiceItems(
      merged.navigation.services.reconstructive,
      "reconstructive",
      merged.services,
      seenNavigationItems,
    ),
    cosmetic: sanitizeNavigationServiceItems(
      merged.navigation.services.cosmetic,
      "cosmetic",
      merged.services,
      seenNavigationItems,
    ),
  };

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

      if (Array.isArray(galleryValue.procedures)) {
        procedures = galleryValue.procedures.map((procedure, index) =>
          normalizeGalleryProcedure(
            defaultProcedure,
            procedure,
            `Procedure ${index + 1}`,
          ),
        );
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
