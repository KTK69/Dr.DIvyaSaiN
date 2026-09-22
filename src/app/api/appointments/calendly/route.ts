import { NextResponse } from "next/server";
import { issueAppointmentConfirmation } from "@/lib/appointment-confirmation";

function isCalendlyUri(value: unknown): value is string {
  return typeof value === "string" && /^https:\/\/api\.calendly\.com\/scheduled_events\//.test(value);
}

export async function POST(request: Request) {
  const token = process.env.CALENDLY_API_TOKEN?.trim();
  const body = (await request.json().catch(() => null)) as {
    eventUri?: unknown;
    inviteeUri?: unknown;
  } | null;

  if (!token || !isCalendlyUri(body?.eventUri)) {
    return NextResponse.json({ ok: false, message: "Booking could not be verified." }, { status: 400 });
  }

  try {
    const eventResponse = await fetch(body.eventUri, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!eventResponse.ok) {
      return NextResponse.json({ ok: false, message: "Booking could not be verified." }, { status: 400 });
    }

    const event = (await eventResponse.json()) as {
      resource?: { uri?: string; status?: string; name?: string; start_time?: string };
    };
    if (event.resource?.status !== "active") {
      return NextResponse.json({ ok: false, message: "Booking is not active." }, { status: 400 });
    }

    const confirmation = await issueAppointmentConfirmation({
      source: "calendly",
      sourceId: String(body.inviteeUri ?? body.eventUri),
      metadata: {
        bookingMethod: "Calendly",
        service: event.resource.name,
        calendlyEvent: event.resource.uri ?? body.eventUri,
        scheduledTime: event.resource.start_time,
      },
    });

    return NextResponse.json({ ok: true, confirmationToken: confirmation.token });
  } catch (error) {
    console.error("Calendly booking verification failed", error);
    return NextResponse.json({ ok: false, message: "Booking could not be verified." }, { status: 502 });
  }
}