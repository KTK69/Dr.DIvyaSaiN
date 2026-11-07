interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  headingLevel?: "h1" | "h2";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
  headingLevel = "h2",
}: SectionHeadingProps) {
  const Heading = headingLevel;
  return (
    <div className={`mb-10 sm:mb-12 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-3">
          {eyebrow}
        </p>
      )}
      <Heading
        className={`text-3xl sm:text-4xl font-medium ${
          light ? "text-[var(--foreground-muted)]" : "text-[var(--foreground)]"
        }`}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </Heading>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed text-[var(--foreground-muted)] ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
