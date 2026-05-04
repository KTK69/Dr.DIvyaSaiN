import type {
  AppointmentRequest,
  AppointmentResponse,
} from "@/types/content";

export async function submitAppointment(
  payload: AppointmentRequest,
): Promise<AppointmentResponse> {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return {
      ok: false,
      message: "Unable to save appointment request.",
    };
  }

  return (await response.json()) as AppointmentResponse;
}
