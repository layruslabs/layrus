import type { Metadata } from "next";
import { PageHeader, CtaBand } from "@/components/PageHeader";
import { Insights } from "@/components/sections/Insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes on engineering practice, AI systems and connected hardware from the team at Layrus Labs.",
  alternates: { canonical: "/blog" },
};

/* The homepage section carries the heading and the cards; this page gives
   them their own address rather than restating them. */
export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Notes from the work"
        intro="What we have learned building these systems — written for people who have to make the decision, not for people who want to read the source."
      />
      <Insights />
      <CtaBand />
    </>
  );
}
