import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this website stores, what it does not, and how to ask us to delete anything we hold.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy" />

      <Prose>
        <p>
          This page describes what this website actually does with your data,
          rather than a template covering everything a website could do. It
          has not yet been reviewed by a lawyer, and it should be before you
          rely on it.
        </p>

        <h2>What this site stores</h2>
        <p>
          One thing: whether you have chosen the light or the dark theme. That
          preference is kept in your own browser&rsquo;s local storage and is
          never sent to us. Clearing your browser data removes it.
        </p>

        <h2>What this site does not do</h2>
        <ul>
          <li>It sets no cookies.</li>
          <li>It runs no analytics and no advertising or tracking scripts.</li>
          <li>It loads nothing from third-party advertising networks.</li>
          <li>It does not build a profile of you or your visit.</li>
        </ul>

        <h2>The assistant on this site</h2>
        <p>
          The chat assistant is called Lyra. It is AI, not a person, and it
          says so if you ask. What
          you type into it is sent to Anthropic, which provides the model that
          writes the reply, under their API terms. It is not used to train
          their models and we do not store the conversation: it lives in the
          browser tab and is gone when you close it or reload the page.
        </p>
        <p>
          Please do not type anything into it that you would not put in an
          email. If you want a conversation that is not processed this way,
          write to us instead.
        </p>

        <h2>When you contact us</h2>
        <p>
          Whatever you send us — by the enquiry form or by email — is used to
          reply to you and to do the work you asked about. We do not sell it
          and we do not pass it to anyone else for marketing.
        </p>

        <h2>Hosting</h2>
        <p>
          Like any website, ours is served by a hosting provider that may keep
          standard access logs — IP address, time, page requested — for
          security and to keep the site running. Those logs are not used to
          identify visitors.
        </p>

        <h2>Your requests</h2>
        <p>
          You can ask us what we hold about you, ask us to correct it, or ask
          us to delete it. Write to{" "}
          <a href="mailto:hello@layrus.com">hello@layrus.com</a> and we will
          respond.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, the date on this page changes with it. It was
          last reviewed when the page was published.
        </p>
      </Prose>
    </>
  );
}
