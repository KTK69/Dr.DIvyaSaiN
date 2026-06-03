"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Instagram } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/communication";
const CALENDLY_URL = "https://calendly.com/drdivyaplasticsurgeon/30min";
const INSTAGRAM_URL = "https://www.instagram.com/drreconstruct";

// ─── WhatsApp pulse button ────────────────────────────────────────────────────
function WhatsAppButton() {
  const href = buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
      style={{ background: "#25D366" }}
    >
      {/* Ripple rings */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: "#25D366" }} />
      <span className="absolute inset-0 rounded-full animate-ping opacity-15 [animation-delay:0.4s]" style={{ background: "#25D366" }} />
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-7 h-7 relative z-10"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {/* Tooltip */}
      <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl"
        style={{ background: "#1a1a2e" }}>
        Chat on WhatsApp
      </span>
    </motion.a>
  );
}

// ─── Instagram button ───────────────────────────────────────────────────────
function InstagramButton() {
  return (
    <motion.a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit Instagram"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.35 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl focus:outline-none focus-visible:ring-2"
      style={{ background: "linear-gradient(135deg, #F58529 0%, #DD2A7B 45%, #8134AF 100%)" }}
    >
      <Instagram size={22} color="white" aria-hidden="true" />
      <span
        className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl"
        style={{ background: "#1a1a2e" }}
      >
        Visit Instagram
      </span>
    </motion.a>
  );
}

// ─── Calendly modal ───────────────────────────────────────────────────────────
function CalendlyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-998 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Book Video Consultation"
            className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                maxHeight: "90vh",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ background: "var(--accent-gold)", color: "var(--background)" }}
                  >
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "var(--font-serif)" }}>
                      Book Video Consultation
                    </p>
                    <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                      Dr. Divya Sai Narsingam · CARE Hospitals, Hyderabad
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: "var(--foreground-muted)" }}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Calendly iframe */}
              <div className="flex-1 overflow-hidden" style={{ minHeight: "560px" }}>
                <iframe
                  src={`${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d1117&text_color=e2e8f0&primary_color=b8972a`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Book appointment with Dr. Divya Sai Narsingam"
                  className="w-full h-full"
                  style={{ minHeight: "560px" }}
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Book button ──────────────────────────────────────────────────────────────
function BookButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Book Video Consultation"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex max-w-full items-center justify-center gap-2 h-14 px-3 md:px-0 md:w-14 rounded-full md:rounded-full shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-gold)"
      style={{ background: "var(--accent-gold)" }}
    >
      <Calendar size={22} color="var(--background)" />
      <span className="text-xs font-semibold text-(--background) md:hidden">
        Video Consult
      </span>
    </motion.button>
  );
}

// ─── Main export: sticky side panel ──────────────────────────────────────────
export default function FloatingActions() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  return (
    <>
      {/* Sticky column — bottom-right */}
      <div
        className="fixed bottom-4 right-3 md:bottom-6 md:right-6 z-900 flex max-w-[calc(100vw-0.75rem)] flex-col items-end gap-3"
        onMouseEnter={() => setShowLabels(true)}
        onMouseLeave={() => setShowLabels(false)}
      >
        {/* Labels (appear on hover) */}
        <AnimatePresence>
          {showLabels && (
            <motion.div
              key="labels"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-end gap-3 pointer-events-none"
            >
              <span
                className="rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg"
                style={{ background: "var(--bg-card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                Book Video Consultation
              </span>
              <span
                className="rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg"
                style={{ background: "var(--bg-card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                WhatsApp Us
              </span>
              <span
                className="rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg"
                style={{ background: "var(--bg-card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                Instagram
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons column */}
        <div className="flex flex-col items-center gap-3">
          <BookButton onClick={() => setCalendlyOpen(true)} />
          <WhatsAppButton />
          <InstagramButton />
        </div>
      </div>

      {/* Calendly Modal */}
      <CalendlyModal open={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </>
  );
}
