"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LayrusMark } from "@/components/LayrusMark";
import { LayrusTagline, LayrusWordmark } from "@/components/LayrusWordmark";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      role="banner"
      style={{
        backgroundColor: "var(--nav-bg)",
        borderBottomColor: "transparent",
      }}
      className={`fixed top-0 inset-x-0 z-50 border-b transition-[border-color,box-shadow] duration-200 backdrop-blur-sm ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          href="/"
          aria-label="Layrus Labs — home"
          style={{ color: "var(--accent-green)" }}
          className="flex items-center gap-3 shrink-0"
        >
          {/* Pangolin mark, traced to vectors, + the LAYRUS wordmark */}
          <LayrusMark height={44} />
          <span className="flex flex-col gap-[5px] leading-none">
            <LayrusWordmark color="var(--accent-green)" height={20} />
            <LayrusTagline color="var(--text-muted)" height={7.4} />
          </span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────────────── */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  color: active ? "var(--accent-green)" : "var(--text-secondary)",
                  fontFamily: "var(--font-inter)",
                }}
                className="relative text-base font-medium transition-colors duration-150 hover:text-[var(--text-primary)] group"
              >
                {label}
                {/* active underline — orange per design */}
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: "var(--nav-active)" }}
                  className={`absolute -bottom-0.5 left-0 h-px transition-all duration-200 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── Right actions ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/contact"
            className="btn-primary hidden sm:inline-flex"
          >
            Start a project
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span
              style={{ backgroundColor: "var(--text-primary)" }}
              className={`block w-5 h-px transition-transform duration-200 origin-center ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              style={{ backgroundColor: "var(--text-primary)" }}
              className={`block w-5 h-px transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              style={{ backgroundColor: "var(--text-primary)" }}
              className={`block w-5 h-px transition-transform duration-200 origin-center ${
                open ? "-translate-y-[9px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ────────────────────────────────────────────────── */}
      <div
        id="mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
        style={{ backgroundColor: "var(--nav-bg)", borderTopColor: "var(--nav-border)" }}
        className={`md:hidden border-t overflow-hidden transition-all duration-250 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  color: active ? "var(--accent-green)" : "var(--text-secondary)",
                  fontFamily: "var(--font-inter)",
                }}
                className="py-2.5 text-base font-medium border-b border-[var(--border)] last:border-0
                           hover:text-[var(--text-primary)] transition-colors duration-150"
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="btn-primary mt-3 justify-center"
          >
            Start a project
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
