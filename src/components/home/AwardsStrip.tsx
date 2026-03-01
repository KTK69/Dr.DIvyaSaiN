"use client";

import { motion } from "framer-motion";
import { Award, GraduationCap, Microscope, Users } from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    value: "University Topper",
    label: "MCh Plastic Surgery, 2017",
  },
  {
    icon: Award,
    value: "Best Outgoing Student",
    label: "Superspecialty, MS Ramaiah",
  },
  {
    icon: Award,
    value: "Best Poster Award",
    label: "Association of Surgeons of India",
  },
  {
    icon: Microscope,
    value: "2 Publications",
    label: "Peer-reviewed international journals",
  },
];

export default function AwardsStrip() {
  return (
    <section
      className="border-y border-[var(--border)] bg-[var(--bg-surface)]"
      aria-label="Credentials and awards"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] shrink-0">
                <Icon size={16} className="text-[var(--accent-gold)]" />
              </div>
              <div>
                <p
                  className="text-sm font-medium text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {value}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5 leading-snug">
                  {label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
