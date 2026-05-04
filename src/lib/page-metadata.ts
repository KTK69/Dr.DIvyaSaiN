import "server-only";

import type { Metadata } from "next";
import { getStoredSiteContent } from "@/lib/site-content-store";
import { buildEditablePageMetadata } from "@/lib/seo";
import type { PageSeoContent } from "@/lib/site-content";

export async function getEditablePageMetadata(
  key: keyof PageSeoContent,
): Promise<Metadata> {
  const { content } = await getStoredSiteContent();
  return buildEditablePageMetadata(content.pageSeo[key]);
}
