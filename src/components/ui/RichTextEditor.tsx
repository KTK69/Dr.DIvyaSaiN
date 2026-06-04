"use client";

import { useEffect, useRef, useState } from "react";

type QuillSelection = { index: number; length: number } | null;
type QuillInstance = {
  root: HTMLElement;
  enable: (enabled: boolean) => void;
  getLength: () => number;
  getSelection: (focus?: boolean) => QuillSelection;
  setSelection: (index: number, length?: number, source?: "api" | "silent" | "user") => void;
  deleteText: (index: number, length: number, source?: "api" | "silent" | "user") => void;
  insertText: (index: number, text: string, source?: "api" | "silent" | "user") => void;
  formatLine: (index: number, length: number, name: string, value: string | false, source?: "api" | "silent" | "user") => void;
  clipboard: {
    dangerouslyPasteHTML: (index: number, html: string, source?: "api" | "silent" | "user") => void;
  };
  insertEmbed: (index: number, type: string, value: string, source?: "api" | "silent" | "user") => void;
  getModule: (name: string) => {
    addHandler: (name: string, handler: (value?: string) => void) => void;
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
const COLOR_OPTIONS = ["#e8edf3", "#8a95a3", "#b8972a", "#d4af4a", "#3b82f6", "#22c55e", "#f97316", "#ef4444", "#ffffff", "#111827"];
const BACKGROUND_OPTIONS = ["#131920", "#1f2937", "#312e1d", "#102235", "#123025", "#3b1d1d", "#ffffff", "#fef3c7", "#dbeafe", "#dcfce7"];
const FONT_SIZE_OPTIONS = ["14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px"];

let quillAssetsPromise: Promise<void> | null = null;
let quillFormatsRegistered = false;

type QuillBlotInstance = {
  domNode: Node;
  format(name: string, value: unknown): void;
};

type QuillBlotConstructor = {
  new (...args: unknown[]): QuillBlotInstance;
  create: (value?: unknown) => HTMLElement;
  formats?: (node: HTMLElement) => unknown;
  value?: (node: HTMLElement) => unknown;
};

declare global {
  interface Window {
    Quill?: {
      new (container: HTMLElement, options: Record<string, unknown>): QuillInstance;
      import: (path: string) => unknown;
      register: (format: unknown, overwrite?: boolean) => void;
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

function registerQuillFormats() {
  if (!window.Quill || quillFormatsRegistered) {
    return;
  }

  const SizeStyle = window.Quill.import("attributors/style/size") as { whitelist: string[] };
  const Block = window.Quill.import("blots/block") as QuillBlotConstructor;
  const BlockEmbed = window.Quill.import("blots/block/embed") as QuillBlotConstructor;
  SizeStyle.whitelist = FONT_SIZE_OPTIONS;

  class DividerBlot extends BlockEmbed {
    static blotName = "divider";
    static tagName = "hr";
    static className = "content-divider";
  }

  class ShapeDividerBlot extends BlockEmbed {
    static blotName = "shapeDivider";
    static tagName = "div";
    static className = "content-shape-divider";

    static create(value?: unknown) {
      const shape = typeof value === "string" ? value : "dots";
      const node = super.create(value);
      node.setAttribute("data-shape", shape);
      node.setAttribute("contenteditable", "false");
      return node;
    }

    static value(node: HTMLElement) {
      return node.getAttribute("data-shape") || "dots";
    }
  }

  class CalloutBlot extends Block {
    static blotName = "callout";
    static tagName = "div";
    static className = "content-callout";

    static create(value?: unknown) {
      const tone = typeof value === "string" ? value : "gold";
      const node = super.create(value);
      node.setAttribute("data-tone", tone);
      return node;
    }

    static formats(node: HTMLElement) {
      return node.getAttribute("data-tone") || "gold";
    }

    format(name: string, value: unknown) {
      if (name === "callout" && typeof value === "string" && value) {
        (this.domNode as HTMLElement).setAttribute("data-tone", value);
        return;
      }

      if (name === "callout" && !value) {
        (this.domNode as HTMLElement).removeAttribute("data-tone");
        return;
      }

      super.format(name, value);
    }
  }

  window.Quill.register(SizeStyle, true);
  window.Quill.register(DividerBlot, true);
  window.Quill.register(ShapeDividerBlot, true);
  window.Quill.register(CalloutBlot, true);
  quillFormatsRegistered = true;
}

function normalizeHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "<p><br></p>" || trimmed === "<div><br></div>") {
    return "";
  }
  return trimmed;
}

function htmlFromValue(value: string) {
  return normalizeHtml(value) || "<p><br></p>";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlFromPlainText(value: string) {
  const blocks = value
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) {
    return "";
  }

  return blocks
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function unwrapElement(element: Element) {
  const parent = element.parentNode;
  if (!parent) {
    return;
  }

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}

function sanitizePastedHtml(value: string) {
  if (typeof window === "undefined" || !value.trim()) {
    return "";
  }

  const parser = new DOMParser();
  const documentValue = parser.parseFromString(value, "text/html");
  const allowedTags = new Set([
    "A",
    "B",
    "BLOCKQUOTE",
    "BR",
    "DIV",
    "EM",
    "H1",
    "H2",
    "H3",
    "HR",
    "I",
    "LI",
    "OL",
    "P",
    "S",
    "STRIKE",
    "STRONG",
    "SUB",
    "SUP",
    "TABLE",
    "TBODY",
    "TD",
    "TFOOT",
    "TH",
    "THEAD",
    "TR",
    "U",
    "UL",
  ]);
  const tableCellTags = new Set(["TD", "TH"]);

  documentValue.querySelectorAll("script, style, meta, link, xml").forEach((node) => node.remove());

  const walker = documentValue.createTreeWalker(documentValue.body, NodeFilter.SHOW_ELEMENT);
  const elements: Element[] = [];
  let current = walker.nextNode();
  while (current) {
    elements.push(current as Element);
    current = walker.nextNode();
  }

  for (const element of elements) {
    if (!allowedTags.has(element.tagName)) {
      unwrapElement(element);
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      if (element.tagName === "A" && name === "href") {
        continue;
      }
      if (name === "class" && /\bcontent-(divider|shape-divider|callout)\b/.test(attribute.value)) {
        continue;
      }
      if ((name === "data-shape" || name === "data-tone") && /\bcontent-(shape-divider|callout)\b/.test(element.className)) {
        continue;
      }
      if (tableCellTags.has(element.tagName) && /^(colspan|rowspan)$/i.test(name) && /^[1-9]\d{0,2}$/.test(attribute.value)) {
        continue;
      }
      element.removeAttribute(attribute.name);
    }

    if (element.tagName === "A") {
      const href = element.getAttribute("href") ?? "";
      if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
        element.removeAttribute("href");
      }
    }
  }

  return documentValue.body.innerHTML
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

function insertEmbedBlock(quill: QuillInstance, type: string, value: string) {
  const selection = quill.getSelection(true);
  const index = selection?.index ?? Math.max(0, quill.getLength() - 1);
  const length = selection?.length ?? 0;

  if (length > 0) {
    quill.deleteText(index, length, "user");
  }

  quill.insertEmbed(index, type, value, "user");
  quill.setSelection(index + 1, 0, "silent");
}

function formatCalloutBlock(quill: QuillInstance, value: string) {
  const selection = quill.getSelection(true);
  const index = selection?.index ?? Math.max(0, quill.getLength() - 1);
  const length = selection?.length ?? 0;
  const placeholder = "Add highlight text here";

  if (length === 0) {
    quill.insertText(index, placeholder, "user");
    quill.formatLine(index, 1, "callout", value, "user");
    quill.setSelection(index, placeholder.length, "silent");
    return;
  }

  quill.formatLine(index, length, "callout", value, "user");
}

export default function RichTextEditor({
  value,
  onChange,
  height = 320,
  placeholder = "Write something...",
  readOnly = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const selectionRef = useRef<QuillSelection>(null);
  const lastSyncedHtmlRef = useRef<string>(normalizeHtml(value));
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(value);
  const initialPlaceholderRef = useRef(placeholder);
  const initialReadOnlyRef = useRef(readOnly);
  const readOnlyRef = useRef(readOnly);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let active = true;
    let cleanup: (() => void) | undefined;

    const setupEditor = async () => {
      await ensureQuillAssets();

      if (!active || !editorRef.current || !toolbarRef.current || quillRef.current || !window.Quill) {
        return;
      }

      registerQuillFormats();

      const container = editorRef.current;
      container.innerHTML = "";

      const quill = new window.Quill(container, {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarRef.current,
          },
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
      toolbar?.addHandler("divider", () => {
        insertEmbedBlock(quill, "divider", "line");
      });
      toolbar?.addHandler("shapeDivider", (value) => {
        insertEmbedBlock(quill, "shapeDivider", value || "dots");
      });
      toolbar?.addHandler("callout", (value) => {
        formatCalloutBlock(quill, value || "gold");
      });

      const handlePaste = (event: ClipboardEvent) => {
        if (readOnlyRef.current) {
          return;
        }

        const clipboardData = event.clipboardData;
        if (!clipboardData) {
          return;
        }

        const pastedHtml = clipboardData.getData("text/html");
        const pastedText = clipboardData.getData("text/plain");
        const sanitizedHtml = pastedHtml ? sanitizePastedHtml(pastedHtml) : htmlFromPlainText(pastedText);

        if (!sanitizedHtml) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        const selection = quill.getSelection(true);
        const index = selection?.index ?? Math.max(0, quill.getLength() - 1);
        const length = selection?.length ?? 0;

        if (length > 0) {
          quill.deleteText(index, length, "user");
        }

        quill.clipboard.dangerouslyPasteHTML(index, sanitizedHtml, "user");
      };

      quill.root.addEventListener("paste", handlePaste, true);

      return () => {
        quill.off("text-change", handleTextChange);
        quill.off("selection-change", handleSelectionChange);
        quill.root.removeEventListener("paste", handlePaste, true);
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
    readOnlyRef.current = readOnly;
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
      <div ref={toolbarRef} className="ql-toolbar ql-snow rich-editor-toolbar">
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="">Normal</option>
          </select>
          <select className="ql-size" defaultValue="">
            <option value="">Size</option>
            {FONT_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </span>

        <span className="ql-formats">
          <button className="ql-bold" title="Bold" />
          <button className="ql-italic" title="Italic" />
          <button className="ql-underline" title="Underline" />
          <button className="ql-strike" title="Strike" />
          <button className="ql-blockquote" title="Quote" />
          <button className="ql-code-block" title="Code block" />
        </span>

        <span className="ql-formats">
          <button className="ql-list" value="ordered" title="Numbered list" />
          <button className="ql-list" value="bullet" title="Bullet list" />
          <button className="ql-indent" value="-1" title="Outdent" />
          <button className="ql-indent" value="+1" title="Indent" />
        </span>

        <span className="ql-formats">
          <select className="ql-align" defaultValue="">
            <option value="">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
          <button className="ql-direction" value="rtl" title="Right to left" />
          <button className="ql-script" value="sub" title="Subscript" />
          <button className="ql-script" value="super" title="Superscript" />
        </span>

        <span className="ql-formats">
          <select className="ql-color" defaultValue="">
            <option value="">Text color</option>
            {COLOR_OPTIONS.map((color) => (
              <option key={color} value={color} />
            ))}
          </select>
          <select className="ql-background" defaultValue="">
            <option value="">Highlight</option>
            {BACKGROUND_OPTIONS.map((color) => (
              <option key={color} value={color} />
            ))}
          </select>
        </span>

        <span className="ql-formats">
          <button className="ql-link" title="Link" />
          <button className="ql-image" title="Image" />
          <button className="ql-divider rich-editor-text-button" title="Line divider" type="button">
            Line
          </button>
          <select className="ql-shapeDivider" defaultValue="">
            <option value="">Shape</option>
            <option value="dots">Dots</option>
            <option value="chevron">Chevron</option>
            <option value="pill">Pill</option>
          </select>
          <select className="ql-callout" defaultValue="">
            <option value="">Callout</option>
            <option value="gold">Gold note</option>
            <option value="blue">Blue note</option>
            <option value="green">Green note</option>
          </select>
        </span>

        <span className="ql-formats">
          <button className="ql-clean" title="Clear formatting" />
        </span>
      </div>
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
