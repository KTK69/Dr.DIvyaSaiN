import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR =
  process.env.SITE_CONTENT_DATA_DIR?.trim() || path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "appointment-confirmations.json");
const LOCK_PATH = `${STORE_PATH}.lock`;
const TOKEN_TTL_MS = 15 * 60 * 1000;

type ConfirmationRecord = {
  id: string;
  tokenHash: string;
  source: "native-form" | "calendly";
  sourceId: string;
  metadata: Record<string, string>;
  createdAt: string;
  expiresAt: string;
  consumedAt?: string;
};

type ConfirmationStore = {
  confirmations: ConfirmationRecord[];
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function readStore(): Promise<ConfirmationStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as ConfirmationStore;
    return Array.isArray(parsed.confirmations) ? parsed : { confirmations: [] };
  } catch {
    return { confirmations: [] };
  }
}

async function writeStore(store: ConfirmationStore) {
  await mkdir(DATA_DIR, { recursive: true });
  const temporaryPath = `${STORE_PATH}.${process.pid}.${randomBytes(8).toString("hex")}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(store, null, 2), "utf8");
  await rename(temporaryPath, STORE_PATH);
}

async function withStoreLock<T>(operation: () => Promise<T>): Promise<T> {
  await mkdir(DATA_DIR, { recursive: true });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      await mkdir(LOCK_PATH);
      try {
        return await operation();
      } finally {
        await rm(LOCK_PATH, { recursive: true, force: true });
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }

  throw new Error("Appointment confirmation store is busy.");
}

export async function issueAppointmentConfirmation(input: {
  source: ConfirmationRecord["source"];
  sourceId: string;
  metadata?: Record<string, string | undefined>;
}) {
  return withStoreLock(async () => {
    const store = await readStore();
    const existing = store.confirmations.find(
      (record) => record.source === input.source && record.sourceId === input.sourceId,
    );

    if (existing) {
      return { id: existing.id, token: null };
    }

    const token = randomBytes(32).toString("base64url");
    const now = new Date();
    const record: ConfirmationRecord = {
      id: randomBytes(16).toString("hex"),
      tokenHash: hashToken(token),
      source: input.source,
      sourceId: input.sourceId,
      metadata: Object.fromEntries(
        Object.entries(input.metadata ?? {}).filter(([, value]) => value),
      ) as Record<string, string>,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + TOKEN_TTL_MS).toISOString(),
    };

    store.confirmations = store.confirmations.filter(
      (item) => new Date(item.expiresAt).getTime() > now.getTime() || !item.consumedAt,
    );
    store.confirmations.push(record);
    await writeStore(store);
    return { id: record.id, token };
  });
}

export async function consumeAppointmentConfirmation(token: string) {
  if (!token || token.length > 200) return null;

  return withStoreLock(async () => {
    const store = await readStore();
    const record = store.confirmations.find((item) => item.tokenHash === hashToken(token));
    if (!record || record.consumedAt || new Date(record.expiresAt).getTime() <= Date.now()) {
      return null;
    }

    record.consumedAt = new Date().toISOString();
    await writeStore(store);
    return record;
  });
}