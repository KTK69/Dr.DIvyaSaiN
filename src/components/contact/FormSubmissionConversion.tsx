"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ADS_SEND_TO = "AW-18459222154/eMRqCLakjJIdEIrBheJE";

export default function FormSubmissionConversion({ transactionId }: { transactionId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "form_submission_validated" });
    const conversionPayload = {
      send_to: GOOGLE_ADS_SEND_TO,
      transaction_id: transactionId,
      currency: "INR",
    };

    if (window.gtag) {
      window.gtag("event", "conversion", conversionPayload);
    } else {
      window.dataLayer.push(["event", "conversion", conversionPayload]);
    }
  }, [transactionId]);

  return null;
}
