"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "@/components/site/SiteContentProvider";

const LOGO = "/images/img/Dr%20Divya%20Logo%20Circle.png";

export default function Navbar() {
  const { content } = useSiteContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
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
  const getMenuLabel = (slug: string, category: "reconstructive" | "cosmetic", customLabel?: string) =>
    customLabel?.trim() || content.services.find((s) => s.slug === slug && s.category === category)?.name || slug;
  const getMenuHref = (slug: string, category: "reconstructive" | "cosmetic", customHref?: string) =>
    customHref?.trim() || `/services/${category}/${slug}`;
  const closeMenus = () => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  };

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
        {/* Row 1: Logo and Main CTA */}
        <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-3 h-18 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 flex-1 max-w-[calc(100%-4.5rem)] flex-col overflow-hidden leading-tight group sm:max-w-none"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full border border-(--border) bg-(--bg-card)">
                <Image src={LOGO} alt="Dr. Divya Sai Narsingam logo" fill className="object-cover" />
              </div>
              <div className="min-w-0 leading-tight">
                <span
                  className="block truncate text-[13px] sm:text-base font-semibold text-(--accent-gold-light) tracking-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Dr. Divya Sai Narsingam
                </span>
                <span className="block truncate text-[10px] leading-tight sm:text-xs text-(--foreground) font-semibold tracking-wide opacity-90">
                  MCh Plastic Surgery · AIG Hospitals, Banjara Hills & CARE Hospitals, Gachibowli, Hyderabad
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
                onClick={closeMenus}
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
                        {content.navigation.services.reconstructive.map(({ slug, category, label, href }) => {
                          const resolvedHref = getMenuHref(slug, category, href);
                          return (
                            <Link
                              key={`${category}-${slug}-${resolvedHref}`}
                              href={resolvedHref}
                              onClick={closeMenus}
                              className="block py-1.5 text-sm text-(--foreground-muted) hover:text-(--foreground) transition-colors"
                            >
                              {getMenuLabel(slug, category, label)}
                            </Link>
                          );
                        })}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-blue) mb-3">
                          Cosmetic
                        </p>
                        {content.navigation.services.cosmetic.map(({ slug, category, label, href }) => {
                          const resolvedHref = getMenuHref(slug, category, href);
                          return (
                            <Link
                              key={`${category}-${slug}-${resolvedHref}`}
                              href={resolvedHref}
                              onClick={closeMenus}
                              className="block py-1.5 text-sm text-(--foreground-muted) hover:text-(--foreground) transition-colors"
                            >
                              {getMenuLabel(slug, category, label)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-(--border)">
                      <Link
                        href="/services"
                        onClick={closeMenus}
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
              onClick={closeMenus}
              className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl bg-(--accent-gold) text-(--background) shadow-lg shadow-black/20 hover:bg-(--accent-gold-light) transition-all duration-200"
            >
              <Video size={16} />
              Book Video Consultation
            </Link>
          </div>

          {/* Mobile Right Action Area: Book button */}
          <div className="flex lg:hidden items-center shrink-0">
            <Link
              href="/contactus"
              onClick={closeMenus}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-(--accent-gold) text-(--background) shadow-lg shadow-black/10 hover:bg-(--accent-gold-light) transition-all duration-200"
            >
              <Video size={13} />
              <span>Book</span>
            </Link>
          </div>
        </div>

        {/* Row 2: Mobile Horizontal Navigation Strip (Non-scrollable, fits all mobile screens) */}
        <div className="lg:hidden flex items-center justify-between border-t border-(--border)/20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-(--bg-surface)/95">
          <div className="flex w-full items-center justify-between gap-1">
            <Link
              href="/"
              onClick={closeMenus}
              className={`text-[12px] font-semibold tracking-wide py-1 px-2.5 rounded-md transition-colors ${
                pathname === "/"
                  ? "text-(--accent-gold-light) bg-(--bg-card) border border-(--accent-gold)/20"
                  : "text-(--foreground-muted) hover:text-(--foreground)"
              }`}
            >
              Home
            </Link>
            <Link
              href="/aboutus"
              onClick={closeMenus}
              className={`text-[12px] font-semibold tracking-wide py-1 px-2.5 rounded-md transition-colors ${
                pathname.startsWith("/about") || pathname.startsWith("/aboutus")
                  ? "text-(--accent-gold-light) bg-(--bg-card) border border-(--accent-gold)/20"
                  : "text-(--foreground-muted) hover:text-(--foreground)"
              }`}
            >
              About
            </Link>
            <Link
              href="/before-after"
              onClick={closeMenus}
              className={`text-[12px] font-semibold tracking-wide py-1 px-2.5 rounded-md transition-colors ${
                pathname.startsWith("/before-after")
                  ? "text-(--accent-gold-light) bg-(--bg-card) border border-(--accent-gold)/20"
                  : "text-(--foreground-muted) hover:text-(--foreground)"
              }`}
            >
              Results
            </Link>
            <Link
              href="/blog"
              onClick={closeMenus}
              className={`text-[12px] font-semibold tracking-wide py-1 px-2.5 rounded-md transition-colors ${
                pathname.startsWith("/blog")
                  ? "text-(--accent-gold-light) bg-(--bg-card) border border-(--accent-gold)/20"
                  : "text-(--foreground-muted) hover:text-(--foreground)"
              }`}
            >
              Blog
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`flex items-center gap-0.5 text-[12px] font-semibold tracking-wide py-1 px-2.5 rounded-md transition-colors ${
                mobileOpen
                  ? "text-(--accent-gold-light) bg-(--bg-card) border border-(--accent-gold)/20"
                  : "text-(--foreground-muted) hover:text-(--foreground)"
              }`}
            >
              More
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile "More" Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-(--bg-surface) border-b border-(--border)"
          >
            <div className="px-5 py-6 space-y-6">
              {/* Secondary Navigation Grid */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-(--foreground-muted) mb-3">
                  Other Pages
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/drvideo"
                    onClick={closeMenus}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border border-(--border)/50 ${
                      pathname.startsWith("/drvideo") || pathname.startsWith("/doctors-talk")
                        ? "text-(--accent-gold-light) bg-(--bg-card) border-(--accent-gold)/25"
                        : "text-(--foreground-muted) bg-(--bg-card)/40"
                    }`}
                  >
                    Doctor&apos;s Talk
                  </Link>
                  <Link
                    href="/reviews"
                    onClick={closeMenus}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border border-(--border)/50 ${
                      pathname.startsWith("/reviews") || pathname.startsWith("/testimonials")
                        ? "text-(--accent-gold-light) bg-(--bg-card) border-(--accent-gold)/25"
                        : "text-(--foreground-muted) bg-(--bg-card)/40"
                    }`}
                  >
                    Testimonials
                  </Link>
                </div>
              </div>

              {/* Collapsible Services Accordion */}
              <div className="border-t border-(--border)/20 pt-5">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-(--foreground) hover:text-(--accent-gold-light) transition-colors"
                >
                  <span style={{ fontFamily: "var(--font-serif)" }}>Our Services</span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 text-(--accent-gold) ${
                      mobileServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="grid grid-cols-2 gap-4 bg-(--bg-card)/40 p-4 rounded-xl border border-(--border)/20">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-(--accent-gold) mb-2.5">
                            Reconstructive
                          </p>
                          <div className="space-y-2.5">
                            {content.navigation.services.reconstructive.map(({ slug, category, label, href }) => {
                              const resolvedHref = getMenuHref(slug, category, href);
                              return (
                                <Link
                                  key={`${category}-${slug}-${resolvedHref}`}
                                  href={resolvedHref}
                                  onClick={closeMenus}
                                  className={`block text-xs leading-relaxed transition-colors ${
                                    isActive(resolvedHref) ? "text-(--accent-gold-light) font-semibold" : "text-(--foreground-muted) hover:text-(--foreground)"
                                  }`}
                                >
                                  {getMenuLabel(slug, category, label)}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-(--accent-blue) mb-2.5">
                            Cosmetic
                          </p>
                          <div className="space-y-2.5">
                            {content.navigation.services.cosmetic.map(({ slug, category, label, href }) => {
                              const resolvedHref = getMenuHref(slug, category, href);
                              return (
                                <Link
                                  key={`${category}-${slug}-${resolvedHref}`}
                                  href={resolvedHref}
                                  onClick={closeMenus}
                                  className={`block text-xs leading-relaxed transition-colors ${
                                    isActive(resolvedHref) ? "text-(--accent-gold-light) font-semibold" : "text-(--foreground-muted) hover:text-(--foreground)"
                                  }`}
                                >
                                  {getMenuLabel(slug, category, label)}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3.5 text-center">
                        <Link
                          href="/services"
                          onClick={closeMenus}
                          className="inline-block text-xs text-(--accent-gold-light) font-medium"
                        >
                          View all services →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Consultation Button */}
              <div className="border-t border-(--border)/20 pt-5">
                <Link
                  href="/contactus"
                  onClick={closeMenus}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-sm rounded-xl bg-(--accent-gold) text-(--background) font-medium shadow-xl hover:bg-(--accent-gold-light) transition-all duration-200"
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
