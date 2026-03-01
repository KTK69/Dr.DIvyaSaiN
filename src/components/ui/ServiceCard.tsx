"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  name: string;
  shortDesc: string;
  href: string;
  category: "reconstructive" | "cosmetic";
  index?: number;
}

export default function ServiceCard({
  name,
  shortDesc,
  href,
  category,
  index = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        href={href}
        className="block h-full glass-card rounded-xl p-6 transition-all duration-300 hover:border-[var(--border)] hover:shadow-lg"
        style={{
          boxShadow: "0 0 0 0 transparent",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              category === "reconstructive"
                ? "text-[var(--accent-gold)]"
                : "text-[var(--accent-blue)]"
            }`}
          >
            {category === "reconstructive" ? "Reconstructive" : "Cosmetic"}
          </span>
        </div>
        <h3
          className="text-lg font-medium text-[var(--foreground)] mb-2 group-hover:text-[var(--accent-gold-light)] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {name}
        </h3>
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-4">
          {shortDesc}
        </p>
        <span className="inline-flex items-center gap-1 text-xs text-[var(--foreground-subtle)] group-hover:text-[var(--accent-gold-light)] transition-colors">
          Learn more <ArrowRight size={12} />
        </span>
      </Link>
    </motion.div>
  );
}
