import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for the Layrus Labs Ltd website. Placeholder pending legal review.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of use" />

      <Prose>
        <p>
          <strong style={{ color: "var(--text-primary)" }}>
            These terms are a summary, not a finished agreement.
          </strong>{" "}
          They have not been reviewed by a lawyer, and they do not yet cover
          the terms on which we take on work. Those are agreed in writing per
          engagement. This page needs legal review before launch.
        </p>

        <h2>Using this site</h2>
        <p>
          The content here is provided for information. It describes what we
          do, and it is kept as accurate as we can make it, but it is not
          advice for your particular situation and it is not a quotation or an
          offer.
        </p>

        <h2>Our content</h2>
        <p>
          The text, design, diagrams and code on this site belong to Layrus
          Technology unless stated otherwise. Product names and logos for work
          we have built remain the property of their respective owners. Please
          do not reproduce our material commercially without asking.
        </p>

        <h2>Links elsewhere</h2>
        <p>
          Where we link to other sites, we do not control them and are not
          responsible for what they contain.
        </p>

        <h2>Getting in touch</h2>
        <p>
          Questions about any of this, including the terms for a specific
          engagement, can go to{" "}
          <a href="mailto:hello@layrus.com">hello@layrus.com</a>.
        </p>
      </Prose>
    </>
  );
}
