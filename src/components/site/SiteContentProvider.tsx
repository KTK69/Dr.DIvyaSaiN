"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content";
import type { SiteContentEnvelope } from "@/lib/site-content-utils";

type SiteContentContextValue = {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  saveContent: (nextContent?: SiteContent) => Promise<boolean>;
  refreshContent: () => Promise<void>;
  resetContent: () => void;
  saving: boolean;
  lastSyncedAt: string | null;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

async function fetchSiteContentEnvelope(): Promise<SiteContentEnvelope | null> {
  const response = await fetch("/api/site-content", { cache: "no-store" });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SiteContentEnvelope;
}

async function postSiteContentEnvelope(
  nextContent: SiteContent,
): Promise<(SiteContentEnvelope & { ok?: boolean }) | null> {
  const response = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: nextContent }),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SiteContentEnvelope & { ok?: boolean };
}

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContentState] = useState(DEFAULT_SITE_CONTENT);
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const hasLocalEditsRef = useRef(false);
  const contentRef = useRef(content);

  useEffect(() => {
    hasLocalEditsRef.current = hasLocalEdits;
  }, [hasLocalEdits]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const setContent = useCallback<React.Dispatch<React.SetStateAction<SiteContent>>>(
    (update) => {
      setHasLocalEdits(true);
      setContentState((previous) =>
        typeof update === "function" ? update(previous) : update,
      );
    },
    [],
  );

  const refreshContent = useCallback(async () => {
    try {
      const payload = await fetchSiteContentEnvelope();
      if (!payload) {
        return;
      }

      if (hasLocalEditsRef.current) {
        return;
      }

      setContentState(payload.content ?? DEFAULT_SITE_CONTENT);
      setLastSyncedAt(payload.updatedAt ?? null);
    } catch {
      // Ignore background refresh failures and keep the last good snapshot.
    }
  }, []);

  useEffect(() => {
    void refreshContent();

    const interval = window.setInterval(() => {
      void refreshContent();
    }, 15000);

    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") {
        void refreshContent();
      }
    };

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, [refreshContent]);

  const saveContent = useCallback(async (nextContent?: SiteContent) => {
    setSaving(true);

    try {
      const contentToSave = nextContent ?? contentRef.current;
      const payload = await postSiteContentEnvelope(contentToSave);
      if (!payload) {
        return false;
      }

      setContentState(payload.content ?? contentToSave);
      setHasLocalEdits(false);
      setLastSyncedAt(payload.updatedAt ?? null);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      setContent,
      saveContent,
      refreshContent,
      resetContent: () => setContent(DEFAULT_SITE_CONTENT),
      saving,
      lastSyncedAt,
    }),
    [content, lastSyncedAt, refreshContent, saveContent, saving, setContent],
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

