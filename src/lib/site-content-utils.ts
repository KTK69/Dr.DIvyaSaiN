import type { SiteContent } from "@/lib/site-content";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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
