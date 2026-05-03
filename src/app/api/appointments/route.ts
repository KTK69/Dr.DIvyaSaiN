import { NextResponse } from "next/server";
import { saveAppointment } from "@/lib/content-repository";
import type { AppointmentRequest } from "@/types/content";

export async function POST(request: Request) {
  const payload = (await request.json()) as AppointmentRequest;

  if (!payload.fullName || !payload.phone || !payload.email || !payload.concern) {
    return NextResponse.json(
      { ok: false, message: "Missing required appointment fields." },
      { status: 400 },
    );
  }

  const result = await saveAppointment(payload);
  return NextResponse.json(result, { status: 201 });
}