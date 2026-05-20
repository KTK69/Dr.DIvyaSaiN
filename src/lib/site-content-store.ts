import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/lib/site-content";
import {
  mergeWithDefaults,
  type SiteContentEnvelope,
} from "@/lib/site-content-utils";

const BLOB_PATHNAME = "site-content/content.json";
const LOCAL_FILE_PATH = path.join(process.cwd(), "data", "site-content.runtime.json");

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function shouldUseBlobStorage() {
  return hasBlobToken() && process.env.STORAGE_PROVIDER !== "local";
}

export function getSiteContentPersistenceDiagnostics() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    vercelEnv: process.env.VERCEL_ENV ?? "unknown",
    hasBlobToken: hasBlobToken(),
    storageProvider: shouldUseBlobStorage() ? "vercel-blob" : "local-file",
    localFilePath: LOCAL_FILE_PATH,
    vercelProjectProductionUrl:
      process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
    vercelUrl: process.env.VERCEL_URL ?? null,
  };
}

function createEnvelope(content: SiteContent): SiteContentEnvelope {
  return {
    content,
    updatedAt: new Date().toISOString(),
  };
}

function withDefaults(content: unknown): SiteContent {
  return mergeWithDefaults(DEFAULT_SITE_CONTENT, content);
}

async function readFromBlob(): Promise<SiteContentEnvelope | null> {
  const result = await get(BLOB_PATHNAME, {
    access: "private",
    useCache: false,
  });

  if (!result || result.statusCode !== 200) {
    return null;
  }

  const text = await new Response(result.stream).text();
  const parsed = JSON.parse(text) as Partial<SiteContentEnvelope> | SiteContent;

  if ("content" in parsed && parsed.content) {
    return {
      content: withDefaults(parsed.content),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  }

  return createEnvelope(withDefaults(parsed));
}

async function writeToBlob(envelope: SiteContentEnvelope) {
  await put(BLOB_PATHNAME, JSON.stringify(envelope, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });
}

async function readFromLocalFile(): Promise<SiteContentEnvelope | null> {
  try {
    const raw = await readFile(LOCAL_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContentEnvelope> | SiteContent;

    if ("content" in parsed && parsed.content) {
      return {
        content: withDefaults(parsed.content),
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      };
    }

    return createEnvelope(withDefaults(parsed));
  } catch {
    return null;
  }
}

async function writeToLocalFile(envelope: SiteContentEnvelope) {
  await mkdir(path.dirname(LOCAL_FILE_PATH), { recursive: true });
  await writeFile(LOCAL_FILE_PATH, JSON.stringify(envelope, null, 2), "utf8");
}

export async function getStoredSiteContent(): Promise<SiteContentEnvelope> {
  try {
    const envelope = shouldUseBlobStorage()
      ? await readFromBlob()
      : await readFromLocalFile();

    return envelope ?? createEnvelope(DEFAULT_SITE_CONTENT);
  } catch {
    return createEnvelope(DEFAULT_SITE_CONTENT);
  }
}

export async function saveStoredSiteContent(
  content: SiteContent,
): Promise<SiteContentEnvelope> {
  const envelope = createEnvelope(withDefaults(content));

  if (shouldUseBlobStorage()) {
    await writeToBlob(envelope);
  } else {
    await writeToLocalFile(envelope);
  }

  revalidateSiteContent(envelope.content);
  return envelope;
}

function revalidateSiteContent(content: SiteContent) {
  const staticPaths = [
    "/",
    "/about",
    "/aboutus",
    "/experience",
    "/drvideo",
    "/doctors-talk",
    "/reviews",
    "/testimonials",
    "/contact",
    "/contactus",
    "/blog",
    "/services",
  ];

  for (const route of staticPaths) {
    revalidatePath(route);
  }

  for (const blog of content.blog) {
    if (blog.slug) {
      revalidatePath(`/blog/${blog.slug}`);
    }
  }

  for (const service of content.services) {
    if (service.slug) {
      revalidatePath(`/services/${service.slug}`);
      revalidatePath(`/services/cosmetic/${service.slug}`);
      revalidatePath(`/services/reconstructive/${service.slug}`);
    }
  }
}

export function isSiteContentPersistenceConfigured() {
  return true;
}
