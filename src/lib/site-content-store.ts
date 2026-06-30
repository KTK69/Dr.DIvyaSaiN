import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import {
  CLIENT_FALLBACK_SITE_CONTENT,
  DEFAULT_SITE_CONTENT,
  type SiteContent,
} from "@/lib/site-content";
import {
  mergeStoredSiteContent,
  type SiteContentEnvelope,
} from "@/lib/site-content-utils";
import { getBlogRouteSlug } from "@/lib/blog-links";

const DATA_DIR =
  process.env.SITE_CONTENT_DATA_DIR?.trim() ||
  path.join(process.cwd(), "data");
const LOCAL_FILE_PATH = path.join(DATA_DIR, "site-content.runtime.json");

export function getSiteContentPersistenceDiagnostics() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    storageProvider: "local-file" as const,
    localFilePath: LOCAL_FILE_PATH,
    dataDirectory: DATA_DIR,
  };
}

function createEnvelope(content: SiteContent): SiteContentEnvelope {
  return {
    content,
    updatedAt: new Date().toISOString(),
  };
}

function withStoredContent(content: unknown): SiteContent {
  return mergeStoredSiteContent(DEFAULT_SITE_CONTENT, content);
}

function emptyPublicContent(): SiteContent {
  return mergeStoredSiteContent(DEFAULT_SITE_CONTENT, CLIENT_FALLBACK_SITE_CONTENT);
}

async function readFromLocalFile(): Promise<SiteContentEnvelope | null> {
  try {
    const raw = await readFile(LOCAL_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContentEnvelope> | SiteContent;

    if ("content" in parsed && parsed.content) {
      return {
        content: withStoredContent(parsed.content),
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      };
    }

    return createEnvelope(withStoredContent(parsed));
  } catch {
    return null;
  }
}

async function writeToLocalFile(envelope: SiteContentEnvelope) {
  await mkdir(path.dirname(LOCAL_FILE_PATH), { recursive: true });
  const payload = JSON.stringify(envelope, null, 2);
  const tempPath = `${LOCAL_FILE_PATH}.tmp`;

  await writeFile(tempPath, payload, "utf8");
  await rename(tempPath, LOCAL_FILE_PATH);

  const verified = await readFromLocalFile();
  if (!verified) {
    throw new Error(`Site content was written but could not be read back from ${LOCAL_FILE_PATH}`);
  }

  if (verified.updatedAt !== envelope.updatedAt) {
    throw new Error("Site content read-back verification failed (timestamp mismatch).");
  }
}

export async function getStoredSiteContent(): Promise<SiteContentEnvelope> {
  try {
    const envelope = await readFromLocalFile();
    return envelope ?? createEnvelope(emptyPublicContent());
  } catch {
    return createEnvelope(emptyPublicContent());
  }
}

export async function saveStoredSiteContent(
  content: SiteContent,
): Promise<SiteContentEnvelope> {
  const envelope = createEnvelope(withStoredContent(content));
  await writeToLocalFile(envelope);
  revalidateSiteContent(envelope.content);
  return envelope;
}

function revalidateSiteContent(content: SiteContent) {
  revalidatePath("/", "layout");

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
    "/plastic-surgeon-banjarahills",
    "/admin",
    "/before-after",
  ];

  for (const route of staticPaths) {
    revalidatePath(route);
  }

  for (const blog of content.blog) {
    const routeSlug = getBlogRouteSlug(blog);
    if (routeSlug) {
      revalidatePath(`/blog/${routeSlug}`);
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
