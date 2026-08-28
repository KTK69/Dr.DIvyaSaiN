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
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-3">
          {eyebrow}
        </p>
      )}
      <Heading
        className={`text-3xl md:text-4xl font-medium ${
          light ? "text-[var(--foreground-muted)]" : "text-[var(--foreground)]"
        }`}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-4 text-base text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
