"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "@/components/site/SiteContentProvider";

const LOGO = "/images/img/Dr%20Divya%20Logo%20Circle.png";

export default function Navbar() {
  const { content } = useSiteContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = content.navigation.links;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-(--bg-glass) backdrop-blur-md border-b border-(--border)"
          : "bg-transparent"
      }`}
      style={{ backdropFilter: scrolled ? "blur(12px)" : "none" }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight group">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-(--border) bg-(--bg-card)">
                <Image src={LOGO} alt="Dr. Divya Sai Narsingam logo" fill className="object-cover" />
              </div>
              <div className="leading-tight">
                <span
                  className="block text-base font-semibold text-(--foreground) tracking-tight group-hover:text-(--accent-gold-light) transition-colors"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Dr. Divya Sai Narsingam
                </span>
                <span className="block text-xs text-(--foreground-muted) font-light tracking-wide">
                  MCh Plastic Surgery · CARE Hospitals, Hyderabad
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors duration-200 ${
                  isActive(href)
                    ? "text-(--accent-gold-light)"
                    : "text-(--foreground-muted) hover:text-(--foreground)"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                  pathname.startsWith("/services")
                    ? "text-(--accent-gold-light)"
                    : "text-(--foreground-muted) hover:text-(--foreground)"
                }`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-3 w-130 glass-card rounded-xl p-6 shadow-2xl"
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
                          Reconstructive
                        </p>
                        {content.navigation.services.reconstructive.map(({ href, label }) => (
                          <Link
                            key={href}
                            href={href}
                            className="block py-1.5 text-sm text-(--foreground-muted) hover:text-(--foreground) transition-colors"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-blue) mb-3">
                          Cosmetic
                        </p>
                        {content.navigation.services.cosmetic.map(({ href, label }) => (
                          <Link
                            key={href}
                            href={href}
                            className="block py-1.5 text-sm text-(--foreground-muted) hover:text-(--foreground) transition-colors"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-(--border)">
                      <Link
                        href="/services"
                        className="text-xs text-(--foreground-muted) hover:text-(--accent-gold-light) transition-colors"
                      >
                        View all services →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/contactus"
              className="ml-2 px-4 py-2 text-sm rounded-lg border border-(--accent-gold) text-(--accent-gold-light) hover:bg-(--accent-gold) hover:text-(--background) transition-all duration-200"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-(--foreground-muted) hover:text-(--foreground)"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-(--bg-surface) border-b border-(--border)"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block py-2 text-sm ${
                    isActive(href)
                      ? "text-(--accent-gold-light)"
                      : "text-(--foreground-muted)"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-3">
                <p className="text-xs uppercase tracking-widest text-(--accent-gold) mb-2">
                  Reconstructive Surgery
                </p>
                {content.navigation.services.reconstructive.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block py-1.5 text-sm text-(--foreground-muted) pl-3"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="pt-3">
                <p className="text-xs uppercase tracking-widest text-(--accent-blue) mb-2">
                  Cosmetic Surgery
                </p>
                {content.navigation.services.cosmetic.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block py-1.5 text-sm text-(--foreground-muted) pl-3"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="pt-4">
                <Link
                  href="/contactus"
                  className="block text-center px-4 py-2.5 text-sm rounded-lg border border-(--accent-gold) text-(--accent-gold-light)"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
