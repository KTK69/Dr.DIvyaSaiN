"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ADS_SEND_TO = "AW-18459222154/fq-GCNqttP4CEIrBheJE";

export default function ConfirmationConversion({
  transactionId,
  bookingMethod,
}: {
  transactionId: string;
  bookingMethod: "native-form" | "calendly";
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    window.dataLayer?.push({
      event: "appointment_confirmation_validated",
      booking_method: bookingMethod,
    });
    window.gtag?.("event", "conversion", {
      send_to: GOOGLE_ADS_SEND_TO,
      transaction_id: transactionId,
      currency: "INR",
    });
  }, [bookingMethod, transactionId]);

  return null;
}