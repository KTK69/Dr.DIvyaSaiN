/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://drdivyaplasticsurgeon.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
    ],
  },
  changefreq: "monthly",
  priority: 0.7,
  sitemapSize: 7000,
  exclude: [],
  additionalPaths: async () => {
    const staticPaths = [
      { loc: "/", changefreq: "monthly", priority: 1 },
      { loc: "/aboutus", changefreq: "monthly", priority: 0.8 },
      { loc: "/reviews", changefreq: "monthly", priority: 0.8 },
      { loc: "/services", changefreq: "monthly", priority: 0.8 },
      { loc: "/blog", changefreq: "monthly", priority: 0.8 },
      { loc: "/drvideo", changefreq: "monthly", priority: 0.8 },
      { loc: "/contactus", changefreq: "monthly", priority: 0.8 },
      { loc: "/experience", changefreq: "monthly", priority: 0.8 },
    ];

    const services = [
      "onco-reconstruction",
      "breast-reconstruction",
      "trauma-reconstruction",
      "hand-surgery",
      "microvascular-surgery",
      "maxillofacial-trauma",
      "facial-plastic-surgery",
      "breast-augmentation",
      "breast-reduction",
      "tummy-tuck",
      "body-lipocontouring",
      "gynecomastia-reduction",
    ];

    const blogs = [
      "why-dimple-creation-is-popular",
      "modern-face-sculpting-options",
      "buccal-fat-removal-explained",
      "natural-vs-artificial-dimples-differences",
      "face-slimming-without-filters-buccal-fat-removal-gachibowli",
      "buccal-fat-removal-hyderabad-gachibowli",
      "lip-reduction-surgery-hyderabad-gachibowli-guide",
      "top-benefits-of-getting-a-tummy-tuck-in-hyderabad",
      "top-advances-in-onco-reconstructive-surgery",
      "how-to-choose-right-gynecomastia-surgeon-in-hyderabad",
      "plastic-surgery-treatments-hyderabad",
      "plastic-surgery-cost-guide-hyderabad",
      "Comprehensive-Guide-to-Breast-Reconstruction-with-DrDivya",
      "living-light-how-breast-reduction-surgery-with-dr-divya-can-transform-your-life",
      "beyond-beauty-how-tummy-tucks-relieve-discomfort-and-improve-quality-of-life-insights-from-dr-divya-expert-plastic-surgeon-gachibowli",
      "breast-reduction-minimal-scarring-hyderabad",
      "how-breast-augmentation-with-fat-grafting-can-help-you-sculpt-your-dream-shape-safely-and-permanently",
      "say-goodbye-to-bulky-thighs-expert-liposuction-by-dr-divya-sai-leading-female-plastic-surgeon-in-hyderabad",
      "what-sets-board-certified-plastic-surgeons-apart",
      "why-does-choosing-a-board-certified-plastic-surgeon-really-matter",
      "why-should-you-choose-a-board-certified-plastic-surgeon",
    ];

    return [
      ...staticPaths,
      ...services.map((slug) => ({
        loc: `/services/${slug}`,
        changefreq: "monthly",
        priority: 0.8,
      })),
      {
        loc: "/blog",
        changefreq: "weekly",
        priority: 0.8,
      },
      ...blogs.map((slug) => ({
        loc: `/blog/${slug}`,
        changefreq: "monthly",
        priority: 0.64,
      })),
    ];
  },
};
