# Google Business Profile — setup pack

**This cannot be created from the codebase.** A Business Profile is tied to a
Google account, verified by phone, postcard or video, and it must describe a
real, staffed location. Everything below is what you need to do the setup
yourself in about twenty minutes, plus the fields the site already declares so
the two match.

---

## The one thing that has to be decided first

**Settled: Abuja.** Google matches a website to a
Business Profile by comparing name, address and phone. If they disagree, the
listing and the site are treated as two different businesses and neither ranks.

Decide the operating base, then change one of them so they agree. The site
currently states Abuja in six places (`app/layout.tsx`, `lib/seo.ts`,
`app/about`, `app/contact`, the OG image, and `public/llms.txt`).

Still missing, and required by Google: **a phone number**. The address and RC
number are now in `lib/seo.ts`; no telephone appears anywhere on the site.

---

## 1. What to enter

Set these once, then keep every other listing identical to them.

| Field | Value |
|---|---|
| Business name | `Layrus Labs` — exactly, no "Ltd", no keywords |
| Registration | `RC 9918991` — add it to the profile description; it is a trust signal for enterprise buyers |
| Category (primary) | *Software company* |
| Secondary categories | *Computer consultant*, *Web designer*, *Information technology support service* |
| Address | `Shop CB11/283, International Motor Spare Parts Market, Zuba, FCT` — as registered. The CAC record spells "International" as "NTERNATIONAL"; use one spelling in both places. Note this is a market unit, not a walk-in office |
| Service area | Abuja (FCT) and surrounding states |
| Phone | ⚠️ **you must supply** — a number you answer. Google calls it during verification |
| Website | `https://www.layrus.com` |
| Email | `hello@layrus.com` |
| Hours | Your real hours. Do not claim 24/7 |
| Description | 750 characters max — use the block below |
| Attributes | "Online appointments", "Appointment required" if true |

### Description (copy this)

> Layrus Labs is an engineering company in Abuja, Nigeria. We design, build and
> implement custom software systems, AI automation and connected hardware for
> businesses with complex technical needs. Our work spans financial services,
> agriculture, healthcare, education, mobility, logistics and blockchain —
> including a workshop management platform for a Mercedes-Benz specialist, a
> hiring marketplace that holds client money in escrow, and IoT monitoring for
> farm equipment. We work from discovery through to long-term support, so
> clients deal with the same team that built the system. Nine systems shipped
> to date.

### Photos (Google ranks profiles with photos higher)

Minimum four, 720×720 or larger, no text overlay:

1. The pangolin mark on a plain background — `public/logo.png`
2. A real photograph of the workspace or team
3. One product screenshot per sector, from `public/projects/*-shot.png`
4. The social card, `public/og-image.png`

---

## 2. Verification

Google offers phone, SMS, email, postcard or video depending on category and
country. For a software company in Nigeria, expect **video verification** or a
**postcard** — and postcards take 1–2 weeks. Start early.

For video: they ask you to show the workspace, the equipment you work on, and
proof you can operate there (a key, a sign, a document with the address). Have
those ready before you start the recording.

---

## 3. After it is live

- [ ] Add the **same** NAP to `lib/seo.ts` (`streetAddress`, `postalCode`, `telephone`) so the schema matches the listing
- [ ] Add the profile URL to `sameAs` in `lib/seo.ts` and to the footer socials
- [ ] Post to the profile monthly — Google favours active profiles
- [ ] Ask the clients in `public/projects/` for reviews; reply to every one
- [ ] Register the same details with Bing Places, which is a one-click import of the Google listing

## 4. Do not

- Do not put keywords in the business name ("Layrus Labs — Software Company
  Abuja"). It is a suspension risk.
- Do not use a virtual office or a P.O. box as the address.
- Do not create a second listing for the same business at a second address.
  One business, one listing.
