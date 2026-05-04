import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/ui/FloatingActions";
import { SiteContentProvider } from "@/components/site/SiteContentProvider";
import { getStoredSiteContent } from "@/lib/site-content-store";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getStoredSiteContent();
  const { siteSeo } = content;

  return {
    metadataBase: new URL("https://drdivyaplasticsurgeon.com"),
    title: {
      default: siteSeo.titleDefault,
      template: siteSeo.titleTemplate,
    },
    description: siteSeo.description,
    keywords: siteSeo.keywords,
    openGraph: {
      type: siteSeo.openGraph.type,
      locale: siteSeo.openGraph.locale,
      siteName: siteSeo.openGraph.siteName,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        />
      </head>
      <body>
        <SiteContentProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingActions />
        </SiteContentProvider>
      </body>
    </html>
  );
}
