"use client";

import { useEffect, useRef } from "react";
import { authorizeCalendlyBooking } from "@/lib/client-api";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CALENDLY_URL =
  "https://calendly.com/drdivyaplasticsurgeon/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d1117&text_color=e2e8f0&primary_color=b8972a&redirect_url=https%3A%2F%2Fdrdivyaplasticsurgeon.com%2Fapi%2Fappointments%2Fcalendly%2Fredirect";

function getCalendlyUri(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "uri" in value) {
    const uri = (value as { uri?: unknown }).uri;
    return typeof uri === "string" ? uri : null;
  }
  return null;
}

function findScheduledPayload(value: unknown, seen = new Set<object>()): { eventUri: string; inviteeUri?: string } | null {
  if (!value || typeof value !== "object") return null;
  if (seen.has(value)) return null;
  seen.add(value);

  const record = value as Record<string, unknown>;
  const eventName = record.event ?? record.name ?? record.type;
  if (eventName === "calendly.event_scheduled") {
    const payload = record.payload && typeof record.payload === "object"
      ? record.payload as Record<string, unknown>
      : record;
    const eventUri = getCalendlyUri(payload.event ?? payload.eventUri ?? payload.scheduled_event);
    const inviteeUri = getCalendlyUri(payload.invitee ?? payload.inviteeUri);
    if (eventUri) return { eventUri, inviteeUri: inviteeUri ?? undefined };
  }

  for (const child of Object.values(record)) {
    const result = findScheduledPayload(child, seen);
    if (result) return result;
  }
  return null;
}

export default function CalendlyBookingFrame({ className = "" }: { className?: string }) {
  const handledEvents = useRef(new Set<string>());

  useEffect(() => {
    const handleMessage = async (message: MessageEvent) => {
      let data: { event?: string; payload?: { event?: unknown; invitee?: unknown } };
      try {
        data = typeof message.data === "string"
          ? JSON.parse(message.data) as { event?: string; payload?: { event?: unknown; invitee?: unknown } }
          : message.data as { event?: string; payload?: { event?: unknown; invitee?: unknown } };
      } catch {
        return;
      }
      const scheduled = findScheduledPayload(data);
      if (!scheduled || handledEvents.current.has(scheduled.eventUri)) return;
      const { eventUri, inviteeUri } = scheduled;
      handledEvents.current.add(eventUri);

      const result = await authorizeCalendlyBooking(eventUri);
      if (result.ok && result.conversionId) {
        window.gtag?.("event", "conversion", {
          send_to: "AW-18459222154/fq-GCNqttP4CEIrBheJE",
          transaction_id: result.conversionId,
          currency: "INR",
        });
      }
      void inviteeUri;
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <iframe
      src={CALENDLY_URL}
      width="100%"
      height="760"
      frameBorder="0"
      title="Book appointment with Dr. Divya Sai Narsingam"
      loading="lazy"
      className={`w-full block ${className}`}
      style={{ minHeight: "760px" }}
    />
  );
}