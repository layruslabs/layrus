import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";

/* Post titles are the ones sketched in the dark-theme design. */
const POSTS = [
  {
    tag: "Technology",
    title: "The future of embedded systems in Africa",
    excerpt:
      "Hardware is finally cheap enough and connected enough to solve problems that software alone could not.",
    date: "12 Oct 2025",
    dateTime: "2025-10-12",
    photo:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
    alt: "Circuit board close-up",
  },
  {
    tag: "Product",
    title: "From prototype to production: what actually takes?",
    excerpt:
      "The gap between a working demo and a system you can run a business on is mostly unglamorous work.",
    date: "03 Oct 2025",
    dateTime: "2025-10-03",
    photo:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=85",
    alt: "Team reviewing a product plan",
  },
  {
    tag: "Industry",
    title: "How AI is transforming African businesses",
    excerpt:
      "Where automation actually pays for itself today, and where it is still a solution looking for a problem.",
    date: "21 Sep 2025",
    dateTime: "2025-09-21",
    photo:
      "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=800&q=85",
    alt: "Aerial view of farmland",
  },
] as const;

export function Insights() {
  return (
    <section aria-labelledby="insights-heading" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-3">
            <p className="section-label">Insights</p>
            <h2
              id="insights-heading"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.75rem] md:text-[3.5rem] font-bold max-w-xl"
            >
              Ideas, tech and real-world lessons
            </h2>
          </div>
          <Link href="/blog" className="btn-outline self-start lg:self-auto">
            All articles
            <Arrow />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" role="list">
          {POSTS.map((p) => (
            <article
              key={p.title}
              role="listitem"
              style={{ borderColor: "var(--border-card)" }}
              className="group flex h-full flex-col border"
            >
              <div className="media aspect-[16/9]">
                <Image src={p.photo} alt={p.alt} fill className="object-cover"
                       sizes="(max-width:768px) 100vw, 33vw" />
              </div>

              <div className="flex flex-col gap-3 p-5 flex-1">
                <span
                  style={{ color: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
                  className="eyebrow"
                >
                  {p.tag}
                </span>
                <h3
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
                  className="text-xl font-bold leading-snug"
                >
                  {p.title}
                </h3>
                <p
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                  className="text-base leading-relaxed flex-1"
                >
                  {p.excerpt}
                </p>
                <div
                  style={{ borderTopColor: "var(--border-subtle)" }}
                  className="mt-auto flex items-center justify-between pt-4 border-t"
                >
                  <time
                    dateTime={p.dateTime}
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                    className="text-sm"
                  >
                    {p.date}
                  </time>
                  <Link
                    href="/blog"
                    aria-label={`Read: ${p.title}`}
                    style={{ color: "var(--text-muted)" }}
                    className="transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
                  >
                    <Arrow />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
