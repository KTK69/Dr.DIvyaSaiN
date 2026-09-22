import { NextResponse } from "next/server";
import { verifyCalendlyEvent } from "@/lib/calendly-verification";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    eventUri?: unknown;
    inviteeUri?: unknown;
  } | null;

  if (typeof body?.eventUri !== "string") {
    return NextResponse.json({ ok: false, message: "Booking could not be verified." }, { status: 400 });
  }

  try {
    const confirmation = await verifyCalendlyEvent({
      eventUri: body.eventUri,
      inviteeUri: typeof body.inviteeUri === "string" ? body.inviteeUri : undefined,
    });
    if (!confirmation) {
      return NextResponse.json({ ok: false, message: "Booking is not active." }, { status: 400 });
    }

    return NextResponse.json({ ok: true, confirmationToken: confirmation.token });
  } catch (error) {
    console.error("Calendly booking verification failed", error);
    return NextResponse.json({ ok: false, message: "Booking could not be verified." }, { status: 502 });
  }
}