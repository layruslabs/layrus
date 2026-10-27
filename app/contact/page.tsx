import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StartProject } from "@/components/sections/StartProject";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Layrus Labs in Abuja about a new project, support for a system you already run, a partnership, procurement, or anything else.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you need"
        intro="A new system, one that needs looking after, a partnership, a procurement question, or something else entirely. The more concrete you can be, the more useful our first reply will be."
      />
      <StartProject />
    </>
  );
}
