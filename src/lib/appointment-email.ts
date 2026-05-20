import "server-only";

import type { AppointmentRequest } from "@/types/content";

const RESEND_API_URL = "https://api.resend.com/emails";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function formatOptionalValue(value?: string) {
  return value?.trim() ? value : "Not provided";
}

function buildPlainTextBody(payload: AppointmentRequest, id: string) {
  return [
    "A new appointment request has been submitted.",
    "",
    `Request ID: ${id}`,
    `Full Name: ${payload.fullName}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Concern: ${payload.concern}`,
    `Preferred Time: ${formatOptionalValue(payload.preferredTime)}`,
    `How Did You Hear About Us: ${formatOptionalValue(payload.howDidYouHear)}`,
  ].join("\n");
}

function buildHtmlBody(payload: AppointmentRequest, id: string) {
  const rows = [
    ["Request ID", id],
    ["Full Name", payload.fullName],
    ["Phone", payload.phone],
    ["Email", payload.email],
    ["Concern", payload.concern],
    ["Preferred Time", formatOptionalValue(payload.preferredTime)],
    ["How Did You Hear About Us", formatOptionalValue(payload.howDidYouHear)],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #d1d5db;">${label}</td><td style="padding:8px 12px;border:1px solid #d1d5db;">${value}</td></tr>`,
    )
    .join("");

  return [
    "<div style=\"font-family:Arial,sans-serif;color:#111827;\">",
    "<h2 style=\"margin-bottom:16px;\">New appointment request</h2>",
    "<table style=\"border-collapse:collapse;\">",
    rows,
    "</table>",
    "</div>",
  ].join("");
}

export async function sendAppointmentEmail(
  payload: AppointmentRequest,
  id: string,
) {
  const apiKey = getRequiredEnv("RESEND_API_KEY");
  const from = getRequiredEnv("APPOINTMENT_EMAIL_FROM");
  const to = getRequiredEnv("APPOINTMENT_EMAIL_TO");

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `New appointment request from ${payload.fullName}`,
      reply_to: payload.email,
      text: buildPlainTextBody(payload, id),
      html: buildHtmlBody(payload, id),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Resend request failed with status ${response.status}: ${errorText}`,
    );
  }
}
