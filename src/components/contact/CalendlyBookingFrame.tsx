"use client";

const CALENDLY_URL =
  "https://calendly.com/drdivyaplasticsurgeon/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d1117&text_color=e2e8f0&primary_color=b8972a&redirect_url=https%3A%2F%2Fdrdivyaplasticsurgeon.com%2Fapi%2Fappointments%2Fcalendly%2Fredirect";

export default function CalendlyBookingFrame({ className = "" }: { className?: string }) {
  return (
    <iframe
      src={CALENDLY_URL}
      width="100%"
      height="760"
      frameBorder="0"
      title="Book appointment with Dr. Divya Sai Narsingam"
      loading="lazy"
      className={`w-full block ${className}`}
      style={{ minHeight: "760px" }}
    />
  );
}