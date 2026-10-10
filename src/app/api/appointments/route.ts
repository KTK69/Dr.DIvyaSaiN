import { NextResponse } from "next/server";
import { saveAppointment } from "@/lib/content-repository";
import { sendAppointmentEmail } from "@/lib/appointment-email";
import { issueAppointmentConfirmation } from "@/lib/appointment-confirmation";
import {
  isAppointmentRequest,
  isValidIndianMobileNumber,
  MIN_APPOINTMENT_COMPLETION_MS,
} from "@/lib/appointment-validation";
import { checkAppointmentRateLimit } from "@/lib/appointment-rate-limit";

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  if (!checkAppointmentRateLimit(ipAddress)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }

  try {
    let body: unknown;
    try {
      body = (await request.json()) as unknown;
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid appointment request." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, message: "Invalid appointment request." },
        { status: 400 },
      );
    }

    const submission = body as Record<string, unknown>;
    const formStartedAt = submission.formStartedAt;
    if (
      typeof submission.website === "string" &&
      submission.website.trim()
    ) {
      return NextResponse.json(
        { ok: false, message: "Unable to submit appointment request." },
        { status: 400 },
      );
    }

    if (
      typeof formStartedAt !== "number" ||
      !Number.isFinite(formStartedAt) ||
      Date.now() - formStartedAt < MIN_APPOINTMENT_COMPLETION_MS
    ) {
      return NextResponse.json(
        { ok: false, message: "Please take a moment to complete the form." },
        { status: 400 },
      );
    }

    const appointment = {
      fullName: submission.fullName,
      phone: submission.phone,
      email: submission.email,
      concern: submission.concern,
      preferredTime: submission.preferredTime,
      howDidYouHear: submission.howDidYouHear,
    };
    if (
      !isAppointmentRequest(appointment) ||
      appointment.fullName.trim().length < 2 ||
      appointment.fullName.trim().length > 100 ||
      !isValidIndianMobileNumber(appointment.phone) ||
      appointment.email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointment.email) ||
      appointment.concern.trim().length < 10 ||
      appointment.concern.trim().length > 2_000
    ) {
      return NextResponse.json(
        { ok: false, message: "Please check your appointment details and try again." },
        { status: 400 },
      );
    }

    const payload = {
      ...appointment,
      fullName: appointment.fullName.trim(),
      phone: appointment.phone.trim(),
      email: appointment.email.trim(),
      concern: appointment.concern.trim(),
    };
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
