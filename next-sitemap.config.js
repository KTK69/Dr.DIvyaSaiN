/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.drdivyanarsingam.com",
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
    const reconstructive = [
      "onco-reconstruction",
      "breast-reconstruction",
      "trauma-reconstruction",
      "hand-surgery",
      "microvascular-surgery",
      "maxillofacial-trauma",
      "facial-plastic-surgery",
    ];
    const cosmetic = [
      "breast-augmentation",
      "breast-reduction",
      "tummy-tuck",
      "body-lipocontouring",
      "gynecomastia-reduction",
    ];
    return [
      ...reconstructive.map((slug) => ({
        loc: `/services/reconstructive/${slug}`,
        changefreq: "monthly",
        priority: 0.8,
      })),
      ...cosmetic.map((slug) => ({
        loc: `/services/cosmetic/${slug}`,
        changefreq: "monthly",
        priority: 0.8,
      })),
    ];
  },
};
