import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const LOGO = "/images/img/Dr%20Divya%20Logo%20Circle.png";

export default function Footer() {
  return (
    <footer
      className="border-t border-(--border) bg-(--bg-surface)"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-(--border) bg-(--bg-card) shrink-0">
                <Image src={LOGO} alt="Dr. Divya Sai Narsingam logo" fill className="object-cover" />
              </div>
              <div>
                <h2
                  className="text-lg font-medium text-(--foreground) mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Dr. Divya Sai Narsingam
                </h2>
                <p className="text-sm text-(--accent-gold-light)">
                  MCh Plastic Surgery · Board-Certified
                </p>
              </div>
            </div>
            <p className="text-sm text-(--foreground-muted) leading-relaxed max-w-sm">
              Consultant Plastic &amp; Reconstructive Surgeon at CARE Hospitals,
              Gachibowli, Hyderabad. Specialising in aesthetic and reconstructive
              plastic surgery with over 14 years of clinical experience.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-4">
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
                    className="text-sm text-(--foreground-muted) hover:text-(--foreground) transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin size={15} className="text-(--accent-gold) mt-0.5 shrink-0" />
                <span className="text-sm text-(--foreground-muted) leading-relaxed">
                  Room No. 205, OPD Building,<br />
                  CARE Hospital, Old Mumbai Highway,<br />
                  Gachibowli, Hyderabad – 500032
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={15} className="text-(--accent-gold) shrink-0" />
                <span className="text-sm text-(--foreground-muted)">
                  Appointments via CARE Hospitals
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-(--border) flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-(--foreground-subtle)">
            © {new Date().getFullYear()} Dr. Divya Sai Narsingam. All rights reserved.
          </p>
          <nav className="flex gap-5" aria-label="Footer navigation">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Services", "/services"],
              ["Experience", "/experience"],
              ["Testimonials", "/testimonials"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-(--foreground-subtle) hover:text-(--foreground-muted) transition-colors"
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
