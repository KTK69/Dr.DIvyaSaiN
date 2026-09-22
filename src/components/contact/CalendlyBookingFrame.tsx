"use client";

import { useEffect, useRef } from "react";
import { authorizeCalendlyBooking } from "@/lib/client-api";

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
      const eventName = data?.event ?? (data as { name?: string })?.name;
      if (eventName !== "calendly.event_scheduled") return;

      const eventUri = getCalendlyUri(data?.payload?.event);
      const inviteeUri = getCalendlyUri(data?.payload?.invitee);
      if (!eventUri || handledEvents.current.has(eventUri)) return;
      handledEvents.current.add(eventUri);

      const result = await authorizeCalendlyBooking(eventUri);
      if (result.ok && result.confirmationToken) {
        window.location.assign(
          `/appointment-thank-you?token=${encodeURIComponent(result.confirmationToken)}`,
        );
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