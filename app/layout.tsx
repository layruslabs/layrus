import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import "./globals.css";

/* ─── Fonts ─────────────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* The Layrus logotype, traced from public/custom_font.png.
   Bold carries LAYRUS, Regular carries TECHNOLOGY.
   Rebuild with: python3 scripts/build-brand-font.py */
const layrus = localFont({
  src: [
    { path: "./fonts/LayrusDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/LayrusDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-layrus",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

/* ─── Metadata ───────────────────────────────────────────────────────────────── */
import { BASE_URL, organizationLd, websiteLd, ORG } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Layrus Labs — Engineering Technology for Business",
    template: "%s | Layrus Labs",
  },
  description:
    "Layrus Labs builds custom software, AI systems, IoT, embedded systems and cloud infrastructure for businesses in Abuja and worldwide.",
  keywords: [
    "custom software development Nigeria",
    "AI automation Abuja",
    "embedded systems engineering",
    "IoT development Nigeria",
    "SaaS development Africa",
    "PCB design Nigeria",
    "business software systems",
    "WhatsApp AI automation",
    "RAG systems",
    "multi-tenant SaaS",
    "Layrus Labs",
  ],
  authors: [{ name: "Layrus Labs Ltd", url: BASE_URL }],
  creator: "Layrus Labs Ltd",
  publisher: "Layrus Labs Ltd",
  category: "Technology",

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: BASE_URL,
    siteName: "Layrus Labs",
    title: "Layrus Labs — Engineering Technology for Business",
    description:
      "Custom software, AI systems, IoT and embedded systems for businesses with complex technical needs. Abuja, Nigeria.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Layrus Labs — Engineering Technology for Business",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Layrus Labs — Engineering Technology for Business",
    description:
      "Custom software, AI systems, IoT and embedded systems for businesses with complex technical needs.",
    images: ["/og-image.png"],
    creator: "@layruslabs",
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

  alternates: {
    canonical: BASE_URL,
  },

  /* Icons come from the file convention: app/favicon.ico, app/icon.png and
     app/apple-icon.png. Declaring them here as well pointed at files that do
     not exist, so those links 404'd. */
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#D9D6C9" },
    { media: "(prefers-color-scheme: dark)", color: "#17110B" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* ─── JSON-LD structured data ────────────────────────────────────────────────── */
const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Layrus Labs Services",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Software Systems",
        description:
          "Custom business software, multi-tenant SaaS platforms, web applications, APIs and backend systems, system integrations.",
        provider: { "@id": `${BASE_URL}/#organization` },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "AI & Automation",
        description:
          "AI agents, WhatsApp AI assistants, RAG systems, workflow automation, AI customer support and intelligent business tools.",
        provider: { "@id": `${BASE_URL}/#organization` },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Embedded & Connected Systems",
        description:
          "PCB design, embedded systems, IoT, firmware, hardware prototyping and hardware/software integration.",
        provider: { "@id": `${BASE_URL}/#organization` },
      },
    },
  ],
};

/* ─── Root Layout ────────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${layrus.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(servicesJsonLd),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          {/* The chrome lives here rather than in page.tsx: every route needs
              it, and a nav that has to be re-added per page is a nav that
              eventually goes missing from one of them. */}
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
