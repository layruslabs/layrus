import Link from "next/link";
import { Arrow } from "@/components/Arrow";

const TRANSCRIPT = [
  "Have you ever wondered what happens when you click a link? You click a link or type an address, and just like that, a page appears. First, the name. Your browser can’t use it, because the internet only speaks numbers. So it asks a resolver: what’s the number behind layrus dot com? Then it opens a connection, and proves who’s on the other end.",
  "The address starts with https, so the browser knows this page has to be encrypted. It opens a connection and says hello: the TLS versions it speaks, the ciphers it supports, and a random number. The server replies with the version and cipher it chose, its own random number, and its certificate. That certificate is the server’s ID: who it claims to be, who issued it, and when it expires. First check: does the name on the certificate match the address you typed? Second: does the issuer chain back to a root the browser already trusts? Third: are the dates valid, and has the certificate been revoked? Then the server proves it holds the private key, and both sides derive the same session key without ever sending it. From that moment, everything is encrypted. The padlock is not a sticker; it is what four passed checks look like. If any check fails, the browser stops and shows a warning instead of the page: an expired certificate, the wrong name, or an untrusted issuer. And if a site offers no encryption at all, the browser marks it not secure, and HSTS can refuse to load it over http entirely.",
  "Only then does the request go out. The server answers with the page. And the browser paints it. All of it, in under a second. The internet isn’t a place. It’s an agreement about how to pass a message.",
];

export function FeaturedVideo() {
  return (
    <section aria-labelledby="featured-video-heading" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-5">
            <p className="section-label">Watch</p>
            <h2
              id="featured-video-heading"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.25rem] md:text-[3rem] font-bold leading-tight max-w-2xl"
            >
              What happens when you type a URL
            </h2>
            <p
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
              className="text-base leading-relaxed max-w-xl"
            >
              A two-minute teardown of the trip from the address bar to a painted
              page: DNS, the TLS handshake, the request, the server and the render.
              The handshake is opened up step by step — the client and server hello,
              the certificate, the four checks, and what the browser does when one
              fails.
            </p>
            <p
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
              className="text-sm"
            >
              From the URL to page series. The transcript is below.
            </p>
            <details
              style={{ borderColor: "var(--border-card)" }}
              className="border-t pt-4"
            >
              <summary
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter)" }}
                className="cursor-pointer text-sm font-semibold"
              >
                Read the transcript
              </summary>
              <div className="mt-4 flex flex-col gap-3">
                {TRANSCRIPT.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                    className="text-sm leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
            <Link href="/blog/url-to-page" className="btn-outline self-start">
              Read the full breakdown
              <Arrow />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-[360px] aspect-[9/16] bg-black">
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
        </div>
      </div>
    </section>
  );
}
