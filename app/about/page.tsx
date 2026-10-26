import type { Metadata } from "next";
import { PageHeader, CtaBand } from "@/components/PageHeader";
import { WhyLayrus } from "@/components/sections/WhyLayrus";
import { Team } from "@/components/sections/Team";
import { WhoWeBuildFor } from "@/components/sections/WhoWeBuildFor";
import { Compliance } from "@/components/sections/Compliance";

export const metadata: Metadata = {
  title: "About",
  description:
    "Layrus Labs is an engineering company in Lagos, Nigeria, building custom software, AI systems and connected hardware for businesses with complex technical needs.",
  alternates: { canonical: "/about" },
};

/* Assembled from the sections that already make this argument on the
   homepage, rather than written a second time in slightly different words. */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="An engineering company, not a software vendor"
        intro="We design, build and implement systems for businesses whose problems do not fit an off-the-shelf product — and then we stay to look after them."
      />
      <WhyLayrus />
      <Team />
      <WhoWeBuildFor />
      <Compliance />
      <CtaBand />
    </>
  );
}
