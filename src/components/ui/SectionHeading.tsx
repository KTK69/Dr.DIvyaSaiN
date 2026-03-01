interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl md:text-4xl font-medium ${
          light ? "text-[var(--foreground-muted)]" : "text-[var(--foreground)]"
        }`}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
