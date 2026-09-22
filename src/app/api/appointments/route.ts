import { NextResponse } from "next/server";
import { saveAppointment } from "@/lib/content-repository";
import { sendAppointmentEmail } from "@/lib/appointment-email";
import { issueAppointmentConfirmation } from "@/lib/appointment-confirmation";
import type { AppointmentRequest } from "@/types/content";

export async function POST(request: Request) {
  const payload = (await request.json()) as AppointmentRequest;

  if (!payload.fullName || !payload.phone || !payload.email || !payload.concern) {
    return NextResponse.json(
      { ok: false, message: "Missing required appointment fields." },
      { status: 400 },
    );
  }

  try {
    const result = await saveAppointment(payload);

    if (!result.id) {
      return NextResponse.json(
        { ok: false, message: "Unable to create appointment request." },
        { status: 500 },
      );
    }

    await sendAppointmentEmail(payload, result.id);
    const confirmation = await issueAppointmentConfirmation({
      source: "native-form",
      sourceId: result.id,
      metadata: {
        service: payload.concern,
        landingPage: request.headers.get("referer") ?? undefined,
        bookingMethod: "Native Form",
      },
    });

    return NextResponse.json(
      { ...result, confirmationToken: confirmation.token },
      { status: 201 },
    );
  } catch (error) {
    console.error("Appointment submission failed", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "Unable to submit appointment request right now. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
