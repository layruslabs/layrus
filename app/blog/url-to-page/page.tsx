import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, CtaBand } from "@/components/PageHeader";
import { Arrow } from "@/components/Arrow";

export const metadata: Metadata = {
  title: "What happens when you type a URL",
  description:
    "The six steps between the address bar and the first paint — DNS, the TLS handshake, the request, the server and the render — and the four checks behind the padlock.",
  alternates: { canonical: "/blog/url-to-page" },
  openGraph: {
    type: "article",
    title: "What happens when you type a URL",
    description:
      "A two-minute explainer and a written walkthrough of the trip from URL to painted page, including the TLS handshake most explanations skip.",
    publishedTime: "2026-11-14",
    images: ["/videos/url-to-page-poster.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "What happens when you type a URL",
    description:
      "DNS, the handshake, the request, the render — and the four checks behind the padlock.",
    images: ["/videos/url-to-page-poster.jpg"],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What happens when you type a URL",
  description:
    "The six steps between the address bar and the first paint, and the four certificate checks behind the padlock.",
  datePublished: "2026-11-14",
  dateModified: "2026-11-14",
  author: {
    "@type": "Organization",
    name: "Layrus Labs",
    url: "https://layrus.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Layrus Labs",
    url: "https://layrus.com",
    logo: {
      "@type": "ImageObject",
      url: "https://layrus.com/logo.png",
    },
  },
  image: "https://layrus.com/videos/url-to-page-poster.jpg",
  mainEntityOfPage: "https://layrus.com/blog/url-to-page",
  video: {
    "@type": "VideoObject",
    name: "What happens when you type a URL",
    description:
      "A two-minute teardown of the trip from the address bar to a painted page, with the TLS handshake opened up step by step.",
    thumbnailUrl: "https://layrus.com/videos/url-to-page-poster.jpg",
    uploadDate: "2026-11-14",
    duration: "PT1M59S",
    contentUrl: "https://layrus.com/videos/url-to-page-full.mp4",
  },
};

const body: CSSProperties = {
  color: "var(--text-secondary)",
  fontFamily: "var(--font-inter)",
};

function P({ children }: { children: ReactNode }) {
  return (
    <p style={body} className="text-base leading-relaxed">
      {children}
    </p>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
      className="mt-6 text-2xl md:text-[1.75rem] font-bold leading-tight"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter)" }}
      className="mt-3 text-lg font-semibold"
    >
      {children}
    </h3>
  );
}

function Th({ children, scope }: { children: ReactNode; scope: "col" | "row" }) {
  return (
    <th
      scope={scope}
      style={{ borderColor: "var(--border-card)", color: "var(--text-primary)" }}
      className="border px-3 py-2.5 align-top text-left text-sm font-semibold leading-relaxed"
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return (
    <td
      style={{ borderColor: "var(--border-card)", color: "var(--text-secondary)" }}
      className="border px-3 py-2.5 align-top text-left text-sm leading-relaxed"
    >
      {children}
    </td>
  );
}

export default function UrlToPagePost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <PageHeader
        eyebrow="Explainer"
        title="What happens when you type a URL"
        intro="The page appears before you notice the work. Six steps happen between the address bar and the first paint, and one of them — the handshake — is where the browser decides whether it can trust the server at all."
      />

      <article className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          <figure className="lg:sticky lg:top-28">
            <div className="aspect-[9/16] bg-black">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/videos/url-to-page-poster.jpg"
                aria-label="What happens when you type a URL — full explainer"
                className="w-full h-full object-cover"
              >
              <source src="/videos/url-to-page-full.mp4" type="video/mp4" />
              <track
                kind="captions"
                src="/videos/url-to-page-full.vtt"
                srcLang="en"
                label="English"
              />
              Your browser does not support the video element.
              </video>
            </div>
            <figcaption style={body} className="mt-3 text-sm leading-relaxed">
              The full cut, 1:59. The handshake deep dive starts at 0:22.
            </figcaption>
          </figure>

          <div className="max-w-2xl flex flex-col gap-5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-[var(--text-primary)]">
            <P>
              The page appears before you have time to notice the work. Between
              the address bar and the first paint, the browser resolves a name,
              opens a connection, proves who it is talking to, asks for a
              document, and renders what comes back. Six steps. On a warm
              connection, all of it happens in under a second.
            </P>

            <p style={body} className="text-sm">
              <time dateTime="2026-11-14">14 November 2026</time> · 5 min read
            </p>

            <H2>Six stops before the page appears</H2>

            <ol
              style={body}
              className="flex flex-col gap-3 pl-5 list-decimal text-base leading-relaxed [&_strong]:text-[var(--text-primary)]"
            >
              <li>
                <strong>The name becomes a number.</strong>{" "}
                <code>layrus.com</code> is a label; routers need an address. The
                browser asks a resolver for the A or AAAA record. If the answer
                is cached, the lookup is nearly free. If it is not, it can cost
                tens of milliseconds before anything else starts.
              </li>
              <li>
                <strong>The connection is opened and authenticated.</strong> The
                browser opens a transport connection, then TLS proves the server
                is who it claims to be and derives keys for the conversation.
              </li>
              <li>
                <strong>The request goes out.</strong> Only after the connection
                is secure does the browser send <code>GET /</code> with the
                host, headers and cookies.
              </li>
              <li>
                <strong>The server answers.</strong> The application returns a
                status and a document. <code>200 OK</code> plus HTML is the
                happy path.
              </li>
              <li>
                <strong>The document arrives.</strong> The HTML is parsed; CSS,
                JavaScript, fonts and images are fetched.
              </li>
              <li>
                <strong>The browser paints.</strong> It builds the DOM and the
                CSSOM, lays the page out, paints, and runs the JavaScript that
                changes it.
              </li>
            </ol>

            <H2>The handshake is the part you cannot see</H2>

            <P>
              The <code>https</code> in the address is the instruction to
              encrypt. HSTS can force it even when the URL is typed as{" "}
              <code>http</code>. The browser then has a conversation with the
              server before it sends the request:
            </P>

            <H3>Client hello</H3>
            <P>
              The browser sends the TLS versions it speaks, the cipher suites it
              supports, a key share for the key exchange, the server name (SNI),
              and a random value.
            </P>

            <H3>Server hello</H3>
            <P>
              The server replies with the version and cipher it chose, its own
              key share and random value, and its certificate. It also proves it
              holds the private key that matches the certificate.
            </P>

            <H3>Four checks, not a feeling</H3>
            <P>
              The browser does not trust a certificate because it looks
              official. It checks four things:
            </P>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <Th scope="col">Check</Th>
                  <Th scope="col">What the browser looks for</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Th scope="row">Name</Th>
                  <Td>
                    The subject alternative name must match the host you typed.
                  </Td>
                </tr>
                <tr>
                  <Th scope="row">Chain</Th>
                  <Td>
                    The issuer must chain to a root already in the browser or
                    operating system trust store.
                  </Td>
                </tr>
                <tr>
                  <Th scope="row">Dates</Th>
                  <Td>Now must sit inside the certificate’s validity window.</Td>
                </tr>
                <tr>
                  <Th scope="row">Revocation</Th>
                  <Td>
                    The certificate must not have been revoked. Browsers use
                    OCSP, CRLs and CRLSets; some checks are soft-fail, which is
                    why revocation is the least certain of the four.
                  </Td>
                </tr>
              </tbody>
            </table>

            <P>
              If the checks pass, the server proves it holds the private key and
              both sides derive the same session key from an ECDHE exchange. The
              key is never sent. TLS 1.3 does this in one round trip; repeat
              visits can resume a session or use 0-RTT.
            </P>

            <div
              style={{ borderColor: "var(--accent-green)" }}
              className="border-l-2 pl-4"
            >
              <P>
                The certificate in the video is the one <code>layrus.com</code>{" "}
                served when it was recorded: subject <code>layrus.com</code>,
                issuer Let’s Encrypt, valid 26 Oct 2026 to 24 Jan 2027, SAN{" "}
                <code>layrus.com</code>. Certificates rotate, so the dates are a
                fact about that recording, not a permanent property of the site.
              </P>
            </div>

            <H2>When a check fails</H2>

            <P>
              An expired certificate, the wrong name, or an untrusted issuer
              makes the browser stop and show a warning instead of the page. No
              HTML is rendered. Some warnings can be bypassed; HSTS and pinned
              sites remove the bypass.
            </P>
            <P>
              A site with no encryption at all loads over <code>http</code> and
              the browser marks it “Not secure.” HSTS tells the browser to
              upgrade to <code>https</code> before the request; with preload,
              the browser never tries <code>http</code> in the first place.
            </P>
            <P>
              Mixed content is the other failure: an <code>https</code> page that
              pulls <code>http</code> resources is blocked or upgraded depending
              on the resource. The padlock covers the page, not every byte a
              careless script loads.
            </P>

            <H2>Why it still feels instant</H2>

            <P>
              The first visit pays the full cost. Repeat visits reuse DNS
              answers, TLS sessions, HTTP/2 or HTTP/3 connections, and cached
              assets. A CDN puts the origin closer. The “under a second” claim
              is the warm path; a cold DNS lookup or a distant origin can add
              hundreds of milliseconds.
            </P>
            <P>
              That is also why “just add a CDN” is not the whole answer. The
              first connection still has to do the handshake.
            </P>

            <H2>The internet is an agreement</H2>

            <P>
              The page appears because a chain of protocols agreed on names,
              addresses, keys, requests and bytes. No single company runs it.
              The padlock is the visible end of one agreement; the speed is the
              result of several others.
            </P>
            <P>
              Next time a page appears, the interesting part has already
              happened.
            </P>

            <Link href="/blog" className="btn-outline self-start mt-2">
              More insights
              <Arrow />
            </Link>
          </div>
        </div>
      </article>

      <CtaBand />
    </>
  );
}
