"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __drDivyaCalendlyTrackedEvents?: Set<string>;
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

const CALENDLY_URL =
  "https://calendly.com/drdivyaplasticsurgeon/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d1117&text_color=e2e8f0&primary_color=b8972a";

const GOOGLE_ADS_SEND_TO = "AW-18459222154/fq-GCNqttP4CEIrBheJE";
const CALENDLY_TRACKED_EVENTS_KEY = "__drDivyaCalendlyTrackedEvents";

function isCalendlyOrigin(origin: string) {
  return origin === "https://calendly.com" || origin.endsWith(".calendly.com");
}

function getScheduledEventUri(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const name = record.event ?? record.name ?? record.type;
  if (name === "calendly.event_scheduled") {
    const payload = record.payload && typeof record.payload === "object"
      ? record.payload as Record<string, unknown>
      : record;
    const event = payload.event ?? payload.eventUri ?? payload.scheduled_event;
    if (typeof event === "string") return event;
    if (event && typeof event === "object" && "uri" in event) {
      const uri = (event as { uri?: unknown }).uri;
      if (typeof uri === "string") return uri;
    }
  }

  for (const child of Object.values(record)) {
    const uri = getScheduledEventUri(child);
    if (uri) return uri;
  }
  return null;
}

function getTrackedCalendlyEvents() {
  window[CALENDLY_TRACKED_EVENTS_KEY] ??= new Set<string>();
  return window[CALENDLY_TRACKED_EVENTS_KEY];
}

export default function CalendlyBookingFrame({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCalendlyMessage = (message: MessageEvent) => {
      if (!isCalendlyOrigin(message.origin)) return;

      let data: unknown;
      try {
        data = typeof message.data === "string" ? JSON.parse(message.data) : message.data;
      } catch {
        return;
      }

      const eventUri = getScheduledEventUri(data);
      if (!eventUri) return;

      // Calendly success is reported by the client-side calendly.event_scheduled
      // message. Share the event set across all widget instances and lifecycles.
      const trackedEvents = getTrackedCalendlyEvents();
      if (trackedEvents.has(eventUri)) return;
      trackedEvents.add(eventUri);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "appointment_confirmation_validated" });
      const conversionPayload = {
        send_to: GOOGLE_ADS_SEND_TO,
        transaction_id: eventUri,
        currency: "INR",
      };

      if (window.gtag) {
        window.gtag("event", "conversion", conversionPayload);
      } else {
        window.dataLayer.push(["event", "conversion", conversionPayload]);
      }
    };

    window.addEventListener("message", handleCalendlyMessage);

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

    return () => window.removeEventListener("message", handleCalendlyMessage);
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
