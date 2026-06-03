"use client";

import { useCallback, useEffect, useId, useRef } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
};

type ToolbarAction = {
  label: string;
  command: string;
  value?: string;
};

const blockOptions = [
  { label: "Paragraph", value: "p" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
];

const toolbarActions: ToolbarAction[] = [
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "• List", command: "insertUnorderedList" },
  { label: "1. List", command: "insertOrderedList" },
  { label: "Left", command: "justifyLeft" },
  { label: "Center", command: "justifyCenter" },
  { label: "Right", command: "justifyRight" },
  { label: "Clear", command: "removeFormat" },
];

export default function RichTextEditor({
  value,
  onChange,
  height = 260,
  placeholder = "Write content here...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const editorId = useId();

  const syncEditorValue = useCallback(() => {
    if (!editorRef.current) {
      return;
    }

    const nextValue = editorRef.current.innerHTML;
    onChange(nextValue === "<br>" ? "" : nextValue);
  }, [onChange]);

  const saveSelection = useCallback(() => {
    if (!editorRef.current || typeof window === "undefined") {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    selectionRef.current = range.cloneRange();
  }, []);

  const restoreSelection = useCallback(() => {
    if (typeof window === "undefined" || !selectionRef.current) {
      return;
    }

    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  }, []);

  const runCommand = useCallback(
    (command: string, commandValue?: string) => {
      if (!editorRef.current) {
        return;
      }

      editorRef.current.focus();
      restoreSelection();
      document.execCommand(command, false, commandValue);
      saveSelection();
      syncEditorValue();
    },
    [restoreSelection, saveSelection, syncEditorValue],
  );

  const handleLink = useCallback(() => {
    const url = window.prompt("Enter the link URL");
    if (!url) {
      return;
    }

    runCommand("createLink", url);
  }, [runCommand]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-card)">
      <div className="flex flex-wrap items-center gap-2 border-b border-(--border) px-3 py-3">
        <label className="sr-only" htmlFor={editorId}>
          Text style
        </label>
        <select
          id={editorId}
          defaultValue="p"
          onChange={(event) => runCommand("formatBlock", event.target.value)}
          className="rounded-md border border-(--border) bg-(--bg-surface) px-3 py-2 text-xs text-(--foreground)"
        >
          {blockOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {toolbarActions.map((action) => (
          <button
            key={`${action.command}-${action.label}`}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand(action.command, action.value)}
            className="rounded-md border border-(--border) px-3 py-2 text-xs font-medium text-(--foreground-muted) transition-colors hover:text-(--foreground)"
          >
            {action.label}
          </button>
        ))}

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleLink}
          className="rounded-md border border-(--border) px-3 py-2 text-xs font-medium text-(--foreground-muted) transition-colors hover:text-(--foreground)"
        >
          Link
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("unlink")}
          className="rounded-md border border-(--border) px-3 py-2 text-xs font-medium text-(--foreground-muted) transition-colors hover:text-(--foreground)"
        >
          Unlink
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={syncEditorValue}
        onBlur={() => {
          saveSelection();
          syncEditorValue();
        }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        className="rich-text min-h-40 w-full px-4 py-3 text-(--foreground) outline-none empty:before:pointer-events-none empty:before:text-(--foreground-subtle) empty:before:content-[attr(data-placeholder)]"
        style={{ minHeight: `${height}px` }}
      />
    </div>
  );
}
