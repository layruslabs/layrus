import type { Metadata } from "next";
import { PageHeader, CtaBand } from "@/components/PageHeader";
import { FeaturedVideo } from "@/components/sections/FeaturedVideo";
import { Insights } from "@/components/sections/Insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes on engineering practice, AI systems, IoT and embedded systems from the team at Layrus Labs, plus a two-minute explainer on what happens when you type a URL.",
  alternates: { canonical: "/blog" },
};

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "What happens when you type a URL",
  description:
    "A two-minute teardown of the trip from the address bar to a painted page: DNS, the TLS handshake, the request, the server and the render.",
  thumbnailUrl: "https://layrus.com/videos/url-to-page-poster.jpg",
  uploadDate: "2026-11-14",
  duration: "PT1M59S",
  contentUrl: "https://layrus.com/videos/url-to-page-full.mp4",
  publisher: {
    "@type": "Organization",
    name: "Layrus Labs",
    url: "https://layrus.com",
  },
};

/* The homepage section carries the heading and the cards; this page gives
   them their own address rather than restating them. The explainer sits above
   the written cards because it is the newest piece. */
export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <PageHeader
        eyebrow="Insights"
        title="Notes from the work"
        intro="What we have learned building these systems — written for people who have to make the decision, not for people who want to read the source."
      />
      <FeaturedVideo />
      <Insights />
      <CtaBand />
    </>
  );
}
