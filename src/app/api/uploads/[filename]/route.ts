import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

interface Props {
  params: Promise<{ filename: string }>;
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, { params }: Props) {
  const { filename } = await params;

  // Prevent directory traversal attacks
  const safeFilename = path.basename(filename);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, safeFilename);

  try {
    const buffer = await readFile(filePath);

    // Determine the content-type from file extension
    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") {
      contentType = "image/png";
    } else if (ext === ".webp") {
      contentType = "image/webp";
    } else if (ext === ".gif") {
      contentType = "image/gif";
    } else if (ext === ".avif") {
      contentType = "image/avif";
    } else if (ext === ".svg") {
      contentType = "image/svg+xml";
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Image Not Found", { status: 404 });
  }
}
