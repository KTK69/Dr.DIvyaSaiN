"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

const CALENDLY_URL =
  "https://calendly.com/drdivyaplasticsurgeon/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=fbfaf6&text_color=24332f&primary_color=b89a5a";

export default function CalendlyBookingFrame({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeWidget = () => {
      if (!containerRef.current || !window.Calendly) return false;
      containerRef.current.replaceChildren();
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: containerRef.current,
      });
      return true;
    };

    if (!initializeWidget()) {
      const script = document.querySelector<HTMLScriptElement>(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]',
      );
      const retry = window.setInterval(() => {
        if (initializeWidget()) window.clearInterval(retry);
      }, 100);
      script?.addEventListener("load", initializeWidget, { once: true });
      window.setTimeout(() => window.clearInterval(retry), 10000);
    }

  }, []);

  return (
    <div
      ref={containerRef}
      className={`calendly-inline-widget w-full block ${className}`}
      style={{ minWidth: "320px", height: "760px" }}
      title="Book appointment with Dr. Divya Sai Narsingam"
    />
  );
}
