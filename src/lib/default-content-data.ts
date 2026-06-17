import { doctor, cosmeticServices, reconstructiveServices } from "@/lib/doctor-data";
import type {
  AboutContent,
  Blog,
  Review,
  Service,
} from "@/types/content";

const blogSeeds = [
  { slug: "why-dimple-creation-is-popular", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "modern-face-sculpting-options", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "buccal-fat-removal-explained", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "natural-vs-artificial-dimples-differences", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "face-slimming-without-filters-buccal-fat-removal-gachibowli", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "buccal-fat-removal-hyderabad-gachibowli", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "lip-reduction-surgery-hyderabad-gachibowli-guide", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "top-benefits-of-getting-a-tummy-tuck-in-hyderabad", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "top-advances-in-onco-reconstructive-surgery", category: "reconstructive", published_at: "2026-03-18" },
  { slug: "how-to-choose-right-gynecomastia-surgeon-in-hyderabad", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "plastic-surgery-treatments-hyderabad", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "plastic-surgery-cost-guide-hyderabad", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "Comprehensive-Guide-to-Breast-Reconstruction-with-DrDivya", category: "reconstructive", published_at: "2026-03-18" },
  { slug: "living-light-how-breast-reduction-surgery-with-dr-divya-can-transform-your-life", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "beyond-beauty-how-tummy-tucks-relieve-discomfort-and-improve-quality-of-life-insights-from-dr-divya-expert-plastic-surgeon-gachibowli", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "breast-reduction-minimal-scarring-hyderabad", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "how-breast-augmentation-with-fat-grafting-can-help-you-sculpt-your-dream-shape-safely-and-permanently", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "say-goodbye-to-bulky-thighs-expert-liposuction-by-dr-divya-sai-leading-female-plastic-surgeon-in-hyderabad", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "what-sets-board-certified-plastic-surgeons-apart", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "why-does-choosing-a-board-certified-plastic-surgeon-really-matter", category: "cosmetic", published_at: "2026-03-18" },
  { slug: "why-should-you-choose-a-board-certified-plastic-surgeon", category: "cosmetic", published_at: "2026-03-18" },
];

function titleFromSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/drdivya/gi, "Dr Divya")
    .replace(/\bto\b/gi, "to")
    .replace(/\bof\b/gi, "of")
    .replace(/\band\b/gi, "and")
    .replace(/\bwith\b/gi, "with")
    .replace(/\bfor\b/gi, "for")
    .replace(/\bthe\b/gi, "the")
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    .trim();
}

export const DEFAULT_BLOGS: Blog[] = blogSeeds.map((entry) => {
  const title = titleFromSlug(entry.slug);
  return {
    id: `blog-${entry.slug}`,
    slug: entry.slug,
    title,
    excerpt: `${title} with practical guidance for patients planning treatment in Hyderabad.`,
    content: `${title} explains what patients should know before consultation, the common surgical considerations, and how recovery is typically planned with Dr. Divya Sai Narsingam.`,
    image: "/images/img/about.jpeg",
    published_at: entry.published_at,
    category: entry.category,
    meta_title: `${title} | Dr. Divya Sai Narsingam`,
    meta_description: `Patient guidance on ${title.toLowerCase()} from Dr. Divya Sai Narsingam in Hyderabad.`,
    meta_keywords: [],
  };
});

export const DEFAULT_SERVICES: Service[] = [
  ...reconstructiveServices,
  ...cosmeticServices,
].map((item) => {
  const category = reconstructiveServices.some((svc) => svc.slug === item.slug)
    ? "reconstructive"
    : "cosmetic";

  return {
    id: `service-${item.slug}`,
    slug: item.slug,
    name: item.name,
    summary: item.shortDesc,
    content: item.description,
    image: "/images/img/about.jpeg",
    category,
    key_points: item.keyPoints,
    faq: [
      {
        question: `Who is a good candidate for ${item.name}?`,
        answer: `${item.shortDesc} A detailed consultation is required to confirm suitability and treatment plan.`,
      },
      {
        question: `What does ${item.name} typically include?`,
        answer: item.keyPoints.join(" "),
      },
      {
        question: `Where is ${item.name} performed?`,
        answer:
          "Procedures are planned in coordination with CARE Hospitals, Gachibowli, Hyderabad.",
      },
    ],
    meta_title: `${item.name} in Hyderabad | Dr. Divya Sai Narsingam`,
    meta_description: `${item.shortDesc} Specialist ${category} surgery by Dr. Divya Sai Narsingam at CARE Hospitals, Gachibowli, Hyderabad.`,
    meta_keywords: [],
  };
});

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: "review-1",
    patient_name: "Patient",
    procedure: "Breast reconstruction",
    quote:
      "The treatment journey was clearly explained and follow-up care was highly supportive.",
    rating: 5,
  },
  {
    id: "review-2",
    patient_name: "Patient",
    procedure: "Gynecomastia reduction",
    quote:
      "Consultation was thoughtful and the surgical result aligned with expectations.",
    rating: 5,
  },
];

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  heading: "About Dr. Divya Sai Narsingam",
  summary: doctor.summary,
  meta_title: "About Dr. Divya Sai Narsingam | Plastic Surgeon Hyderabad",
  meta_description:
    "Learn about qualifications, experience, and clinical approach of Dr. Divya Sai Narsingam in Hyderabad.",
};
