"use client";

import { useEffect, useRef } from "react";
import { authorizeCalendlyBooking } from "@/lib/client-api";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __calendlyTrackedEvents?: Set<string>;
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

const CALENDLY_URL =
  "https://calendly.com/drdivyaplasticsurgeon/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d1117&text_color=e2e8f0&primary_color=b8972a&redirect_url=https%3A%2F%2Fdrdivyaplasticsurgeon.com%2Fapi%2Fappointments%2Fcalendly%2Fredirect";

const GOOGLE_ADS_SEND_TO = "AW-18459222154/fq-GCNqttP4CEIrBheJE";

function isCalendlyOrigin(origin: string) {
  return origin === "https://calendly.com" || origin.endsWith(".calendly.com");
}

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

function fireCalendlyConversion(transactionId: string) {
  const conversionPayload = {
    send_to: GOOGLE_ADS_SEND_TO,
    transaction_id: transactionId,
    currency: "INR",
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "appointment_confirmation_validated",
    booking_method: "calendly",
  });

  if (window.gtag) {
    window.gtag("event", "conversion", conversionPayload);
  } else {
    window.dataLayer.push(["event", "conversion", conversionPayload]);
  }
}

function claimCalendlyEvent(eventUri: string) {
  window.__calendlyTrackedEvents ??= new Set<string>();
  if (window.__calendlyTrackedEvents.has(eventUri)) return false;
  window.__calendlyTrackedEvents.add(eventUri);
  return true;
}

export default function CalendlyBookingFrame({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handledEvents = useRef(new Set<string>());

  useEffect(() => {
    const handleMessage = async (message: MessageEvent) => {
      if (!isCalendlyOrigin(message.origin)) return;

      let data: unknown;
      try {
        data = typeof message.data === "string" ? JSON.parse(message.data) : message.data;
      } catch {
        return;
      }

      const scheduled = findScheduledPayload(data);
      if (!scheduled || handledEvents.current.has(scheduled.eventUri)) return;
      handledEvents.current.add(scheduled.eventUri);

      // Fire immediately from Calendly's confirmed browser event; API verification
      // should not block Ads tracking if the redirect races the POST request.
      if (claimCalendlyEvent(scheduled.eventUri)) {
        fireCalendlyConversion(scheduled.eventUri);
      }
      void authorizeCalendlyBooking(scheduled.eventUri, scheduled.inviteeUri);
    };

    window.addEventListener("message", handleMessage);

    const initializeWidget = () => {
      if (!containerRef.current || !window.Calendly) return false;
      containerRef.current.replaceChildren();
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: containerRef.current,
      });
      return true;
    };

    if (!initializeWidget()) {
      const script = document.querySelector<HTMLScriptElement>(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]',
      );
      const retry = window.setInterval(() => {
        if (initializeWidget()) window.clearInterval(retry);
      }, 100);
      script?.addEventListener("load", initializeWidget, { once: true });
      window.setTimeout(() => window.clearInterval(retry), 10000);
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`calendly-inline-widget w-full block ${className}`}
      style={{ minWidth: "320px", height: "760px" }}
      title="Book appointment with Dr. Divya Sai Narsingam"
    />
  );
}