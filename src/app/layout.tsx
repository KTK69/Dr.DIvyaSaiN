import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/ui/FloatingActions";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.drdivyanarsingam.com"),
  title: {
    default:
      "Dr. Divya Sai Narsingam | Plastic & Reconstructive Surgeon Hyderabad",
    template: "%s | Dr. Divya Sai Narsingam",
  },
  description:
    "Dr. Divya Sai Narsingam – Board-certified Plastic & Reconstructive Surgeon at CARE Hospitals, Gachibowli, Hyderabad. MCh Plastic Surgery. Expert in cosmetic surgery, breast reconstruction, and microvascular surgery.",
  keywords: [
    "Plastic Surgeon in Hyderabad",
    "Reconstructive Surgeon Gachibowli",
    "Breast Reconstruction Surgeon Hyderabad",
    "Dr Divya Sai Narsingam",
    "CARE Hospitals Hyderabad plastic surgery",
    "cosmetic surgeon Hyderabad",
    "MCh Plastic Surgery Hyderabad",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Dr. Divya Sai Narsingam – Plastic Surgeon",
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
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
