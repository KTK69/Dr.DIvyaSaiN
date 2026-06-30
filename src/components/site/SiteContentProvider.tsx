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
import { usePathname, useRouter } from "next/navigation";
import {
  CLIENT_FALLBACK_SITE_CONTENT,
  type SiteContent,
} from "@/lib/site-content";
import type { SiteContentEnvelope } from "@/lib/site-content-utils";

type SiteContentApiPayload = SiteContentEnvelope & {
  ok?: boolean;
  message?: string;
  diagnostics?: {
    nodeEnv?: string;
    storageProvider?: string;
    localFilePath?: string;
    dataDirectory?: string;
  };
};

type SiteContentContextValue = {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  replaceContent: (nextContent: SiteContent) => void;
  saveContent: (
    nextContent?: SiteContent,
  ) => Promise<{ ok: boolean; message?: string }>;
  refreshContent: () => Promise<void>;
  resetContent: () => void;
  saving: boolean;
  lastSyncedAt: string | null;
  contentReady: boolean;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);
const CONTENT_UPDATED_EVENT = "site-content:updated";

function isNewerOrEqualTimestamp(incoming: string | null, current: string | null) {
  if (!incoming) {
    return false;
  }
  if (!current) {
    return true;
  }
  return incoming >= current;
}

async function fetchSiteContentEnvelope(): Promise<SiteContentApiPayload | null> {
  const response = await fetch(`/api/site-content?ts=${Date.now()}`, {
    cache: "no-store",
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SiteContentApiPayload;
}

async function postSiteContentEnvelope(
  nextContent: SiteContent,
): Promise<{ ok: boolean; payload?: SiteContentApiPayload; message?: string }> {
  const response = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: nextContent }),
    cache: "no-store",
  });

  const payload = (await response.json()) as SiteContentApiPayload;

  if (!response.ok || payload.ok === false) {
    return {
      ok: false,
      message: payload.message ?? "Unable to save site content.",
    };
  }

  return { ok: true, payload };
}

type SiteContentProviderProps = {
  children: React.ReactNode;
  initialEnvelope?: SiteContentEnvelope;
};

export function SiteContentProvider({
  children,
  initialEnvelope,
}: SiteContentProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
  const [content, setContentState] = useState(
    initialEnvelope?.content ?? CLIENT_FALLBACK_SITE_CONTENT,
  );
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(
    initialEnvelope?.updatedAt ?? null,
  );
  const [contentReady, setContentReady] = useState(Boolean(initialEnvelope));
  const hasLocalEditsRef = useRef(false);
  const contentRef = useRef(content);
  const lastSyncedAtRef = useRef(lastSyncedAt);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const hasServerSnapshotRef = useRef(Boolean(initialEnvelope));
  const savingRef = useRef(false);

  useEffect(() => {
    hasLocalEditsRef.current = hasLocalEdits;
  }, [hasLocalEdits]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    lastSyncedAtRef.current = lastSyncedAt;
  }, [lastSyncedAt]);

  const setContent = useCallback<React.Dispatch<React.SetStateAction<SiteContent>>>(
    (update) => {
      setHasLocalEdits(true);
      setContentState((previous) =>
        typeof update === "function" ? update(previous) : update,
      );
    },
    [],
  );

  const replaceContent = useCallback((nextContent: SiteContent) => {
    setContentState(nextContent);
  }, []);

  const applyRemoteEnvelope = useCallback((payload: SiteContentEnvelope) => {
    if (!payload.content) {
      return;
    }

    if (
      hasServerSnapshotRef.current &&
      !isNewerOrEqualTimestamp(payload.updatedAt ?? null, lastSyncedAtRef.current)
    ) {
      return;
    }

    setContentState(payload.content);
    setLastSyncedAt(payload.updatedAt ?? null);
    setContentReady(true);
    hasServerSnapshotRef.current = true;
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      const payload = await fetchSiteContentEnvelope();
      if (!payload?.content) {
        return;
      }

      if (hasLocalEditsRef.current && isAdminRoute) {
        return;
      }

      applyRemoteEnvelope(payload);
    } catch {
      // Keep last good snapshot on network errors.
    }
  }, [applyRemoteEnvelope, isAdminRoute]);

  const notifyContentUpdated = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
    broadcastChannelRef.current?.postMessage({ type: CONTENT_UPDATED_EVENT });
  }, []);

  useEffect(() => {
    if (!initialEnvelope) {
      void refreshContent();
    } else {
      setContentReady(true);
    }

    const onContentUpdated = () => {
      if (savingRef.current) return;
      if (!hasLocalEditsRef.current || !isAdminRoute) {
        void refreshContent();
      }
    };

    const channel =
      typeof window !== "undefined" && "BroadcastChannel" in window
        ? new BroadcastChannel(CONTENT_UPDATED_EVENT)
        : null;

    broadcastChannelRef.current = channel;

    const interval = window.setInterval(() => {
      void refreshContent();
    }, 30000);

    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") {
        void refreshContent();
      }
    };

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);
    window.addEventListener(CONTENT_UPDATED_EVENT, onContentUpdated);
    channel?.addEventListener("message", onContentUpdated);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
      window.removeEventListener(CONTENT_UPDATED_EVENT, onContentUpdated);
      channel?.removeEventListener("message", onContentUpdated);
      channel?.close();
      broadcastChannelRef.current = null;
    };
  }, [initialEnvelope, refreshContent, isAdminRoute]);

  const saveContent = useCallback(async (nextContent?: SiteContent) => {
    setSaving(true);
    savingRef.current = true;

    try {
      const contentToSave = nextContent ?? contentRef.current;
      const result = await postSiteContentEnvelope(contentToSave);
      if (!result.ok || !result.payload) {
        return {
          ok: false,
          message: result.message ?? "Unable to save site content.",
        };
      }

      const payload = result.payload;
      const savedContent = payload.content ?? contentToSave;
      const savedTimestamp = payload.updatedAt ?? null;

      // Update timestamp first so any incoming refresh sees us as current
      setLastSyncedAt(savedTimestamp);
      setContentState(savedContent);
      setHasLocalEdits(false);
      setContentReady(true);
      hasServerSnapshotRef.current = true;

      // Notify other tabs but not ourselves during the save window
      notifyContentUpdated();

      // Small delay before allowing self-refresh to avoid race
      setTimeout(() => {
        savingRef.current = false;
      }, 500);

      router.refresh();
      return { ok: true };
    } catch {
      savingRef.current = false;
      return {
        ok: false,
        message: "Unable to reach the content save endpoint.",
      };
    } finally {
      setSaving(false);
    }
  }, [notifyContentUpdated, router]);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      setContent,
      replaceContent,
      saveContent,
      refreshContent,
      resetContent: () => setContent(CLIENT_FALLBACK_SITE_CONTENT),
      saving,
      lastSyncedAt,
      contentReady,
    }),
    [
      content,
      contentReady,
      lastSyncedAt,
      refreshContent,
      replaceContent,
      saveContent,
      saving,
      setContent,
    ],
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
