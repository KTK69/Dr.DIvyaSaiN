"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPreview() {
  return (
    <section className="section-padding" aria-label="About Dr. Narsingam">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Quote card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card rounded-2xl p-10 relative">
              <div
                className="absolute top-6 left-6 text-6xl leading-none text-[var(--accent-gold)] opacity-20"
                aria-hidden="true"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                "
              </div>
              <blockquote className="relative">
                <p
                  className="text-xl text-[var(--foreground)] leading-relaxed italic mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Surgery is as much about listening as it is about operating.
                  Every patient brings a unique story, unique anatomy, and unique
                  expectations. My role is to understand that story fully — and
                  then use every tool at my disposal to help write a better
                  chapter.
                </p>
                <footer className="flex items-center gap-3">
                  <div className="w-8 h-px bg-[var(--accent-gold)]" aria-hidden="true" />
                  <cite className="text-sm not-italic text-[var(--accent-gold-light)]">
                    Dr. Divya Sai Narsingam
                  </cite>
                </footer>
              </blockquote>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-4">
              Your Doctor
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium text-[var(--foreground)] mb-5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Board-Certified.
              <br />
              Clinically Experienced.
            </h2>
            <p className="text-base text-[var(--foreground-muted)] leading-relaxed mb-6">
              Dr. Divya Sai Narsingam holds an MCh in Plastic Surgery from MS
              Ramaiah Medical College, Bangalore — where she graduated as
              University Topper and Best Outgoing Student. She has over 14 years
              of clinical experience, including specialist training in
              microvascular surgery, oncoplastic reconstruction, and aesthetic
              procedures.
            </p>
            <p className="text-base text-[var(--foreground-muted)] leading-relaxed mb-8">
              She currently practices as a Consultant at CARE Hospitals,
              Gachibowli — one of Hyderabad's leading private healthcare
              institutions.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                ["Reconstructive Surgery", "Onco, breast, trauma, hand"],
                ["Aesthetic Surgery", "Face, body, breast procedures"],
                ["Microvascular", "Free flap and perforator flaps"],
                ["Burns & Scars", "Grafting and scar revision"],
              ].map(([title, desc]) => (
                <div key={title} className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-sm font-medium text-[var(--foreground)] mb-1">{title}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent-gold-light)] hover:gap-3 transition-all duration-200"
            >
              Read full biography <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
