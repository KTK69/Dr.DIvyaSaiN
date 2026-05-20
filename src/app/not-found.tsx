import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p
          className="text-6xl font-medium text-[var(--accent-gold)] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          404
        </p>
        <h1
          className="text-2xl font-medium text-[var(--foreground)] mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Oops, couldn&apos;t find the page you are looking for
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-8">
          The URL may be incorrect, or the page may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-gold)] text-[var(--background)] text-sm font-medium hover:bg-[var(--accent-gold-light)] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
