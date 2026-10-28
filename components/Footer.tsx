import Link from "next/link";
import { LayrusMark } from "@/components/LayrusMark";
import { LayrusTagline, LayrusWordmark } from "@/components/LayrusWordmark";
import { ORG } from "@/lib/seo";

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
    href: "https://www.linkedin.com/company/layruslabs",
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
    href: "https://github.com/layruslabs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/message/FSMZDBDIMZCOJ1",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/layruslabs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/layruslabs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1EGYy8WRAU/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
            <span className="block sm:inline sm:ml-2">
              RC {ORG.rcNumber} &middot; Registered in Nigeria
            </span>
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
