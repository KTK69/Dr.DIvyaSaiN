"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export default function CTASection() {
  return (
    <section className="section-padding" aria-label="Book an appointment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Background shimmer */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(184,151,42,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-4">
              CARE Hospitals, Gachibowli
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium text-[var(--foreground)] mb-5 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Ready to discuss your concerns?
            </h2>
            <p className="text-base text-[var(--foreground-muted)] max-w-lg mx-auto mb-8 leading-relaxed">
              Schedule a consultation with Dr. Narsingam at CARE Hospitals,
              Gachibowli. Every consultation is private, unhurried, and focused
              on understanding your individual situation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--accent-gold)] text-[var(--background)] text-sm font-medium hover:bg-[var(--accent-gold-light)] transition-colors duration-200"
              >
                Request an Appointment
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] text-sm hover:border-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all duration-200"
              >
                Explore Procedures
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[var(--foreground-subtle)]">
              <MapPin size={12} />
              <span>
                Room No. 205, OPD Building, CARE Hospital, Gachibowli, Hyderabad
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
