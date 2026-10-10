import type { AppointmentRequest } from "@/types/content";

export const MIN_APPOINTMENT_COMPLETION_MS = 2_000;

const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/;

export function normalizeIndianMobileNumber(phone: string) {
  const digits = phone.replace(/[\s()-]/g, "");
  const withoutCountryCode = digits.replace(/^(?:\+91|0091)/, "");
  return withoutCountryCode;
}

export function isValidIndianMobileNumber(phone: string) {
  return INDIAN_MOBILE_PATTERN.test(normalizeIndianMobileNumber(phone));
}

export function isAppointmentRequest(value: unknown): value is AppointmentRequest {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.fullName === "string" &&
    typeof payload.phone === "string" &&
    typeof payload.email === "string" &&
    typeof payload.concern === "string" &&
    (payload.preferredTime === undefined || typeof payload.preferredTime === "string") &&
    (payload.howDidYouHear === undefined || typeof payload.howDidYouHear === "string")
  );
}
