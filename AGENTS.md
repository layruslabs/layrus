<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project: Layrus Technology Website

This is the marketing website for **Layrus Technology**, a Nigerian engineering
company. It is a **static Next.js 16 App Router site** — no database, no auth,
no dynamic routes yet.

### Architecture

The chrome — `Navbar`, `<main>`, `Footer` — lives in `app/layout.tsx`, not in
`page.tsx`. Every route needs it, and a nav that has to be re-added per page is
a nav that eventually goes missing from one of them.

```
lib/
  services.ts      — the six services. Single source: the footer links to
                     every one and the homepage cards render four of them
  projects.ts      — the four shipped products, written from their repos

app/
  services/        — index + [slug], generated from lib/services
  projects/        — index + [slug] case studies, from lib/projects
  about/ contact/ blog/ solutions/ privacy/ terms/
  not-found.tsx    — branded 404, rendered inside the shell
```

**Everything under `app/` except `page.tsx` is a real page now.** The site
previously linked to `/services`, `/about`, `/projects`, `/blog`, `/contact`
and eleven deeper routes that all 404'd.

**Service and project pages are generated, never hand-written.** Both lists
live in `lib/` and drive the index pages, the detail pages, `generateStaticParams`
and `sitemap.ts`. An unknown slug calls `notFound()`, so a bad URL renders the
branded 404 rather than an empty page.

### Product marks and screenshots

`components/ProductMark.tsx` renders each product's own logo. Two ship as real
files in `public/projects/`; the other two have **no logo asset at all** —
their brands exist only as inline SVG inside their own front ends — so the
geometry is copied verbatim from those components and drawn on the tile each
product puts it on. Nothing there is redrawn by eye.

The Recent Projects cards lead with a **screenshot of the product's own landing
page** (`public/projects/<slug>-shot.png`, 16:10, captured from the top) rather
than its logo — a portfolio card should show the thing, not its mark. Those
screenshots are of live sites, so they age: re-capture them when a product's
landing page changes, or the cards will advertise a design that no longer
exists.

**`shot` is optional, and the fallback is deliberate.** AI Sales Employee is a
signed-in dashboard with no public page, and its sign-in screen is a blank
white form — in a card that looked broken. It falls back to its mark on the
same 16:10 panel, so the row still aligns. Give it a real screenshot only if
one exists.

### Architecture

```
app/
  layout.tsx       — root layout: Inter + Playfair Display + Layrus Display
                     fonts, JSON-LD, ThemeProvider
  fonts/           — LayrusDisplay-{Bold,Regular}.{ttf,woff2}, the brand face
  page.tsx         — homepage: composes all section components
  globals.css      — CSS custom properties for light/dark theme, Tailwind v4
  robots.ts        — Next.js MetadataRoute.Robots (includes AI crawlers)
  sitemap.ts       — Next.js MetadataRoute.Sitemap

components/
  Navbar.tsx       — fixed top nav, mobile hamburger, theme toggle
  Footer.tsx       — logo, link columns, social row, legal bar
  LayrusMark.tsx   — GENERATED: the pangolin mark as one vector path
  ArchitectureDiagram.tsx — the node-and-connector diagram, driven by a spec
  LayrusWordmark.tsx — LAYRUS + TECHNOLOGY logotype, set in Layrus Display
  Arrow.tsx        — the one arrow glyph every link and button uses
  ThemeProvider.tsx — next-themes wrapper, attribute="data-theme"
  ThemeToggle.tsx  — client component, sun/moon button
  sections/        — page order lives in app/page.tsx
    Hero.tsx              — headline, CTAs, ruled stats + an editorial
                            collage: engineer photo, PCB shot, system
                            architecture card, terracotta accent card
    TrustBar.tsx          — "trusted by" strip
    CoreCapabilities.tsx  — 4 service cards, each showing that field's
                            architecture diagram
    WhyLayrus.tsx         — deep green band, photo, stats
    RecentProjects.tsx    — 4 case-study cards
    Platforms.tsx         — deep green grid of shipped systems
    WhoWeBuildFor.tsx     — 4 sector cards
    Compliance.tsx        — registrations / certification strip
    Insights.tsx          — 3 article cards
    StartProject.tsx      — enquiry form + contact details

app/
  favicon.ico      — GENERATED multi-size icon (16/32/48/64)
  icon.png         — GENERATED 512px app icon
  apple-icon.png   — GENERATED 180px touch icon

public/
  custom_font.png — source bitmap of the logotype (the brand font's origin)
  logo.svg        — GENERATED: the pangolin traced to vectors
  logo.png        — GENERATED: 1230x1092 raster, for og:image and anywhere
                    that needs a bitmap
  llms.txt        — GEO: structured plain-text description for LLM crawlers

scripts/
  build-logo.py        — scales + recolours the pangolin into public/logo.png
  build-logo-svg.py    — traces the pangolin into public/logo.svg + the
                         LayrusMark component
  build-favicon.py     — rasterises logo.svg into the favicon and app icons
  build-brand-font.py  — traces custom_font.png into app/fonts/*.{ttf,woff2}
  check-brand-font.py  — re-renders those fonts and diffs them vs the bitmap
  brandfont/vectorize.py — bitmap -> lines and arcs tracer used by the above
```

### Brand font

**The two weights share no letters, and that constrains what can be set in
them.** The face is traced from `custom_font.png`, which held exactly two rows:
LAYRUS in Bold and TECHNOLOGY in Regular. Bold has `A B L R S U Y`; Regular
has `B C E G H L N O T Y`. So a word needing A or S can only be set in Bold —
"LABS", which is what the tagline now reads, is Bold for that reason and no
other. It is heavier than the TECHNOLOGY it replaced; a lighter one needs an A
and an S drawn for Regular.

The **B does not exist in the bitmap at all** and is drawn analytically in
`build_b()` — a stem and two half-elliptical bowls at each weight's own stroke
width. It is the only constructed glyph; everything else is traced. The
rebuild is verified not to disturb the traced outlines: compare glyph
recordings before and after rather than trusting the pixel-diff percentage,
which drifts a few tenths between runs on its own.


`Layrus Display` is not a licensed typeface — it is traced from
`public/custom_font.png`, so the wordmark is the logotype itself rather than a
redrawing. The bitmap holds two weights: **Bold** carries `LAYRUS`, **Regular**
carries `TECHNOLOGY`; between them they cover every letter of the logo (and
only those letters, plus lowercase aliases). Letter spacing is baked into the
advances and a GPOS `kern` feature, so `LAYRUS` in Bold reproduces the logo's
own spacing including the A/Y interlock.

Rebuilding needs pillow, fonttools and brotli:

```
python3 scripts/build-brand-font.py     # regenerate app/fonts/
python3 scripts/check-brand-font.py     # verify against the bitmap
```

### Logo

**The brand mark is the pangolin** (`public/logo.png`), paired with the
`LAYRUS` wordmark from the brand font. The triangle-“A” seen in the design
mockups under `docs/images/` is a placeholder, **not** the logo — do not
substitute it.

The mark is flat colour behind transparent seams, so
`scripts/build-logo.py` rebuilds it properly rather than resampling the RGB:
it upsamples the **alpha channel** (which carries the shape) and lays the
colour in flat. That matters because the source has a cream matte on its
antialiased edges — resampling the RGB drags that matte out into a pale
fringe, which is what made the mark look grubby on the dark theme.

`docs/images/logo-source.png` (410x364) is the master. It is itself a
stand-in: the original 622x596 export was lost. Tracing it to SVG, the way
`custom_font.png` was traced to a font, is what would make it genuinely
resolution-independent — nobody has done that yet. Previous SVG
reconstructions are in `~/.local/share/Trash/files/logo*.svg` as reference.

```
python3 scripts/build-logo-svg.py --check   # vector + LayrusMark component
python3 scripts/build-logo.py               # 3x raster -> public/logo.png
python3 scripts/build-favicon.py            # favicon.ico + app icons
```

The nav and footer use `LayrusMark` (inline SVG) rather than the PNG, so the
mark is crisp at any DPI and inherits `currentColor` from the surrounding
link, which already sets `--accent-green`.

### Theme System

Five brand colours come straight from the client's palette
(`docs/images/color_palette.png`); everything else is derived:

| Token | Hex | Use |
|---|---|---|
| `--forest-green` | `#0F6B43` | primary green, CTAs, card outlines |
| `--warm-beige` | `#D9D6C9` | light page background |
| `--dark-cocoa` | `#4A2E1F` | light-theme headings, dark page background |
| `--burnt-clay` | `#8B3A0E` | deep accent |
| `--warm-terracotta` | `#B46E3A` | section eyebrows, dark-theme CTAs |

- Light page is the warm beige; dark page is a cocoa-black (`#17110B`), not a neutral grey
- Dark: toggled via `data-theme="dark"` on `<html>`
- All colours use CSS custom properties — **never hardcode hex values in components**
- Use `style={{ color: "var(--text-primary)" }}` pattern, not Tailwind colour classes

### Architecture diagrams

`ArchitectureDiagram` renders every diagram on the site from a `DiagramSpec`:
an ordered list of stages, each a row of one to three nodes, with `band: true`
for the full-width bar. `skipDrops` removes a connector (the hero uses it so
Users does not appear to talk to the backend directly).

**Each diagram's stage count and row widths are meant to differ.** A three-tier
app, an agent pipeline, a device signal chain and a scale-out topology are not
the same shape, and forcing them into one template is what makes a diagram read
as decoration. Nodes name *roles*, not enumerations — web, mobile and desktop are
one `Client` node, not three boxes.

**Connectors are routed, not assumed.** A band spans the row, so it drops
straight onto every node below it; rows of equal width drop straight down;
rows of *unequal* width (one gateway feeding two services) route through a
horizontal bus, because a straight drop would land in the gap between boxes.

**The diagrams animate, one box at a time.** One signal runs the graph each
cycle: a box brightens, the wire out of it carries a pulse, the box the pulse
lands on brightens, and so on. A row of three boxes lights three times, not
once — brightness always follows a signal that arrived, never leads it.

Which box lights when is `spec.order`, a list of `[stage, node]` pairs in visit
order, defaulting to reading order. Layout cannot supply it: on the device
chain the actuators are drawn beside the sensors but are the last thing the
system drives, so they are last in the route. Give `order` the wrong set of
boxes and `next build` fails, rather than shipping a diagram that animates
quietly wrong.

Everything is phase-shifted off one `--arch-cycle`; `--arch-slot` is a box's
position in the route and its pulse takes the slot before it, so a connector
fires in the gap between the two boxes it joins. Connectors are drawn in the
direction the signal travels, which is why the drop into the actuators runs
back up the page. Every connector carries `pathLength={100}`, normalising it so
one pair of keyframes fits any line length. It is pure CSS, so the diagrams
stay server components, and it is switched off under `prefers-reduced-motion`.

### Section backdrops

Two bands carry a photo behind their content — the trust strip and *Systems
we've built*. Both put a scrim of `--bg-invert` over the image before any type
sits on it, so the contrast is set by the scrim and not by whatever part of the
photo happens to be underneath.

**Both photos are blurred, and that is load-bearing.** A crisp photo behind a
dense grid competes with it — the first attempt put running dashboards behind
the platforms list and their own axis labels were legible through the rows.
Blur is what demotes the photo from content to depth, and it is what lets the
scrim sit as light as 0.78 without the type suffering.

The trust strip's backdrop also drifts (`.photo-drift`). Photos on these bands
are oversized — `scale(1.14)` for the drifting one, `scale(1.06)` for the
blurred static one — because both the blur and the travel bleed past the edges
and would otherwise uncover them.

### Hero: the angled collage

The right-hand collage carries a `rotateY` under perspective, which is what
gives the panel its depth. It is an inline transform rather than a class
because it is used once.

**The two hero columns are matched by sizing, not by stretching.** The
collage's height is set by the engineer photo's aspect ratio, and the photo is
trimmed (`aspect-[14/9]`) so the collage lands on the same height as the pitch
beside it — 626px each at 1440. The stat row also carries `lg:mt-auto`, but
that is now a safety net, not the mechanism: it only absorbs slack, and there
is none. Growing the collage without growing the left column reopens the hole;
it is the ratio, not the flex, that closes it.

### The two moving strips

**Testimonials** (`TestimonialCarousel` — a client component, and the only one
in the hero). It advances every 7s, holds while the pointer or focus is on it,
and stops for good once someone picks a slide. All three are deliberate:
WCAG 2.2.2 wants a pause mechanism for anything that moves on its own, and
rotation that resumes after a deliberate choice is just noise.

Two things about it are load-bearing rather than stylistic:

- **Every slide is stretched to the tallest**, so the block is one fixed
  height. That matters here because the hero's columns are matched by height —
  a carousel that grew and shrank would drag the whole grid with it. It is
  also why the quotes have to stay about the same length; the note on
  `TESTIMONIALS` in `Hero.tsx` says so.
- **The indicators sit on the attribution's line**, absolutely positioned
  rather than on a row below it. A row of dots underneath would add ~20px to
  the column and break the match. Their padding is the tap target and the
  negative margin takes that padding back out of the layout.

**Client names** in the trust strip cross the band as a marquee. Two identical
groups sit in a row and the track slides by exactly half its width, so the loop
closes on itself. Each item carries its own trailing margin rather than the
groups carrying a gap between them — with a gap, half the track is not a whole
group and the join stutters once per cycle. The second group is `aria-hidden`,
and it is the one doing the work whenever the first has scrolled away.

### Type scale

Body copy is 17px and the smallest label is 12px (`--text-*` in the classes
below); nothing in the UI should drop under 12px. When adding type, prefer the
Tailwind steps (`text-base`, `text-xl`, …) over arbitrary `text-[…]` values so
the scale stays consistent.

### Shape

Nothing in the brand is rounded: buttons, cards, images and inputs are all
square-cornered. The circular `.icon-badge` is the single exception. Do not add
`rounded-*` utilities.

Custom classes (`.btn-primary`, `.card`, `.section-label`, …) live in
`@layer components` in `globals.css`. Keep them there — unlayered rules would
outrank Tailwind utilities and silently break responsive classes like `hidden`.

#### The assistant

`components/ChatWidget.tsx` (client) posts to `app/api/chat/route.ts`, which
streams plain-text deltas back from Claude. Two things about it are not
obvious and both were found the hard way:

**The prompt carries the whole site, not just services and projects.** An
earlier version knew only those two, so anything about process, credentials or
who they work for had nowhere to come from but "email us" — which is a
non-answer to a question the site already answers. `AUDIENCES`, `PROCESS` and
`REGISTRATIONS` in `lib/assistant.ts` close that.

**Two conduct rules earn their place.** *Lead with substance, not a
disclaimer* — asked whether the company can deliver, an earlier version opened
with "I can't promise…" and buried two live production systems underneath it.
And *do not end every reply by sending them to email* — it was doing that
reflexively, which reads as a deflection even when the answer above it was
good. Both are in the prompt as explicit instructions because both regress
easily.

The registrations block is deliberately worded as *what the site states*
rather than as fact to assert. Compliance.tsx carries its own warning that
those claims need confirming with the client before launch, and an assistant
asserting an unconfirmed certification to a procurement team is a liability.

**The system prompt is built, not written.** `lib/assistant.ts` assembles it
from `lib/services.ts` and `lib/projects.ts` — the same lists the pages render.
A hand-written prompt is a second copy of the site's content, and the second
copy is the one that goes stale: rename a service on a page and the assistant
keeps describing the old name. Anything reading those two files cannot
disagree with the pages it is talking about.

**The first delta is pulled before the response is committed.** `new
Anthropic()` does *not* check credentials — the SDK resolves them when the
request is made — and `toReadableStream()` only reports that failure after the
headers have gone out. That turns a missing key into a 200 followed by a dead
connection, which the browser can do nothing with. Awaiting the first text
delta moves every failure — no key, bad key, rate limit, model gone — to a
point where a status code can still be chosen. Do not "simplify" this back to
`return new Response(stream.toReadableStream())`.

Thinking deltas arrive and are deliberately dropped: a visitor should not
watch the model reason about them.

Requires `ANTHROPIC_API_KEY` in the environment. Without it the route answers
503 with a sentence rather than failing obscurely.

**Rate limiting is per-instance and best-effort** — see the `ponytail:` note in
the route. It stops a script hammering one instance and a person holding down
Enter; it does not stop a distributed one. The real ceilings are `MAX_TOKENS`
and the spend limit on the Anthropic account. Vercel's WAF rate limiting (no
code) or Upstash (shared state) is the upgrade.

## Key Constraints

- **The enquiry form does not submit anywhere.** `sections/StartProject.tsx`
  renders a `<form>` with no `action` and no handler, so the primary call to
  action on the site does nothing when pressed. It needs wiring to whatever
  receives enquiries before launch — an API route, a form service, or a
  mailto fallback. This is the largest open gap on the site.
- The legal pages (`/privacy`, `/terms`) are drafted from what the site
  actually does, but **neither has been reviewed by a lawyer**. Terms of
  service in particular is a summary, not an agreement.


- All pages are **Server Components** by default; only use `"use client"` where
  interactivity is genuinely required (ThemeToggle, Navbar hamburger)
- Section copy that is not yet real (client names in TrustBar, the Platforms
  list, every entry in Compliance, and **all three hero testimonials — every
  quote, person, role and company is invented**) is placeholder text. Check
  these with the client before launch, especially Compliance, which makes
  legal claims, and the testimonials, which put words in named people's
  mouths. Real quotes or none at all; invented ones are a liability, not
  filler
- `font-700`, `font-600`, `font-500` are Tailwind arbitrary weight classes —
  use `font-bold` / `font-semibold` / `font-medium` instead if Tailwind v4
  doesn't pick them up
