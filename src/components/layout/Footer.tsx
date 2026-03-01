import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--border)] bg-[var(--bg-surface)]"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2
              className="text-lg font-medium text-[var(--foreground)] mb-1"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Dr. Divya Sai Narsingam
            </h2>
            <p className="text-sm text-[var(--accent-gold-light)] mb-4">
              MCh Plastic Surgery · Board-Certified
            </p>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-sm">
              Consultant Plastic &amp; Reconstructive Surgeon at CARE Hospitals,
              Gachibowli, Hyderabad. Specialising in aesthetic and reconstructive
              plastic surgery with over 14 years of clinical experience.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {[
                ["Onco Reconstruction", "/services/reconstructive/onco-reconstruction"],
                ["Breast Reconstruction", "/services/reconstructive/breast-reconstruction"],
                ["Microvascular Surgery", "/services/reconstructive/microvascular-surgery"],
                ["Breast Augmentation", "/services/cosmetic/breast-augmentation"],
                ["Body Lipocontouring", "/services/cosmetic/body-lipocontouring"],
                ["Gynecomastia", "/services/cosmetic/gynecomastia-reduction"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin size={15} className="text-[var(--accent-gold)] mt-0.5 shrink-0" />
                <span className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  Room No. 205, OPD Building,<br />
                  CARE Hospital, Old Mumbai Highway,<br />
                  Gachibowli, Hyderabad – 500032
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={15} className="text-[var(--accent-gold)] shrink-0" />
                <span className="text-sm text-[var(--foreground-muted)]">
                  Appointments via CARE Hospitals
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-[var(--foreground-subtle)]">
            © {new Date().getFullYear()} Dr. Divya Sai Narsingam. All rights reserved.
          </p>
          <nav className="flex gap-5" aria-label="Footer navigation">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Services", "/services"],
              ["Experience", "/experience"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
