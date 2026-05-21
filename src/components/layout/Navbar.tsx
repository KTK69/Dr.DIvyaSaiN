"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Video } from "lucide-react";
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

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = content.navigation.links;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-(--bg-glass) backdrop-blur-md border-b border-(--border)"
          : "bg-(--bg-surface) lg:bg-transparent"
      }`}
      style={{ backdropFilter: scrolled ? "blur(12px)" : undefined }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-18 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 flex-1 flex-col leading-tight group">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full border border-(--border) bg-(--bg-card)">
                <Image src={LOGO} alt="Dr. Divya Sai Narsingam logo" fill className="object-cover" />
              </div>
              <div className="min-w-0 leading-tight">
                <span
                  className="block truncate text-sm sm:text-base font-semibold text-(--accent-gold-light) tracking-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Dr. Divya Sai Narsingam
                </span>
                <span className="block truncate text-[11px] sm:text-xs text-(--foreground) font-semibold tracking-wide opacity-90">
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
              className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl bg-(--accent-gold) text-(--background) shadow-lg shadow-black/20 hover:bg-(--accent-gold-light) transition-all duration-200"
            >
              <Video size={16} />
              Book Video Consultation
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden shrink-0 p-2 text-(--foreground) hover:text-(--accent-gold-light)"
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
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl bg-(--accent-gold) text-(--background) font-medium shadow-lg shadow-black/20"
                >
                  <Video size={16} />
                  Book Video Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
