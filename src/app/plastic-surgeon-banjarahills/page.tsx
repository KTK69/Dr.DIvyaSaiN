import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/ui/PageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, SITE_URL } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/communication";
import { getEditablePageMetadata } from "@/lib/page-metadata";
import { getStoredSiteContent } from "@/lib/site-content-store";

const pagePath = "/plastic-surgeon-banjarahills";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("banjaraHills");
}

function ServiceGrid({
  items,
  eyebrow,
  title,
  subtitle,
  cardClassName,
}: {
  items: Array<{
    title: string;
    description: string;
    href: string;
    cta: string;
  }>;
  eyebrow: string;
  title: string;
  subtitle: string;
  cardClassName: string;
}) {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className={cardClassName}>
              <h3 className="text-2xl">{item.title}</h3>
              <p className="mt-4 text-(--foreground-muted)">{item.description}</p>
              <Link
                href={item.href}
                className="mt-5 inline-flex text-sm font-medium text-(--accent-gold-light) hover:text-(--accent-gold)"
              >
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function PlasticSurgeonBanjaraHillsPage() {
  const { content } = await getStoredSiteContent();
  const page = content.banjaraHillsPage;
  const whatsappLink = buildWhatsAppLink(
    "Hello Dr. Divya Sai Narsingam, I would like to book a consultation at AIG Hospitals, Banjara Hills.",
  );

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    {
      name: "Plastic Surgeon in Banjara Hills",
      url: `${SITE_URL}${pagePath}`,
    },
  ]);

  return (
    <PageWrapper>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={buildFaqJsonLd(page.faqItems)} />

      <section className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-(--accent-gold) mb-4">
                {page.heroEyebrow}
              </p>
              <h1 className="text-4xl md:text-6xl leading-tight">{page.heroTitle}</h1>
              <p className="mt-6 max-w-3xl text-base md:text-lg text-(--foreground-muted)">
                {page.heroSummary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contactus"
                  className="inline-flex items-center rounded-xl bg-(--accent-gold) px-5 py-3 text-sm font-medium text-(--background) hover:bg-(--accent-gold-light) transition-colors"
                >
                  Book appointment
                </Link>
                <Link
                  href={whatsappLink}
                  className="inline-flex items-center rounded-xl border border-(--border) px-5 py-3 text-sm font-medium text-(--foreground) hover:border-(--accent-gold-light) hover:text-(--accent-gold-light) transition-colors"
                >
                  WhatsApp now
                </Link>
              </div>
            </div>

            <div className="glass-card rounded-3xl border border-(--border) p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-(--accent-blue) mb-3">
                {page.contactCardTitle}
              </p>
              <ul className="space-y-3 text-sm text-(--foreground-muted)">
                {page.contactCardItems.map((item) => (
                  <li key={item} className="rounded-2xl bg-black/10 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-(--border) px-4 py-4">
                <p className="text-sm text-(--foreground)">Contact: {content.contact.phone}</p>
                <p className="mt-1 text-sm text-(--foreground-muted)">{content.contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={page.qualificationsEyebrow}
            title={page.qualificationsTitle}
            subtitle={page.qualificationsSubtitle}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {page.qualificationPoints.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-(--border) bg-(--bg-card) p-5 text-(--foreground-muted)"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceGrid
        items={page.cosmeticServices}
        eyebrow={page.cosmeticEyebrow}
        title={page.cosmeticTitle}
        subtitle={page.cosmeticSubtitle}
        cardClassName="rounded-3xl border border-(--border) bg-(--bg-card) p-6"
      />

      <ServiceGrid
        items={page.reconstructiveServices}
        eyebrow={page.reconstructiveEyebrow}
        title={page.reconstructiveTitle}
        subtitle={page.reconstructiveSubtitle}
        cardClassName="glass-card rounded-3xl p-6"
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={page.aigEyebrow}
            title={page.aigTitle}
            subtitle={page.aigSubtitle}
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {page.aigBenefits.map((item) => (
              <div key={item.title} className="rounded-3xl border border-(--border) p-6">
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-3 text-(--foreground-muted)">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-(--bg-surface)">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={page.faqEyebrow} title={page.faqTitle} />

          <div className="space-y-4">
            {page.faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-(--border) bg-(--bg-card) p-6"
              >
                <h3 className="text-xl">{item.question}</h3>
                <p className="mt-3 text-(--foreground-muted)">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-(--accent-gold) mb-4">
            {page.ctaEyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl">{page.ctaTitle}</h2>
          <p className="mt-5 text-(--foreground-muted)">{page.ctaSummary}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contactus"
              className="inline-flex items-center rounded-xl bg-(--accent-gold) px-5 py-3 text-sm font-medium text-(--background) hover:bg-(--accent-gold-light) transition-colors"
            >
              Book appointment
            </Link>
            <Link
              href={whatsappLink}
              className="inline-flex items-center rounded-xl border border-(--border) px-5 py-3 text-sm font-medium text-(--foreground) hover:border-(--accent-gold-light) hover:text-(--accent-gold-light) transition-colors"
            >
              Message on WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
