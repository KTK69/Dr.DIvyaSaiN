import "server-only";

import { issueAppointmentConfirmation } from "@/lib/appointment-confirmation";

export function isCalendlyScheduledEventUri(value: unknown): value is string {
  return typeof value === "string" && /^https:\/\/api\.calendly\.com\/scheduled_events\//.test(value);
}

function getCalendlyResourceUri(value: string | undefined, resource: "scheduled_events" | "invitees") {
  if (!value) return undefined;
  if (resource === "scheduled_events" && isCalendlyScheduledEventUri(value)) return value;
  if (resource === "invitees" && /^https:\/\/api\.calendly\.com\/invitees\//.test(value)) return value;

  const identifier = value.split("/").pop();
  if (!identifier || !/^[a-zA-Z0-9_-]+$/.test(identifier)) return undefined;
  return `https://api.calendly.com/${resource}/${identifier}`;
}

export async function verifyCalendlyEvent(input: {
  eventUri: string;
  inviteeUri?: string;
}) {
  const token = process.env.CALENDLY_API_TOKEN?.trim();
  const eventUri = getCalendlyResourceUri(input.eventUri, "scheduled_events");
  if (!token || !eventUri) return null;

  const eventResponse = await fetch(eventUri, {
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
      calendlyEvent: event.resource.uri ?? eventUri,
      scheduledTime: event.resource.start_time,
    },
  });
}