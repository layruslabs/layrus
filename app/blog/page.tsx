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

/* The homepage section carries the heading and the cards; this page gives
   them their own address rather than restating them. The explainer sits above
   the written cards because it is the newest piece. */
export default function BlogPage() {
  return (
    <>
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
