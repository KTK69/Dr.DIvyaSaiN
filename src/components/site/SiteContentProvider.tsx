"use client";

import React, { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content";

const STORAGE_KEY = "emmi-site-content";
const CONTENT_EVENT = "emmi-site-content-changed";

let _cachedRaw: string | null = null;
let _cachedSnapshot: SiteContent | null = null;

type SiteContentContextValue = {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  resetContent: () => void;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeWithDefaults<T>(defaults: T, stored: unknown): T {
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

function readSnapshot(): SiteContent {
  if (typeof window === "undefined") {
    return DEFAULT_SITE_CONTENT;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  // If nothing stored, return default and reset cache
  if (!raw) {
    _cachedRaw = null;
    _cachedSnapshot = DEFAULT_SITE_CONTENT;
    return DEFAULT_SITE_CONTENT;
  }

  // Return cached object if the raw string hasn't changed
  if (raw === _cachedRaw && _cachedSnapshot) {
    return _cachedSnapshot;
  }

  try {
    const parsed = JSON.parse(raw) as SiteContent;
    const merged = mergeWithDefaults(DEFAULT_SITE_CONTENT, parsed);
    _cachedRaw = raw;
    _cachedSnapshot = merged;
    return merged;
  } catch {
    _cachedRaw = raw;
    _cachedSnapshot = DEFAULT_SITE_CONTENT;
    return DEFAULT_SITE_CONTENT;
  }
}

function writeSnapshot(nextContent: SiteContent) {
  const raw = JSON.stringify(nextContent);
  window.localStorage.setItem(STORAGE_KEY, raw);
  // update cache so subsequent readSnapshot calls during this render return stable ref
  _cachedRaw = raw;
  _cachedSnapshot = nextContent;
  window.dispatchEvent(new Event(CONTENT_EVENT));
}

function subscribe(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CONTENT_EVENT, listener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CONTENT_EVENT, listener);
  };
}

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const content = useSyncExternalStore(subscribe, readSnapshot, () => DEFAULT_SITE_CONTENT);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      setContent: (update) => {
        const nextContent = typeof update === "function" ? update(readSnapshot()) : update;
        writeSnapshot(nextContent);
      },
      resetContent: () => writeSnapshot(DEFAULT_SITE_CONTENT),
    }),
    [content],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  }

  return context;
}


