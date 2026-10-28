# layrus.com

The website for **Layrus Labs Ltd**, an engineering company in Abuja, Nigeria —
custom software, AI automation and connected hardware.

Next.js 16 (App Router), React 19, Tailwind v4. Every page is prerendered;
three API routes handle the assistant, its saved history and the contact form.

## Running it

The repo uses **pnpm** — `pnpm-lock.yaml` is the lockfile.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
```

Node 20.9 or newer.

### Environment

Copy `.env.example` to `.env.local`. Nothing is required to build or serve the
site — only the assistant reads these, and without a key it answers 503 with a
message rather than failing obscurely.

```bash
# Anthropic directly
ANTHROPIC_API_KEY=sk-ant-...

# …or DeepSeek, which serves an Anthropic-compatible endpoint. The model name
# still says claude-opus-5-5: DeepSeek maps claude-opus* to deepseek-v4-pro.
ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
ANTHROPIC_API_KEY=<your deepseek key>
```

`LYRA_MODEL` overrides the model if you ever need to pin one.

`DATABASE_URL` points at a Neon Postgres database and turns on two things:
chat transcripts, written only when the visitor asks for them, and contact-form
enquiries. Run `scripts/schema.sql` against it once — it is a single `do` block
because Neon's editor rejects multi-statement scripts, and it is idempotent.

Without it the assistant still answers, but the contact form reports that it
could not save the enquiry. That is how local development and previews run.

### Form email (Spacemail SMTP)

Spacemail has no sending API. The contact form sends its notification through
the mailbox's own SMTP server, from the same address, so SPF and DKIM already
pass:

```bash
SMTP_USER=hello@layrus.com
SMTP_PASS=<the mailbox password>   # Spacemail Manager → mailbox → IMAP/POP3/SMTP
ENQUIRY_TO=hello@layrus.com        # where the notification lands
# SMTP_HOST=mail.spacemail.com     # defaults
# SMTP_PORT=465                    # defaults; 465/SSL is the documented port
```

`SMTP_FROM` is optional and only useful once the address exists as an **alias**
on the mailbox, e.g. `website@layrus.com`; replies still go to the enquirer
through `replyTo`.

The enquiry is written to the database first and then emailed. If the email
does not go out, **the form says so** and asks the person to write to
`hello@layrus.com` directly. That is deliberate: the database is a record for
later, not an inbox anyone is watching, so a silent failure would be a lost
enquiry.

## Layout

```
app/            routes — one page.tsx per URL
  api/chat/     Lyra's streaming endpoint
  api/chat/history/  the saved conversation a returning browser resumes
  api/enquiry/  the contact form: validate, store, then email
components/     Navbar, Footer, diagrams, the assistant, page sections
lib/
  services.ts   the six services — drives pages, cards, sitemap, llms.txt
  projects.ts   the nine shipped systems
  team.ts       the people — the About page and Lyra's WHO WE ARE block
  seo.ts        structured data (JSON-LD) for every entity
  assistant.ts  Lyra's system prompt, built from the lists above
  transcripts.ts / enquiries.ts  Postgres access
  mailer.ts     Spacemail SMTP, the enquiry notification
scripts/        schema.sql, and the asset-generation scripts
public/         logos, hero and social images, project shots, llms.txt
docs/           google-business.md — the off-platform setup steps
AGENTS.md       deep notes: conventions, traps, and why things are the way they are
```

**Data drives the site.** Services, projects and team each exist once, in
`lib/`, and the pages, the sitemap, `llms.txt` and the assistant's prompt all
read from those same files. Renaming a service means editing one line, not
seven.

## SEO and GEO

| Surface | Where |
|---|---|
| Per-page metadata + canonicals | each `page.tsx` |
| Structured data (JSON-LD) | `lib/seo.ts`, emitted via `<JsonLd>` |
| Sitemap — 24 URLs, generated | `app/sitemap.ts` |
| robots.txt — AI crawlers explicitly welcome | `app/robots.ts` |
| `llms.txt` — plain-text brief for LLMs | `public/llms.txt` |
| Social card, 1200×630 | `public/og-image.png` |

The sitemap is generated from `lib/services.ts` and `lib/projects.ts`, so a new
service or project cannot be published without appearing in it. Pages are added
to the static list in `app/sitemap.ts`.

**Still to do off-platform**, because neither can be done from this repo:

1. **Submit the sitemap** to Google Search Console and Bing Webmaster Tools
   (`https://www.layrus.com/sitemap.xml`). Bing's verification file is already
   in `public/BingSiteAuth.xml`; Google still needs DNS or a file upload through
   your account.
2. **Create the Google Business Profile** — see `docs/google-business.md`. The
   registered address is now in `lib/seo.ts`; a phone number is still missing.

## The assistant

`components/ChatWidget.tsx` posts to `app/api/chat/route.ts`, which streams from
Claude. The system prompt is assembled from the service and project data, so it
cannot describe the company differently from the pages it is talking about.

Two things in that route are load-bearing and explained in comments: the first
delta is pulled before the response is committed (so an auth failure becomes a
status code rather than a dead connection), and thinking deltas are dropped
deliberately. Rate limiting is per-instance and best-effort — the real ceiling
is the spend limit on your API account.

## Deploying

The repository is `github.com/layruslabs/layrus`. On Vercel, connect that repo,
set the environment variables above, and deploy. All pages prerender; the three
API routes run as Node serverless functions.

Use Neon's **pooled** connection string for `DATABASE_URL` (the `-pooler` host).
The pool is capped at one connection per invocation, which is what keeps
serverless deploys from exhausting Neon's limit.
