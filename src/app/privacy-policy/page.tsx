import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/ui/PageWrapper";

export const metadata: Metadata = {
  title: "Privacy Policy | Dr. Divya Sai Narsingam",
  description:
    "How we collect, use, and protect your information when you visit our site or request a consultation.",
};

const LAST_UPDATED = "May 21, 2026";

export default function PrivacyPolicyPage() {
  return (
    <PageWrapper>
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
            Legal
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-(--foreground)"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-(--foreground-muted)">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        <div className="rich-text text-(--foreground-muted) leading-relaxed">
          <p>
            This Privacy Policy explains how we collect, use, and protect
            personal information when you visit this website or request a
            consultation.
          </p>

          <h2>Information we collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              <strong>Information you provide:</strong> Name, phone number,
              email, and details you share when submitting a form or contacting
              us.
            </li>
            <li>
              <strong>Usage data:</strong> Pages you visit, time on site, and
              general analytics collected through cookies or similar
              technologies.
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>Respond to inquiries and schedule consultations.</li>
            <li>Improve website performance and content.</li>
            <li>Send updates or follow-ups related to your request.</li>
          </ul>

          <h2>Cookies and analytics</h2>
          <p>
            We may use cookies or analytics tools to understand how visitors use
            the site. You can control cookies through your browser settings.
          </p>

          <h2>Sharing of information</h2>
          <p>
            We do not sell or share your personal information with third
            parties. The information you submit is used only for your care and
            is accessible only to the doctor.
          </p>

          <h2>Data retention</h2>
          <p>
            We keep information only as long as needed to respond to your
            request, comply with legal obligations, or maintain records related
            to your care.
          </p>

          <h2>Security</h2>
          <p>
            We take reasonable measures to protect your information. However, no
            online transmission is completely secure.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>You can request access or correction of your information.</li>
            <li>You may opt out of non-essential communications at any time.</li>
          </ul>

          <h2>Contact</h2>
          <p>
            If you have questions about this policy, please contact us through
            the <Link href="/contactus">contact page</Link>.
          </p>

          <h2>Updates to this policy</h2>
          <p>
            We may update this policy from time to time. Please review this page
            periodically for changes.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
