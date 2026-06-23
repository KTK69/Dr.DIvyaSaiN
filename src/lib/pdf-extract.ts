/**
 * PDF text extraction with column-aware reading order and table detection.
 *
 * Uses PDF.js (loaded from CDN) to extract text items with their x/y positions,
 * then reconstructs proper reading order by detecting columns via x-position
 * clustering — so multi-column PDFs read correctly instead of jumbled.
 *
 * Tables are detected by looking for grid-like patterns (multiple rows with
 * items at consistent x-positions) and rendered as proper HTML tables.
 */

/* -------------------------------------------------------------------------- */
/*  PDF.js CDN loader (same lazy pattern used for Quill in RichTextEditor)    */
/* -------------------------------------------------------------------------- */

const PDFJS_VERSION = "4.10.38";
const PDFJS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`;
const PDFJS_WORKER_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

type PdfTextItem = {
  str: string;
  transform: number[]; // [scaleX, skewY, skewX, scaleY, translateX, translateY]
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
};

type PdfTextContent = {
  items: Array<PdfTextItem | { type: string }>;
};

type PdfPage = {
  getTextContent: () => Promise<PdfTextContent>;
  getViewport: (options: { scale: number }) => { width: number; height: number };
};

type PdfDocument = {
  numPages: number;
  getPage: (num: number) => Promise<PdfPage>;
};

type PdfJsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (data: { data: ArrayBuffer }) => { promise: Promise<PdfDocument> };
};

let pdfjsPromise: Promise<PdfJsLib> | null = null;

function loadPdfJs(): Promise<PdfJsLib> {
  if (pdfjsPromise) {
    return pdfjsPromise;
  }

  pdfjsPromise = (async () => {
    const pdfjs = (await import(/* webpackIgnore: true */ PDFJS_CDN)) as PdfJsLib;
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
    return pdfjs;
  })();

  return pdfjsPromise;
}

/* -------------------------------------------------------------------------- */
/*  Text item with computed position                                          */
/* -------------------------------------------------------------------------- */

type PositionedItem = {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  width: number;
  fontName: string;
  isBold?: boolean;
  isItalic?: boolean;
};

function extractPositionedItems(textContent: PdfTextContent): PositionedItem[] {
  const items: PositionedItem[] = [];

  for (const raw of textContent.items) {
    if ("type" in raw) {
      continue; // skip markers
    }

    const item = raw as PdfTextItem;
    const str = item.str.trim();
    if (!str) {
      continue;
    }

    // transform: [scaleX, skewY, skewX, scaleY, translateX, translateY]
    const fontSize = Math.abs(item.transform[3]) || Math.abs(item.transform[0]) || 12;
    const x = item.transform[4];
    const y = item.transform[5];

    const fontLower = item.fontName.toLowerCase();
    const isBold = fontLower.includes("bold") || fontLower.includes("-bd") || fontLower.includes("heavy") || fontLower.includes("black") || fontLower.includes("w7") || fontLower.includes("w8") || fontLower.includes("w9");
    const isItalic = fontLower.includes("italic") || fontLower.includes("oblique") || fontLower.includes("-it");

    items.push({
      text: str,
      x,
      y,
      fontSize,
      width: item.width,
      fontName: item.fontName,
      isBold,
      isItalic,
    });
  }

  return items;
}

/* -------------------------------------------------------------------------- */
/*  Table detection — find grid-like item arrangements                        */
/* -------------------------------------------------------------------------- */

/** A row of cells, where each cell is positioned text */
type TableRow = {
  y: number;
  cells: { x: number; text: string }[];
};

type TableResult = {
  /** Items that form a table, grouped into rows and columns */
  rows: string[][];
  /** Indices into the original items array that belong to this table */
  itemIndices: Set<number>;
};

/**
 * Detect table structures by finding items arranged in a grid pattern.
 *
 * Strategy:
 * 1. Group items by y-position (rows)
 * 2. For rows with 2+ items, cluster the x-positions across rows
 * 3. If multiple consecutive rows share consistent x-columns → table
 */
function getColumnAnchors(items: PositionedItem[], xTolerance: number): number[] {
  if (items.length === 0) return [];
  const xValues = items.map(item => item.x).sort((a, b) => a - b);
  const anchors: number[] = [];
  let sum = xValues[0];
  let count = 1;
  for (let i = 1; i < xValues.length; i++) {
    if (xValues[i] - xValues[i - 1] <= xTolerance) {
      sum += xValues[i];
      count++;
    } else {
      anchors.push(sum / count);
      sum = xValues[i];
      count = 1;
    }
  }
  anchors.push(sum / count);
  return anchors;
}

function detectTables(items: PositionedItem[], yTolerance = 3, xTolerance = 15): TableResult[] {
  if (items.length < 4) {
    return []; // Need at least 2×2 for a table
  }

  // Step 1: Group items into rows by y-position (top-to-bottom)
  const sortedByY = items
    .map((item, index) => ({ ...item, originalIndex: index }))
    .sort((a, b) => b.y - a.y); // PDF y: higher = top

  const rowGroups: { y: number; items: (PositionedItem & { originalIndex: number })[] }[] = [];
  let currentGroup = { y: sortedByY[0].y, items: [sortedByY[0]] };

  for (let i = 1; i < sortedByY.length; i++) {
    if (Math.abs(sortedByY[i].y - currentGroup.y) <= yTolerance) {
      currentGroup.items.push(sortedByY[i]);
    } else {
      rowGroups.push(currentGroup);
      currentGroup = { y: sortedByY[i].y, items: [sortedByY[i]] };
    }
  }
  rowGroups.push(currentGroup);

  const tables: TableResult[] = [];
  let currentTableRows: typeof rowGroups = [];
  let consecutiveSingleItemRows = 0;
  const maxTableGap = 45; // Maximum vertical gap between lines in a table
  const maxConsecutiveSingleItemRows = 3;

  for (let r = 0; r < rowGroups.length; r++) {
    const row = rowGroups[r];

    if (currentTableRows.length === 0) {
      // Look for a table start: a row group with >= 2 items
      if (row.items.length >= 2) {
        currentTableRows.push(row);
        consecutiveSingleItemRows = 0;
      }
    } else {
      const prevRow = currentTableRows[currentTableRows.length - 1];
      const yGap = prevRow.y - row.y; // y-axis goes bottom-to-top, so prevRow.y > row.y

      // Check alignment compatibility with the current table's column structure first
      const accumulatedItems = currentTableRows.flatMap(rg => rg.items);
      const anchors = getColumnAnchors(accumulatedItems, xTolerance);

      let isCompatible = false;
      if (row.items.length === 1) {
        const item = row.items[0];
        isCompatible = anchors.some(a => Math.abs(item.x - a) <= xTolerance);
      } else if (row.items.length >= 2) {
        let matches = 0;
        for (const item of row.items) {
          if (anchors.some(a => Math.abs(item.x - a) <= xTolerance)) {
            matches++;
          }
        }
        isCompatible = matches >= 2 || hasCompatibleColumns(prevRow.items, row.items, xTolerance);
      }

      // Check for vertical gap limit
      // If compatible, we allow a larger gap (up to 250px) to cross page breaks/margins
      const maxAllowedGap = isCompatible ? 250 : maxTableGap;
      if (yGap > maxAllowedGap) {
        // Flush table if it has enough rows
        if (currentTableRows.length - consecutiveSingleItemRows >= 2) {
          const tableRowsToFlush = currentTableRows.slice(0, currentTableRows.length - consecutiveSingleItemRows);
          const table = buildTable(tableRowsToFlush, xTolerance);
          if (table) tables.push(table);
        }
        currentTableRows = [];
        consecutiveSingleItemRows = 0;
        if (row.items.length >= 2) {
          currentTableRows.push(row);
        }
        continue;
      }

      if (isCompatible) {
        currentTableRows.push(row);
        if (row.items.length === 1) {
          consecutiveSingleItemRows++;
        } else {
          consecutiveSingleItemRows = 0;
        }

        if (consecutiveSingleItemRows > maxConsecutiveSingleItemRows) {
          // Flush table but exclude the trailing weak single-item rows
          const tableRowsToFlush = currentTableRows.slice(0, currentTableRows.length - consecutiveSingleItemRows);
          if (tableRowsToFlush.length >= 2) {
            const table = buildTable(tableRowsToFlush, xTolerance);
            if (table) tables.push(table);
          }
          currentTableRows = [];
          consecutiveSingleItemRows = 0;
          if (row.items.length >= 2) {
            currentTableRows.push(row);
          }
        }
      } else {
        // Flush table if it has enough rows
        if (currentTableRows.length - consecutiveSingleItemRows >= 2) {
          const tableRowsToFlush = currentTableRows.slice(0, currentTableRows.length - consecutiveSingleItemRows);
          const table = buildTable(tableRowsToFlush, xTolerance);
          if (table) tables.push(table);
        }
        currentTableRows = [];
        consecutiveSingleItemRows = 0;
        if (row.items.length >= 2) {
          currentTableRows.push(row);
        }
      }
    }
  }

  // Flush trailing table
  if (currentTableRows.length > 0) {
    const tableRowsToFlush = currentTableRows.slice(0, currentTableRows.length - consecutiveSingleItemRows);
    if (tableRowsToFlush.length >= 2) {
      const table = buildTable(tableRowsToFlush, xTolerance);
      if (table) tables.push(table);
    }
  }

  return tables;
}

/** Check if two rows share at least 2 similar x-positions (columns) */
function hasCompatibleColumns(
  rowA: { x: number }[],
  rowB: { x: number }[],
  tolerance: number,
): boolean {
  let matches = 0;
  for (const a of rowA) {
    for (const b of rowB) {
      if (Math.abs(a.x - b.x) <= tolerance) {
        matches++;
        break;
      }
    }
  }
  return matches >= 2;
}

function formatItemText(item: PositionedItem): string {
  let escaped = escapeHtml(item.text);
  if (item.isBold) {
    escaped = `<strong>${escaped}</strong>`;
  }
  if (item.isItalic) {
    escaped = `<em>${escaped}</em>`;
  }
  return escaped;
}

function mergeEmptyKeyRows(rows: string[][]): string[][] {
  if (rows.length <= 1) return rows;

  const merged: string[][] = [rows[0]];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const prevRow = merged[merged.length - 1];

    const isCol0Empty = !row[0] || !row[0].trim();
    const isCol1Empty = row.length > 1 ? (!row[1] || !row[1].trim()) : true;

    if (isCol0Empty && isCol1Empty && row.some(cell => cell && cell.trim())) {
      for (let c = 0; c < row.length; c++) {
        if (row[c] && row[c].trim()) {
          prevRow[c] = prevRow[c] ? `${prevRow[c]} ${row[c]}` : row[c];
        }
      }
    } else {
      merged.push(row);
    }
  }

  return merged;
}

function looksLikeData(text: string): boolean {
  const clean = text.replace(/<\/?[a-z]+>/gi, "").trim();
  if (!clean) return false;

  const words = clean.split(/\s+/);
  if (words.length > 4) return true;

  // Contains sentence punctuation followed by space
  if (/[.,;:?!]\s/.test(clean)) return true;

  // Contains verbs/nouns typical of list data
  const verbs = /\b(is|are|was|were|has|have|had|can|will|do|does|did|tummy|tuck|hernia|repair|recovery|months|weeks|days|years|pregnancy|surgeries|fluctuations|muscles|belly|button|waistline|fat|skin)\b/i;
  if (verbs.test(clean) && words.length >= 2) {
    return true;
  }

  return false;
}

/** Build a TableResult from a slice of row groups, reconstructing logical rows */
function buildTable(
  rowGroups: { y: number; items: (PositionedItem & { originalIndex: number })[] }[],
  xTolerance: number,
): TableResult | null {
  // Collect all x-positions to determine column anchors
  const allXValues: number[] = [];
  for (const row of rowGroups) {
    for (const item of row.items) {
      allXValues.push(item.x);
    }
  }
  if (allXValues.length === 0) return null;
  allXValues.sort((a, b) => a - b);

  // Cluster x-positions into column anchors
  const columnAnchors: number[] = [];
  let clusterSum = allXValues[0];
  let clusterCount = 1;

  for (let i = 1; i < allXValues.length; i++) {
    if (allXValues[i] - allXValues[i - 1] <= xTolerance) {
      clusterSum += allXValues[i];
      clusterCount++;
    } else {
      columnAnchors.push(clusterSum / clusterCount);
      clusterSum = allXValues[i];
      clusterCount = 1;
    }
  }
  columnAnchors.push(clusterSum / clusterCount);

  if (columnAnchors.length < 2) {
    return null; // Not a real table
  }

  type TableItem = PositionedItem & { originalIndex: number; col: number };
  const allTableItems: TableItem[] = [];
  const itemIndices = new Set<number>();

  for (const rowGroup of rowGroups) {
    for (const item of rowGroup.items) {
      let bestCol = 0;
      let bestDist = Math.abs(item.x - columnAnchors[0]);

      for (let c = 1; c < columnAnchors.length; c++) {
        const dist = Math.abs(item.x - columnAnchors[c]);
        if (dist < bestDist) {
          bestCol = c;
          bestDist = dist;
        }
      }

      allTableItems.push({
        ...item,
        col: bestCol,
      });
      itemIndices.add(item.originalIndex);
    }
  }

  // Sort items by y descending (top to bottom)
  allTableItems.sort((a, b) => b.y - a.y);

  // Group items into horizontal line groups (yTolerance = 3)
  const lines: { y: number; items: TableItem[] }[] = [];
  if (allTableItems.length > 0) {
    let currentLine = { y: allTableItems[0].y, items: [allTableItems[0]] };
    for (let i = 1; i < allTableItems.length; i++) {
      const item = allTableItems[i];
      if (Math.abs(item.y - currentLine.y) <= 3) {
        currentLine.items.push(item);
      } else {
        lines.push(currentLine);
        currentLine = { y: item.y, items: [item] };
      }
    }
    lines.push(currentLine);
  }

  const logicalRows: string[][] = [];
  let currentLogicalRow: { lastY: (number | null)[]; cellsText: string[][] } | null = null;
  const maxLineGap = 35;

  for (const line of lines) {
    let isContinuation = false;

    if (currentLogicalRow !== null) {
      // It is a continuation if any item in the line is within its column-specific tolerance
      for (const item of line.items) {
        const col = item.col;
        const lastYVal = currentLogicalRow.lastY[col];
        if (lastYVal !== null) {
          const isKeyCol = col === 0 || (columnAnchors.length > 2 && col === 1);
          const toleranceLimit = isKeyCol ? 18 : 35;
          const tolerance = Math.min(toleranceLimit, Math.max(15, item.fontSize * 1.5));
          if (lastYVal - item.y <= tolerance) {
            isContinuation = true;
            break;
          }
        }
      }

      // But a new item in a key column (col 0 or col 1) that is beyond its tolerance forces a new row
      if (isContinuation) {
        for (const item of line.items) {
          const col = item.col;
          const isKeyCol = col === 0 || (columnAnchors.length > 2 && col === 1);
          if (isKeyCol) {
            const lastYVal = currentLogicalRow.lastY[col];
            if (lastYVal !== null) {
              const toleranceLimit = 18;
              const tolerance = Math.max(toleranceLimit, item.fontSize * 1.5);
              if (lastYVal - item.y > tolerance) {
                isContinuation = false;
                break;
              }
            }
          }
        }
      }

      // Stricter check if the current logical row is the header (logicalRows.length === 0)
      if (logicalRows.length === 0 && isContinuation) {
        for (const item of line.items) {
          const plain = item.text.trim();
          if (looksLikeData(plain)) {
            isContinuation = false;
            break;
          }
          const col = item.col;
          const lastYVal = currentLogicalRow.lastY[col];
          if (lastYVal !== null) {
            const gap = lastYVal - item.y;
            if (gap > 15 || gap > item.fontSize * 1.3) {
              isContinuation = false;
              break;
            }
          }
        }
      }
    }

    if (!isContinuation) {
      if (currentLogicalRow !== null) {
        logicalRows.push(currentLogicalRow.cellsText.map(cellTexts => cellTexts.join(" ")));
      }
      currentLogicalRow = {
        lastY: new Array(columnAnchors.length).fill(null),
        cellsText: Array.from({ length: columnAnchors.length }, () => []),
      };
    }

    for (const item of line.items) {
      currentLogicalRow!.cellsText[item.col].push(formatItemText(item));
      currentLogicalRow!.lastY[item.col] = item.y;
    }
  }

  if (currentLogicalRow !== null) {
    logicalRows.push(currentLogicalRow.cellsText.map(cellTexts => cellTexts.join(" ")));
  }

  const cleanedRows = mergeEmptyKeyRows(logicalRows);

  return { rows: cleanedRows, itemIndices };
}

/* -------------------------------------------------------------------------- */
/*  Column detection via x-position clustering                                */
/* -------------------------------------------------------------------------- */

/**
 * Groups items into columns by clustering their x-positions.
 * Two items are in the same column if their x values are within `tolerance` px.
 */
function detectColumns(items: PositionedItem[], tolerance = 30): PositionedItem[][] {
  if (items.length === 0) {
    return [];
  }

  // Collect unique x-start values and cluster them
  const xValues = items.map((item) => item.x).sort((a, b) => a - b);
  const clusters: number[][] = [];
  let currentCluster = [xValues[0]];

  for (let i = 1; i < xValues.length; i++) {
    if (xValues[i] - xValues[i - 1] <= tolerance) {
      currentCluster.push(xValues[i]);
    } else {
      clusters.push(currentCluster);
      currentCluster = [xValues[i]];
    }
  }
  clusters.push(currentCluster);

  // For each cluster, compute the mean x as the column anchor
  const columnAnchors = clusters.map((cluster) => {
    const sum = cluster.reduce((acc, val) => acc + val, 0);
    return sum / cluster.length;
  });

  // Assign each item to the nearest column anchor
  const columns: Map<number, PositionedItem[]> = new Map();
  for (const anchor of columnAnchors) {
    columns.set(anchor, []);
  }

  for (const item of items) {
    let nearestAnchor = columnAnchors[0];
    let nearestDistance = Math.abs(item.x - nearestAnchor);

    for (let i = 1; i < columnAnchors.length; i++) {
      const dist = Math.abs(item.x - columnAnchors[i]);
      if (dist < nearestDistance) {
        nearestAnchor = columnAnchors[i];
        nearestDistance = dist;
      }
    }

    columns.get(nearestAnchor)?.push(item);
  }

  // Sort columns left-to-right, and within each column sort top-to-bottom
  // (PDF y-axis goes bottom-to-top, so higher y = higher on page)
  const sortedColumns = Array.from(columns.entries())
    .sort(([anchorA], [anchorB]) => anchorA - anchorB)
    .map(([, colItems]) => colItems.sort((a, b) => b.y - a.y));

  return sortedColumns;
}

/* -------------------------------------------------------------------------- */
/*  Line merging — group items on the same horizontal line                    */
/* -------------------------------------------------------------------------- */

type TextLine = {
  html: string;
  plainText: string;
  fontSize: number;
  y: number;
};

function mergeIntoLines(items: PositionedItem[], lineTolerance = 3): TextLine[] {
  if (items.length === 0) {
    return [];
  }

  const lines: TextLine[] = [];
  let currentLine: PositionedItem[] = [items[0]];

  const flushLine = (lineItems: PositionedItem[]) => {
    lineItems.sort((a, b) => a.x - b.x);
    const avgFontSize =
      lineItems.reduce((sum, item) => sum + item.fontSize, 0) / lineItems.length;

    const htmlParts: string[] = [];
    const plainParts: string[] = [];
    for (const item of lineItems) {
      htmlParts.push(formatItemText(item));
      plainParts.push(item.text);
    }

    lines.push({
      html: htmlParts.join(" "),
      plainText: plainParts.join(" "),
      fontSize: avgFontSize,
      y: lineItems[0].y,
    });
  };

  for (let i = 1; i < items.length; i++) {
    const prev = currentLine[currentLine.length - 1];
    const curr = items[i];

    // Same line if y values are close (items already sorted top-to-bottom)
    if (Math.abs(prev.y - curr.y) <= lineTolerance) {
      currentLine.push(curr);
    } else {
      flushLine(currentLine);
      currentLine = [curr];
    }
  }

  // Flush last line
  if (currentLine.length > 0) {
    flushLine(currentLine);
  }

  return lines;
}

/* -------------------------------------------------------------------------- */
/*  HTML generation — detect headings, paragraphs, lists, and tables          */
/* -------------------------------------------------------------------------- */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Convert a detected table into an HTML <table> string */
function tableToHtml(rows: string[][]): string {
  const parts: string[] = ["<table>"];

  for (let r = 0; r < rows.length; r++) {
    parts.push("<tr>");
    const tag = r === 0 ? "th" : "td"; // First row = header
    for (const cell of rows[r]) {
      parts.push(`<${tag}>${cell}</${tag}>`);
    }
    parts.push("</tr>");
  }

  parts.push("</table>");
  return parts.join("\n");
}

function linesToHtml(lines: TextLine[]): string {
  if (lines.length === 0) {
    return "";
  }

  // Compute median font size to distinguish headings from body text
  const fontSizes = lines.map((line) => line.fontSize).sort((a, b) => a - b);
  const medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)];
  const headingThreshold = medianFontSize * 1.2;

  // Pre-process lines to merge sentence fragments
  const processedLines: TextLine[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedPlain = line.plainText.trim();
    if (!trimmedPlain) {
      processedLines.push(line);
      continue;
    }

    const startsLowercase = /^[a-z]/.test(trimmedPlain);
    const wordCount = trimmedPlain.split(/\s+/).length;
    const isFragment = startsLowercase && wordCount <= 12;

    if (isFragment) {
      let found = false;
      for (let j = processedLines.length - 1; j >= 0; j--) {
        const prevLine = processedLines[j];
        const prevTrimmed = prevLine.plainText.trim();
        if (!prevTrimmed) continue;

        // Skip headings
        const isHeading = prevLine.fontSize >= headingThreshold && prevTrimmed.length < 200;
        if (isHeading) continue;

        const endsWithSentenceEnder = /[.?!:]["']?\s*$/.test(prevTrimmed) || prevTrimmed.endsWith(":");
        if (!endsWithSentenceEnder) {
          prevLine.plainText = `${prevLine.plainText} ${line.plainText}`;
          prevLine.html = `${prevLine.html} ${line.html}`;
          found = true;
          break;
        }
      }
      if (found) {
        continue; // skipped, since it's merged!
      }
    }

    processedLines.push(line);
  }

  const htmlParts: string[] = [];
  let currentParagraphLines: string[] = [];
  let inList = false;

  const flushParagraph = () => {
    if (currentParagraphLines.length === 0) {
      return;
    }
    const text = currentParagraphLines.join(" ");
    if (text.trim()) {
      htmlParts.push(`<p>${text}</p>`);
    }
    currentParagraphLines = [];
  };

  const flushList = () => {
    if (inList) {
      htmlParts.push("</ul>");
      inList = false;
    }
  };

  for (const line of processedLines) {
    const trimmed = line.plainText.trim();
    if (!trimmed) {
      continue;
    }

    // Detect list items (lines starting with bullet characters or numbered patterns)
    const listMatch = /^(?:[•●◦▪▸\-–—]\s*|(?:\d{1,3})[.)]\s+)(.+)/.exec(trimmed);

    if (listMatch) {
      flushParagraph();
      if (!inList) {
        htmlParts.push("<ul>");
        inList = true;
      }
      let bulletHtml = line.html;
      const matchStart = bulletHtml.indexOf(listMatch[1].substring(0, Math.min(5, listMatch[1].length)));
      if (matchStart >= 0) {
        bulletHtml = bulletHtml.substring(matchStart);
      }
      htmlParts.push(`<li>${bulletHtml}</li>`);
      continue;
    }

    // Non-list line — close any open list
    if (inList) {
      flushList();
    }

    // Detect headings by font size
    if (line.fontSize >= headingThreshold && trimmed.length < 200) {
      flushParagraph();
      // Use h2 for large text, h3 for moderately larger
      const tag = line.fontSize >= medianFontSize * 1.5 ? "h2" : "h3";
      htmlParts.push(`<${tag}>${line.html}</${tag}>`);
      continue;
    }

    // Regular body text — accumulate into a paragraph
    // Start a new paragraph if there's a significant vertical gap
    currentParagraphLines.push(line.html);
  }

  flushList();
  flushParagraph();

  return htmlParts.join("\n");
}

/* -------------------------------------------------------------------------- */
/*  Page processing — tables first, then columns for the rest                 */
/* -------------------------------------------------------------------------- */

function isBulletOrListTable(rows: string[][]): boolean {
  if (rows.length === 0) return false;
  const markerRegex = /^(?:[•●◦▪▸\-–—*]|\d{1,3}[.)]?)$/;
  let markerCount = 0;
  for (let r = 0; r < rows.length; r++) {
    const cell0 = rows[r][0].trim();
    if (!cell0) continue;
    if (markerRegex.test(cell0)) {
      markerCount++;
    }
  }
  const nonSubstantialCol0 = rows.filter(row => row[0].trim().length > 3).length === 0;
  return markerCount >= 1 && nonSubstantialCol0 && rows[0].length <= 2;
}

function cleanBulletMarker(text: string): string {
  let cleaned = text.trim();
  // Remove wrapping tags around bullet marker at the beginning
  cleaned = cleaned.replace(/^(?:<[a-z]+>)*(?:[•●◦▪▸–—*]|[-]\s|\d{1,3}[.)])(?:<\/[a-z]+>)*\s*/gi, "");
  return cleaned.trim();
}

function extractListItems(text: string): string[] {
  const refinedRegex = /(?:^|\s+)(?:<[a-z]+>)*(?:[•●◦▪▸–—*]|[-]\s|\d{1,3}[.)])(?:<\/[a-z]+>)*\s*/gi;
  const items: string[] = [];
  const matches: { index: number; text: string }[] = [];
  let m;
  while ((m = refinedRegex.exec(text)) !== null) {
    matches.push({ index: m.index, text: m[0] });
  }

  if (matches.length === 0) {
    return [text];
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].text.length;
    const end = (i + 1 < matches.length) ? matches[i + 1].index : text.length;
    const itemText = text.substring(start, end).trim();
    if (itemText) {
      items.push(itemText);
    }
  }

  return items.length > 0 ? items : [text];
}

function getSemanticSimilarity(str1: string, str2: string): number {
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "of", "is", "are", "was", "were", "be", "been", "this", "that", "it", "they", "we", "you", "i"]);
  const getWords = (str: string) => {
    const clean = str.replace(/<\/?[a-z]+>/gi, " ").toLowerCase();
    return new Set(
      clean.split(/[^a-z0-9]+/i).filter(w => w.length > 2 && !stopWords.has(w))
    );
  };

  const set1 = getWords(str1);
  const set2 = getWords(str2);

  if (set1.size === 0 || set2.size === 0) return 0;

  let intersection = 0;
  for (const w of set1) {
    if (set2.has(w)) {
      intersection++;
    }
  }

  const union = set1.size + set2.size - intersection;
  return intersection / union;
}

function isTableOfMergedLists(rows: string[][]): boolean {
  if (rows.length !== 2) return false;
  // If first row has multiple columns, it's not a single-column table of lists
  if (rows[0].length !== 1 || rows[1].length !== 1) return false;

  const row0Items = extractListItems(rows[0][0]);
  const row1Items = extractListItems(rows[1][0]);

  const hasBullets0 = row0Items.length >= 2 || /^[•●◦▪▸\-–—*]/.test(rows[0][0].trim());
  const hasBullets1 = row1Items.length >= 2 || /^[•●◦▪▸\-–—*]/.test(rows[1][0].trim());

  if (!hasBullets0 || !hasBullets1) return false;

  // Check semantic similarity to ensure they are distinct lists
  return getSemanticSimilarity(rows[0][0], rows[1][0]) < 0.3;
}

function isSideBySideLists(rows: string[][]): boolean {
  if (rows.length < 2 || rows[0].length !== 2) return false;

  const markerRegex = /^(?:<[a-z]+>)*(?:[•●◦▪▸\-–—*]|[-]\s|\d{1,3}[.)])/i;
  let col0Markers = 0;
  let col1Markers = 0;

  for (const row of rows) {
    if (markerRegex.test(row[0].trim())) {
      col0Markers++;
    }
    if (row.length > 1 && markerRegex.test(row[1].trim())) {
      col1Markers++;
    }
  }

  const threshold = rows.length * 0.4;
  return col0Markers >= threshold && col1Markers >= threshold;
}

function listItemsToHtml(items: string[]): string {
  let numberedCount = 0;
  const numberRegex = /^(?:<[a-z]+>)*\d{1,3}[.)]/i;
  for (const item of items) {
    if (numberRegex.test(item.trim())) {
      numberedCount++;
    }
  }

  const isNumbered = numberedCount >= items.length * 0.5;
  const tag = isNumbered ? "ol" : "ul";
  const parts: string[] = [`<${tag}>`];

  for (const item of items) {
    const cleaned = cleanBulletMarker(item);
    if (cleaned) {
      parts.push(`<li>${cleaned}</li>`);
    }
  }
  parts.push(`</${tag}>`);
  return parts.join("\n");
}

function listTableToHtml(rows: string[][]): string {
  const parts: string[] = ["<ul>"];
  for (const row of rows) {
    const itemText = row[1] || row[0];
    parts.push(`<li>${itemText.trim()}</li>`);
  }
  parts.push("</ul>");
  return parts.join("\n");
}

function mergeConsecutiveTables(blocks: PageBlock[]): PageBlock[] {
  if (blocks.length <= 1) return blocks;

  const merged: PageBlock[] = [blocks[0]];

  for (let i = 1; i < blocks.length; i++) {
    const curr = blocks[i];
    const prev = merged[merged.length - 1];

    if (prev.type === "table" && curr.type === "table") {
      const colCountPrev = prev.rows[0].length;
      const colCountCurr = curr.rows[0].length;

      if (colCountPrev === colCountCurr) {
        const isHeaderRepeated = prev.rows[0].join("|").toLowerCase() === curr.rows[0].join("|").toLowerCase();
        const startRowIdx = isHeaderRepeated ? 1 : 0;

        prev.rows = [...prev.rows, ...curr.rows.slice(startRowIdx)];
      } else {
        merged.push(curr);
      }
    } else {
      merged.push(curr);
    }
  }

  return merged;
}

type PageBlock = { type: "lines"; lines: TextLine[] } | { type: "table"; rows: string[][] };

/**
 * Process a page's items: detect tables first, then handle remaining items
 * through column detection and line merging.
 */
function processPageItems(items: PositionedItem[]): PageBlock[] {
  if (items.length === 0) {
    return [];
  }

  // Step 1: Detect tables
  const tables = detectTables(items);

  // Collect all indices that belong to tables
  const tableItemIndices = new Set<number>();
  for (const table of tables) {
    for (const idx of table.itemIndices) {
      tableItemIndices.add(idx);
    }
  }

  // Step 2: Separate items into table vs. non-table
  const nonTableItems = items.filter((_, idx) => !tableItemIndices.has(idx));

  // Step 3: We need to interleave tables and non-table content in page order.
  // Sort blocks by y-position (top-to-bottom, so higher y first in PDF coords).
  const blocks: { y: number; block: PageBlock }[] = [];

  // Add table blocks (use the y of the first row for ordering)
  for (const table of tables) {
    // Find the topmost y among table items
    let topY = -Infinity;
    for (const idx of table.itemIndices) {
      if (items[idx].y > topY) {
        topY = items[idx].y;
      }
    }
    blocks.push({ y: topY, block: { type: "table", rows: table.rows } });
  }

  // Add non-table content (run through the column/line pipeline)
  if (nonTableItems.length > 0) {
    // Group non-table items into contiguous vertical bands to maintain interleaving
    // Sort by y descending (top of page first)
    const sortedNonTable = [...nonTableItems].sort((a, b) => b.y - a.y);

    // Find the y-ranges occupied by tables to split non-table content
    const tableYRanges: { top: number; bottom: number }[] = [];
    for (const table of tables) {
      let top = -Infinity;
      let bottom = Infinity;
      for (const idx of table.itemIndices) {
        if (items[idx].y > top) top = items[idx].y;
        if (items[idx].y < bottom) bottom = items[idx].y;
      }
      tableYRanges.push({ top, bottom });
    }

    // If no tables, process all non-table items as one block
    if (tableYRanges.length === 0) {
      const columns = detectColumns(nonTableItems);
      const lines: TextLine[] = [];
      for (const col of columns) {
        lines.push(...mergeIntoLines(col));
      }
      if (lines.length > 0) {
        const topY = sortedNonTable[0]?.y ?? 0;
        blocks.push({ y: topY, block: { type: "lines", lines } });
      }
    } else {
      // Split non-table items into segments between/around tables
      // and process each segment separately through column detection
      const segments: PositionedItem[][] = [];
      let currentSegment: PositionedItem[] = [];

      for (const item of sortedNonTable) {
        // Check if this item is inside any table's y-range (with a small buffer)
        const insideTable = tableYRanges.some(
          (range) => item.y <= range.top + 5 && item.y >= range.bottom - 5,
        );

        if (insideTable) {
          // Flush current segment
          if (currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = [];
          }
          continue;
        }

        currentSegment.push(item);
      }
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }

      for (const segment of segments) {
        const columns = detectColumns(segment);
        const lines: TextLine[] = [];
        for (const col of columns) {
          lines.push(...mergeIntoLines(col));
        }
        if (lines.length > 0) {
          const topY = segment[0]?.y ?? 0;
          blocks.push({ y: topY, block: { type: "lines", lines } });
        }
      }
    }
  }

  // Sort blocks top-to-bottom (higher y = higher on page in PDF)
  blocks.sort((a, b) => b.y - a.y);

  return blocks.map((b) => b.block);
}

/* -------------------------------------------------------------------------- */
/*  Main extraction function                                                  */
/* -------------------------------------------------------------------------- */

export type PdfExtractionResult = {
  html: string;
  plainText: string;
  pageCount: number;
};

/**
 * Extract text from a PDF file with column-aware reading order and table detection.
 *
 * @param file  A File object (from `<input type="file">`)
 * @returns     Extracted HTML, plain text, and page count
 */
export async function extractPdfContent(file: File): Promise<PdfExtractionResult> {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const pagesData: { pageNum: number; pageHeight: number; items: PositionedItem[] }[] = [];
  const lineFrequencies = new Map<string, number>();

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();
    const items = extractPositionedItems(textContent);

    pagesData.push({
      pageNum,
      pageHeight: viewport.height,
      items,
    });

    const lines = mergeIntoLines(items);
    for (const line of lines) {
      const text = line.plainText.trim().toLowerCase();
      if (text.length > 4) {
        lineFrequencies.set(text, (lineFrequencies.get(text) || 0) + 1);
      }
    }
  }

  const repeatedLines = new Set<string>();
  for (const [text, freq] of lineFrequencies.entries()) {
    if (freq >= 2) {
      repeatedLines.add(text);
    }
  }

  const allBlocks: PageBlock[] = [];

  for (const page of pagesData) {
    const filteredItems = page.items.filter((item) => {
      const textLower = item.text.trim().toLowerCase();
      const isMargin = item.y > page.pageHeight - 80 || item.y < 80;
      if (repeatedLines.has(textLower) && isMargin) {
        return false;
      }
      if (textLower.includes("visit:") || textLower.includes("drdivyaplasticsurgeon.com")) {
        return false;
      }
      return true;
    });

    const pageBlocks = processPageItems(filteredItems);
    allBlocks.push(...pageBlocks);
  }

  const mergedBlocks = mergeConsecutiveTables(allBlocks);

  // Step 4: Merge paragraphs split around tables
  for (let i = 0; i < mergedBlocks.length - 2; i++) {
    const blockA = mergedBlocks[i];
    const blockB = mergedBlocks[i + 1];
    const blockC = mergedBlocks[i + 2];

    if (blockA.type === "lines" && blockB.type === "table" && blockC.type === "lines") {
      const linesA = blockA.lines.filter(l => l.plainText.trim());
      const linesC = blockC.lines.filter(l => l.plainText.trim());

      if (linesA.length > 0 && linesC.length > 0) {
        const lastLineA = linesA[linesA.length - 1];
        const firstLineC = linesC[0];

        const lastText = lastLineA.plainText.trim();
        const firstText = firstLineC.plainText.trim();

        const isLastLineAIncomplete = !/[.?!:]["']?\s*$/.test(lastText);
        const isFirstLineCFragment = /^[a-z]/.test(firstText);

        if (isLastLineAIncomplete && isFirstLineCFragment) {
          lastLineA.plainText = `${lastLineA.plainText} ${firstLineC.plainText}`;
          lastLineA.html = `${lastLineA.html} ${firstLineC.html}`;

          const idx = blockC.lines.indexOf(firstLineC);
          if (idx !== -1) {
            blockC.lines.splice(idx, 1);
          }
        }
      }
    }
  }

  const allHtmlParts: string[] = [];
  const allPlainTextLines: string[] = [];

  for (const block of mergedBlocks) {
    if (block.type === "table") {
      if (isTableOfMergedLists(block.rows)) {
        const list1Items = extractListItems(block.rows[0][0]);
        const list2Items = extractListItems(block.rows[1][0]);
        
        allHtmlParts.push(listItemsToHtml(list1Items));
        allHtmlParts.push(listItemsToHtml(list2Items));
        
        for (const item of [...list1Items, ...list2Items]) {
          allPlainTextLines.push(cleanBulletMarker(item).replace(/<\/?[a-z]+>/gi, ""));
        }
      } else if (isSideBySideLists(block.rows)) {
        const col0Items = block.rows.map(r => r[0]).filter(Boolean);
        const col1Items = block.rows.map(r => r[1]).filter(Boolean);
        
        allHtmlParts.push(listItemsToHtml(col0Items));
        allHtmlParts.push(listItemsToHtml(col1Items));
        
        for (const item of [...col0Items, ...col1Items]) {
          allPlainTextLines.push(cleanBulletMarker(item).replace(/<\/?[a-z]+>/gi, ""));
        }
      } else if (isBulletOrListTable(block.rows)) {
        const items = block.rows.map(row => row[1] || row[0]);
        allHtmlParts.push(listItemsToHtml(items));
        for (const item of items) {
          allPlainTextLines.push(cleanBulletMarker(item).replace(/<\/?[a-z]+>/gi, ""));
        }
      } else {
        allHtmlParts.push(tableToHtml(block.rows));
        for (const row of block.rows) {
          const plainRow = row.map((cell) => cell.replace(/<\/?[a-z]+>/gi, ""));
          allPlainTextLines.push(plainRow.join("\t"));
        }
      }
    } else {
      allHtmlParts.push(linesToHtml(block.lines));
      for (const line of block.lines) {
        if (line.plainText.trim()) {
          allPlainTextLines.push(line.plainText);
        }
      }
    }
  }

  const html = allHtmlParts.filter(Boolean).join("\n");
  const plainText = allPlainTextLines.join("\n");

  return { html, plainText, pageCount: pdf.numPages };
}
