"use client";

import { useEffect, useRef, useState } from "react";

type QuillSelection = { index: number; length: number } | null;
type QuillInstance = {
  root: HTMLElement;
  enable: (enabled: boolean) => void;
  getLength: () => number;
  getSelection: (focus?: boolean) => QuillSelection;
  setSelection: (index: number, length?: number, source?: "api" | "silent" | "user") => void;
  clipboard: {
    dangerouslyPasteHTML: (index: number, html: string, source?: "api" | "silent" | "user") => void;
  };
  insertEmbed: (index: number, type: string, value: string, source?: "api" | "silent" | "user") => void;
  getModule: (name: string) => {
    addHandler: (name: string, handler: () => void) => void;
  } | null;
  on: (event: "text-change" | "selection-change", handler: (...args: Array<unknown>) => void) => void;
  off: (event: "text-change" | "selection-change", handler: (...args: Array<unknown>) => void) => void;
};

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
  readOnly?: boolean;
};

const QUILL_CSS_ID = "quill-snow-css";
const QUILL_SCRIPT_ID = "quill-core-script";
const QUILL_CSS_URL = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css";
const QUILL_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js";
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  ["link", "image"],
  ["clean"],
];

let quillAssetsPromise: Promise<void> | null = null;

declare global {
  interface Window {
    Quill?: {
      new (container: HTMLElement, options: Record<string, unknown>): QuillInstance;
    };
  }
}

function ensureQuillAssets(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (!quillAssetsPromise) {
    quillAssetsPromise = new Promise((resolve, reject) => {
      const existingCss = document.getElementById(QUILL_CSS_ID) as HTMLLinkElement | null;
      if (!existingCss) {
        const link = document.createElement("link");
        link.id = QUILL_CSS_ID;
        link.rel = "stylesheet";
        link.href = QUILL_CSS_URL;
        document.head.appendChild(link);
      }

      const existingScript = document.getElementById(QUILL_SCRIPT_ID) as HTMLScriptElement | null;
      if (existingScript && window.Quill) {
        resolve();
        return;
      }

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Unable to load Quill")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = QUILL_SCRIPT_ID;
      script.src = QUILL_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load Quill"));
      document.body.appendChild(script);
    });
  }

  return quillAssetsPromise;
}

function normalizeHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "<p><br></p>" || trimmed === "<div><br></div>") {
    return "";
  }
  return trimmed.replace(/\s+/g, " ");
}

function htmlFromValue(value: string) {
  return normalizeHtml(value) || "<p><br></p>";
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

export default function RichTextEditor({
  value,
  onChange,
  height = 320,
  placeholder = "Write something...",
  readOnly = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const selectionRef = useRef<QuillSelection>(null);
  const lastSyncedHtmlRef = useRef<string>(normalizeHtml(value));
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(value);
  const initialPlaceholderRef = useRef(placeholder);
  const initialReadOnlyRef = useRef(readOnly);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let active = true;
    let cleanup: (() => void) | undefined;

    const setupEditor = async () => {
      await ensureQuillAssets();

      if (!active || !editorRef.current || quillRef.current || !window.Quill) {
        return;
      }

      const container = editorRef.current;
      container.innerHTML = "";

      const quill = new window.Quill(container, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
        placeholder: initialPlaceholderRef.current,
        readOnly: initialReadOnlyRef.current,
      });

      quillRef.current = quill;

      const initialHtml = htmlFromValue(initialValueRef.current);
      quill.clipboard.dangerouslyPasteHTML(0, initialHtml, "silent");
      lastSyncedHtmlRef.current = normalizeHtml(quill.root.innerHTML);
      quill.enable(!initialReadOnlyRef.current);
      setReady(true);

      const handleTextChange = () => {
        const nextHtml = normalizeHtml(quill.root.innerHTML);
        if (nextHtml === lastSyncedHtmlRef.current) {
          return;
        }

        lastSyncedHtmlRef.current = nextHtml;
        onChangeRef.current(quill.root.innerHTML);
      };

      const handleSelectionChange = (...args: Array<unknown>) => {
        selectionRef.current = (args[0] as QuillSelection) ?? null;
      };

      quill.on("text-change", handleTextChange);
      quill.on("selection-change", handleSelectionChange);
      selectionRef.current = quill.getSelection();

      const toolbar = quill.getModule("toolbar");
      toolbar?.addHandler("image", () => {
        inputRef.current?.click();
      });

      return () => {
        quill.off("text-change", handleTextChange);
        quill.off("selection-change", handleSelectionChange);
      };
    };

    void setupEditor().then((maybeCleanup) => {
      cleanup = maybeCleanup;
    });

    return () => {
      active = false;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }

    quill.enable(!readOnly);
  }, [readOnly]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }

    const nextHtml = normalizeHtml(value);
    if (nextHtml === lastSyncedHtmlRef.current) {
      return;
    }

    const currentSelection = selectionRef.current ?? quill.getSelection(true);
    quill.clipboard.dangerouslyPasteHTML(0, htmlFromValue(value), "silent");
    lastSyncedHtmlRef.current = normalizeHtml(quill.root.innerHTML);

    if (currentSelection) {
      const nextIndex = Math.min(currentSelection.index, Math.max(0, quill.getLength() - 1));
      quill.setSelection(nextIndex, currentSelection.length, "silent");
    }
  }, [value]);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !quillRef.current) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const quill = quillRef.current;
      const selection = selectionRef.current ?? quill.getSelection(true);
      const index = selection ? selection.index : quill.getLength();
      quill.insertEmbed(index, "image", dataUrl, "user");
      quill.setSelection(index + 1, 0, "silent");
    } catch {
      // Ignore failed uploads in the editor shell.
    }
  }

  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-surface) overflow-hidden">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      <div
        ref={editorRef}
        className="min-h-[240px]"
        style={{
          minHeight: `${height}px`,
          opacity: ready ? 1 : 0.75,
        }}
      />
    </div>
  );
}
