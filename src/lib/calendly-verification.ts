import "server-only";

import { issueAppointmentConfirmation } from "@/lib/appointment-confirmation";

export function isCalendlyScheduledEventUri(value: unknown): value is string {
  return typeof value === "string" && /^https:\/\/api\.calendly\.com\/scheduled_events\//.test(value);
}

export async function verifyCalendlyEvent(input: {
  eventUri: string;
  inviteeUri?: string;
}) {
  const token = process.env.CALENDLY_API_TOKEN?.trim();
  if (!token || !isCalendlyScheduledEventUri(input.eventUri)) return null;

  const eventResponse = await fetch(input.eventUri, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!eventResponse.ok) return null;

  const event = (await eventResponse.json()) as {
    resource?: { uri?: string; status?: string; name?: string; start_time?: string };
  };
  if (event.resource?.status !== "active") return null;

  return issueAppointmentConfirmation({
    source: "calendly",
    sourceId: input.inviteeUri || input.eventUri,
    metadata: {
      bookingMethod: "Calendly",
      service: event.resource.name,
      calendlyEvent: event.resource.uri ?? input.eventUri,
      scheduledTime: event.resource.start_time,
    },
  });
}