"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(59,130,246,0.05) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(184,151,42,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-5"
            >
              Plastic &amp; Reconstructive Surgery · Hyderabad
            </motion.p>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-medium text-[var(--foreground)] leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Precision Surgery.
              <br />
              <em className="not-italic" style={{ color: "var(--accent-gold-light)" }}>
                Compassionate
              </em>{" "}
              Care.
            </h1>

            <p className="text-base text-[var(--foreground-muted)] leading-relaxed mb-8 max-w-lg">
              Dr. Divya Sai Narsingam is a board-certified Plastic &amp;
              Reconstructive Surgeon with over 14 years of clinical experience.
              Consultant at CARE Hospitals, Gachibowli, Hyderabad — combining
              surgical excellence with individualized patient care.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-gold)] text-[var(--background)] text-sm font-medium hover:bg-[var(--accent-gold-light)] transition-colors duration-200"
              >
                Book Consultation
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] text-sm hover:border-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all duration-200"
              >
                About the Doctor
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-[var(--border)]">
              {[
                { value: "14+", label: "Years Experience" },
                { value: "7+", label: "Years Specialist" },
                { value: "MCh", label: "Plastic Surgery" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="text-2xl font-medium text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Doctor card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              {/* Decorative inner glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle, rgba(184,151,42,0.07) 0%, transparent 70%)",
                }}
              />

              {/* Doctor image */}
              <div className="w-full aspect-[3/4] max-w-xs mx-auto rounded-xl overflow-hidden border border-[var(--border)] relative mb-6">
                <Image
                  src="/image.png"
                  alt="Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgeon, CARE Hospitals Hyderabad"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              <div className="text-center">
                <h2
                  className="text-xl font-medium text-[var(--foreground)] mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Dr. Divya Sai Narsingam
                </h2>
                <p className="text-sm text-[var(--accent-gold-light)] mb-1">
                  MBBS, MS, MCh (Plastic Surgery)
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Consultant, CARE Hospitals — Gachibowli, Hyderabad
                </p>
              </div>

              {/* Award badge */}
              <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center gap-3">
                <Award size={16} className="text-[var(--accent-gold)] shrink-0" />
                <p className="text-xs text-[var(--foreground-muted)]">
                  University Topper · MCh Plastic Surgery, MS Ramaiah Medical College
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
