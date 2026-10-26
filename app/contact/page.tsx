import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StartProject } from "@/components/sections/StartProject";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you are trying to build, or what is currently slowing you down. Layrus Labs, Abuja, Nigeria.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you're trying to build"
        intro="The more concrete you can be about the problem, the more useful our first reply will be — but a rough description is a fine place to start."
      />
      <StartProject />
    </>
  );
}
