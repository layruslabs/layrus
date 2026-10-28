# Catalogue — WhatsApp Business and Google Business Profile

Both surfaces list what you sell, and both want a **price per item**. This site
publishes none, and inventing one creates a number a buyer will plan around.

Decide this before you start:

- **If you have a floor price** for a piece of work, publish "From ₦X" — it
  filters out enquiries you cannot serve and makes the listing useful.
- **If you do not**, use `Price on request` where the field takes text. Where
  it insists on a number, enter `0` and make the first line of the description
  say "Priced after a scoping call", so nobody reads zero as free.

Everything below links to a page that explains the work, which is what a
catalogue entry is actually for.

---

## The six entries

**1. Custom Software Build** — `/services/software`

> Business software built around how your team already works: web
> applications, internal tools, APIs and the systems behind them.

Longer (GBP): Custom web applications, multi-tenant platforms, APIs and
integrations, database design and migration off spreadsheets, reporting, and
ongoing iteration. Built for the volume you expect in year three, not for
launch day. Abuja-based, working across Nigeria.

Image: `public/projects/rcareng-shot.png`

**2. AI Automation** — `/services/ai`

> WhatsApp and chat assistants, document extraction, and automation between
> tools that do not talk to each other.

Longer (GBP): AI agents and assistants over your own documents, workflow
automation, document extraction and classification, with human review wherever
a mistake is expensive and evaluation suites so quality is measured rather
than assumed.

Image: `public/projects/ai-sales-employee-shot.png` (or the product mark)

**3. Embedded, IoT and Connected Hardware** — `/services/embedded`

> PCB design, firmware, sensors and gateways, from prototype through to
> production, with the dashboard that reads them.

Longer (GBP): PCB design and prototyping, microcontroller firmware, sensor and
actuator integration, IoT gateways and connectivity, device-to-cloud telemetry,
enclosure design and production support.

Image: one of `public/hero/*.webp` — bench or field-node

**4. Cloud and Infrastructure** — `/services/cloud`

> Deployment, scaling, monitoring and backups, so the system still holds up in
> year three.

Longer (GBP): Cloud architecture and deployment, containerisation and release
pipelines, database scaling and backups, monitoring, logging and alerting, cost
review, and load testing before you need it.

Image: `public/hero/ops-desk.webp`

**5. Technical Discovery** — `/services/discovery`

> A scoping engagement that ends in a written plan and cost estimate you could
> take to another firm.

Longer (GBP): Requirements workshops with the people doing the work, systems
and data audit, architecture and feasibility assessment, scope and phasing, a
build-versus-buy recommendation, and a written plan you own.

Image: `public/hero/whiteboard.webp`

**6. System Takeover and Support** — `/services/managed`

> Maintenance, monitoring and iteration for a system that is already running,
> whether we built it or not.

Longer (GBP): Ongoing maintenance and bug fixes, monitoring and incident
response, security patching and dependency updates, feature iteration on an
agreed cadence, documentation and handover readiness, and a named engineer
rather than a ticket queue.

Image: `public/hero/software-desk.webp`

---

## WhatsApp Business

1. WhatsApp Business app → **Settings → Business tools → Catalogue**.
2. **Add item** for each entry above: photo, name, price, description, and the
   website link (`https://www.layrus.com/services/software`, etc.).
3. Keep names under 60 characters and descriptions under 150 — the app
   truncates both in the chat list.
4. Link the catalogue to your profile so it appears in the chat header.

The catalogue is only shareable after the business profile is verified, which
is a Facebook Business Manager step, not an in-app one.

## Google Business Profile

1. `business.google.com` → your profile → **Edit profile → Products**.
2. Add each entry: name, category, price, description, and the service page as
   the button link.
3. Google shows **three products** on the profile before "View all". Order
   matters: lead with Custom Software Build, then AI Automation, then Embedded.
   Those are the three that distinguish the company from a web agency.
4. Keep descriptions to two sentences; the panel clamps long text.

---

## One consistency rule

The catalogue, the site and Lyra all describe the same six services. If a
service is renamed in `lib/services.ts`, rename it here in the same change —
three surfaces disagreeing about what the company sells is worse than any one
of them being slightly out of date.
