import Link from "next/link";
import { LayrusMark } from "@/components/LayrusMark";
import { LayrusTagline, LayrusWordmark } from "@/components/LayrusWordmark";

/* ─── Footer nav columns ─────────────────────────────────────────────────────── */
const NAV_COLUMNS = [
  {
    heading: "Quick Links",
    links: [
      { label: "Home",      href: "/"          },
      { label: "Services",  href: "/services"  },
      { label: "Solutions", href: "/solutions" },
      { label: "Projects",  href: "/projects"  },
      { label: "About",     href: "/about"     },
      { label: "Contact",   href: "/contact"   },
    ],
  },
  {
    heading: "Our Services",
    links: [
      { label: "Software Systems",      href: "/services/software"   },
      { label: "AI & Automation",       href: "/services/ai"         },
      { label: "Embedded & Connected",  href: "/services/embedded"   },
      { label: "Cloud & Infrastructure",href: "/services/cloud"      },
      { label: "Technical Discovery",   href: "/services/discovery"  },
      { label: "Managed Implementation",href: "/services/managed"    },
    ],
  },
] as const;

/* ─── Social icons ───────────────────────────────────────────────────────────── */
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/layrus",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/layrus",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/layrustech",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
] as const;

/* ─── Logo mark ──────────────────────────────────────────────────────────────── */
function FooterLogo() {
  return (
    <Link
      href="/"
      aria-label="Layrus Labs — home"
      className="flex items-center gap-3 shrink-0"
    >
      <LayrusMark height={38} />
      <span className="flex flex-col gap-[4px] leading-none">
        <LayrusWordmark color="var(--accent-green)" height={16.5} />
        <LayrusTagline color="var(--text-muted)" height={6.1} />
      </span>
    </Link>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{ borderTopColor: "var(--border)" }}
      className="border-t"
    >
      {/* ── Main footer body ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 lg:gap-16">

          {/* Left: logo + tagline */}
          <div className="flex flex-col gap-4 max-w-[200px]">
            <FooterLogo />
            <p
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
              className="text-[0.8125rem] leading-relaxed tracking-wide uppercase"
            >
              Engineering technology<br />
              for real-world businesses.
            </p>
          </div>

          {/* Right: nav columns + Stay in the loop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {NAV_COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter)" }}
                  className="text-sm font-semibold mb-4 tracking-wide"
                >
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label + link.href}>
                      <Link
                        href={link.href}
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                        className="text-sm leading-snug transition-colors duration-150
                                   hover:text-[var(--accent-green)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Stay in the loop */}
            <div>
              <p
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter)" }}
                className="text-sm font-semibold mb-4 tracking-wide"
              >
                Stay in the loop
              </p>
              <p
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                className="text-sm leading-relaxed mb-3"
              >
                Insights on engineering, product development, AI and embedded systems
                building for Africa.
              </p>
              <Link
                href="/blog"
                style={{ color: "var(--accent-green)", fontFamily: "var(--font-inter)" }}
                className="inline-flex items-center gap-1.5 text-sm font-medium
                           transition-opacity hover:opacity-75"
              >
                Explore blog
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div
        style={{ borderTopColor: "var(--border)" }}
        className="border-t"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-12 flex items-center justify-between gap-4">

          {/* Copyright */}
          <p
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
            className="text-[0.8125rem]"
          >
            &copy; {year} Layrus Labs Ltd. All rights reserved.
          </p>

          {/* Center nav links */}
          <nav
            aria-label="Footer navigation"
            className="hidden md:flex items-center gap-5"
          >
            {(["Services", "Projects", "About", "Contact"] as const).map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                className="text-[0.8125rem] transition-colors duration-150
                           hover:text-[var(--text-secondary)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Social icons + legal links */}
          <div className="flex items-center gap-4">
            {/* Separator */}
            <div
              style={{ backgroundColor: "var(--border)" }}
              className="hidden md:block w-px h-4"
              aria-hidden="true"
            />

            {/* Socials */}
            <div className="flex items-center gap-3" role="list" aria-label="Social media links">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Layrus Labs on ${label}`}
                  role="listitem"
                  style={{ color: "var(--text-muted)" }}
                  className="transition-colors duration-150 hover:text-[var(--accent-green)]"
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Separator */}
            <div
              style={{ backgroundColor: "var(--border)" }}
              className="hidden md:block w-px h-4"
              aria-hidden="true"
            />

            {/* Legal */}
            <nav aria-label="Legal" className="hidden md:flex items-center gap-4">
              {(["Privacy", "Terms", "Contact"] as const).map((label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase()}`}
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                  className="text-[0.8125rem] transition-colors duration-150
                             hover:text-[var(--text-secondary)]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
