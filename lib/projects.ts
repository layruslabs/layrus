/**
 * The systems we have actually built and shipped, taken from the repositories
 * themselves rather than invented for the page.
 *
 * Everything here is checkable against the source. Where a project is not yet
 * live, `status` says so — a portfolio that claims four live products when two
 * are pre-launch is a portfolio nobody trusts twice.
 */
export interface Project {
  slug: string;
  name: string;
  /** Card eyebrow — the sector the system serves. */
  category: string;
  /** Shown on the homepage's featured row. */
  featured?: boolean;
  /** One line, for cards and grids. */
  tagline: string;
  /** The case study's opening paragraph. */
  summary: string;
  /** What it actually does, in order. */
  built: string[];
  /** Specific engineering decisions worth naming. */
  highlights: { title: string; body: string }[];
  status: "Live" | "In pilot" | "Pre-launch";
  /** Public URL, where there is one. */
  url?: string;
  /**
   * Screenshot of the product's own landing page, for the cards. Optional on
   * purpose: AI Sales Employee is a signed-in dashboard with no public page,
   * and its sign-in screen is a blank form — worse in a portfolio card than
   * the mark it would replace. Cards without a shot fall back to the mark.
   */
  shot?: string;
  /** The accent this project's card carries. */
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "rcareng",
    featured: true,
    name: "RCareNG",
    category: "Software Platform",
    tagline:
      "Booking, roadside dispatch and full workshop management for an independent Mercedes-Benz specialist in Abuja.",
    summary:
      "A Mercedes-Benz specialist garage was running bookings over the phone and the workshop on paper. RCareNG puts both online: customers book a service, call for roadside help or a tow, and follow their vehicle's progress; the same system runs the work orders, parts, invoices and staff behind the counter.",
    built: [
      "Customers book one of four service lines — home, emergency, towing or workshop — and get a live running estimate they can approve before work continues.",
      "Work orders carry mechanic assignment and labour entries; parts inventory raises low-stock alerts and generates purchase orders.",
      "Invoicing, payments and revenue reporting run against the same job records, so nothing is re-keyed.",
      "Five staff roles — admin, manager, receptionist, mechanic, customer — each see only what their job needs.",
      "A companion community hub shares the same login, with a threaded forum and real-time chat.",
    ],
    highlights: [
      {
        title: "One system, two audiences",
        body: "The customer-facing booking site and the internal workshop back office are the same application. That is what makes the tracking honest — the estimate a customer approves is the one the mechanic is working from, not a copy of it.",
      },
      {
        title: "Shipping to a phone, not just a browser",
        body: "It builds as a native Android release and publishes to the Play Store's internal track on every version tag, so the workshop's own devices stay current without anyone side-loading an APK.",
      },
      {
        title: "Deploys that roll themselves back",
        body: "Releases restart the backend, poll its health endpoint for up to a minute, and revert to the previous image tag if it does not come up. A bad deploy costs a minute, not an evening.",
      },
    ],
    status: "Live",
    url: "https://rcareng.com",
    shot: "/projects/rcareng-shot.png",
    accent: "var(--forest-green)",
  },
  {
    slug: "digital-tech-talent-hub",
    featured: true,
    name: "Digital Tech Talent Hub",
    category: "Marketplace",
    tagline:
      "A two-sided marketplace where businesses hire verified tech freelancers, with client money held in escrow until delivery.",
    summary:
      "Hiring a freelancer on trust is a bad deal for both sides: the client pays upfront and hopes, the freelancer delivers and hopes. This marketplace holds the client's money in escrow until they approve the work, then releases it as an exact split — and it only lists providers an administrator has actually vetted.",
    built: [
      "Clients post a project and fund it; the money stays locked while the project is funded, in review or in dispute.",
      "On approval it releases as an 80/20 split — 80% to the provider, 20% platform commission — computed in integer kobo so the two halves always reconcile to the deposit exactly.",
      "Providers build portfolios and are reviewed by an administrator before they become visible to clients at all.",
      "Every project gets its own message thread, deliverable uploads and milestone tracking.",
      "A ledger-backed wallet tracks what each provider has actually earned and guards withdrawals against the approved balance.",
    ],
    highlights: [
      {
        title: "Money that adds up",
        body: "Commission is floored to the kobo and the provider's share is the remainder, never a second rounded calculation. On a marketplace, a half-kobo that does not reconcile is a support ticket every time.",
      },
      {
        title: "Escrow you cannot accidentally release",
        body: "Escrow state is derived from project status rather than set by hand — the release path simply cannot run while a project is in review or dispute.",
      },
      {
        title: "Verification before visibility",
        body: "Unapproved providers do not appear in search at all, rather than appearing with a badge. The default has to be the safe one.",
      },
    ],
    status: "Live",
    url: "https://dtth.lighttechhub.com",
    shot: "/projects/digital-tech-talent-hub-shot.png",
    accent: "var(--warm-terracotta)",
  },
  {
    slug: "videosynx",
    featured: true,
    name: "videosynx",
    category: "AI & Media",
    tagline:
      "Give it a subject; it writes the code, runs it, explains it and renders a narrated tutorial video with captions.",
    summary:
      "Producing a coding tutorial by hand means writing the code, recording the screen, narrating over it and cutting it together. videosynx does the whole chain from a topic: the code is generated, executed for real, and drawn frame by frame into a finished video with narration and a subtitle file.",
    built: [
      "A topic or a pasted script goes in; an LLM chain writes runnable code and the narration that explains it, one sentence anchored to the lines it describes.",
      "Every snippet is executed in a sandbox with no network and no readable home directory, and its real output is what appears on screen.",
      "Frames are drawn programmatically and piped to ffmpeg against an integer-frame timing plan, so audio and video cannot drift apart.",
      "Explainer slides carry diagram specs — grids, cycles, trees, stacks — rendered in code, so nothing is ever screen-captured.",
      "Narration runs on a local text-to-speech model with dozens of voices, with captions burned in and exported as a matching subtitle file.",
    ],
    highlights: [
      {
        title: "It runs the code, it does not pretend to",
        body: "The output on screen is the program's actual stdout from a sandboxed run. If isolation cannot be established the worker refuses to start rather than quietly falling back to something less safe.",
      },
      {
        title: "Deterministic rendering",
        body: "Because frames are drawn rather than captured, the same lesson renders the same bytes every time — and it renders faster than real time, because nothing has to play out in a recorder.",
      },
    ],
    status: "Pre-launch",
    shot: "/projects/videosynx-shot.png",
    accent: "var(--accent-green)",
  },
  {
    slug: "ai-sales-employee",
    featured: true,
    name: "AI Sales Employee",
    category: "AI Automation",
    tagline:
      "A WhatsApp sales assistant that quotes real prices from a shop's own catalogue, follows up, and takes payment.",
    summary:
      "A shop that sells over WhatsApp loses sales for being asleep. This answers the messages, quotes prices from the shop's own catalogue, chases the people who went quiet and sends a payment link — with one rule held above everything else: it must never invent a price, a stock figure or a payment confirmation.",
    built: [
      "Each message runs one turn: load the customer's history and the shop's live data, call the model, let it invoke tools, then vet the reply before anything is sent.",
      "A guard rejects any reply containing a figure that did not come out of the database during that turn — and understands the four ways people write naira prices.",
      "Follow-ups run on a per-business policy with quiet hours and a maximum number of attempts, and cancel the moment the customer replies.",
      "Payment links go out through Paystack, and an order is only marked paid by a signature-verified webhook whose amount matches.",
      "Refunds, complaints and disputes go to a human rather than to the model.",
    ],
    highlights: [
      {
        title: "The rule is code, not a prompt",
        body: "A sales agent that hallucinates a price creates a dispute the business has to honour or lose a customer over. So the invariant — a naira figure may appear in an outbound message only if SQL produced it this turn — is enforced by a module, not by asking the model nicely.",
      },
      {
        title: "The queue is the database",
        body: "Jobs are claimed straight out of PostgreSQL with a locking read, so there is no Redis, no broker and no cron to keep alive alongside it. Fewer moving parts is the feature.",
      },
      {
        title: "It never invents a payment",
        body: "Reads and replays of a payment webhook change nothing, because orders are unique on the provider's reference. \"I don pay\" from a customer is refused.",
      },
    ],
    status: "In pilot",
    accent: "var(--burnt-clay)",
  },

  // ── Fintech ──────────────────────────────────────────────────────────────
  {
    slug: "wegocomply",
    name: "WeGoComply",
    category: "Financial Services",
    tagline:
      "KYC, AML monitoring and regulatory reporting for Nigerian financial institutions.",
    summary:
      "A compliance suite for Nigerian financial institutions: customer onboarding in under two minutes, real-time transaction monitoring, and bulk TIN reconciliation — the paperwork that decides whether a bank can take a customer, automated.",
    built: [
      "KYC/KYB onboarding that verifies identity in under two minutes, consuming the Dojah API for NIN, BVN and TIN checks.",
      "Real-time AML transaction monitoring backed by an Isolation Forest model trained on Azure ML, flagging suspicious activity at a 10–20% false-positive rate against an industry norm of 40–60%.",
      "NFIU-compliant suspicious transaction reports drafted with Azure OpenAI, with biometric liveness (Face API) and document extraction (Document Intelligence) on the identity path.",
      "Bulk TIN reconciliation for the back office, replacing a manual matching exercise.",
    ],
    highlights: [
      {
        title: "False positives are the real cost",
        body: "A compliance team that reviews a hundred alerts to find three real ones is not monitoring, it is drowning. The anomaly model was tuned for precision first — a 10–20% false-positive rate is the difference between a queue someone works through and a queue someone learns to ignore.",
      },
      {
        title: "Reporting is the product",
        body: "The suspicious-transaction report is what the regulator actually receives, so it is generated in the required format rather than assembled by hand from notes afterwards.",
      },
    ],
    status: "Pre-launch",
    accent: "var(--forest-green)",
  },

  // ── Agriculture & IoT ────────────────────────────────────────────────────
  {
    slug: "gansys",
    name: "GanSys",
    category: "Agriculture & IoT",
    tagline:
      "Live farm telemetry and remote control for ESP32 sensors, actuators and pest-control schedules.",
    summary:
      "An IoT dashboard for ESP32-based farm controllers, built because agricultural monitoring tends to arrive in fragments — a sensor here, a spreadsheet there, nothing in real time. GanSys puts sensors, actuators, cameras and pest-control schedules on one live view.",
    built: [
      "A custom Node server rather than a serverless model, because live telemetry needs persistent WebSocket connections and MQTT for bidirectional device communication.",
      "C++ firmware on ESP32 that pushes readings and acknowledges commands through a device-sync API.",
      "Layered error boundaries, so one failed panel cannot blank the whole dashboard while somebody is standing in a field looking at it.",
    ],
    highlights: [
      {
        title: "The platform is not the spec",
        body: "Serverless is the default answer and the wrong one here: devices hold connections open for hours. Choosing a long-running Node process was the decision that made the rest of the system possible.",
      },
      {
        title: "Built to survive a bad connection",
        body: "Field hardware reconnects, drops messages and reports stale values. The dashboard treats a stale reading as stale rather than as a current one, which is the failure mode that matters when someone is about to act on it.",
      },
    ],
    status: "Live",
    url: "https://gansystems.vercel.app",
    accent: "var(--accent-green)",
  },

  // ── Healthcare ───────────────────────────────────────────────────────────
  {
    slug: "cvd-expert",
    name: "CVD Expert",
    category: "Healthcare",
    tagline:
      "Cardiovascular risk prediction from 17 health parameters, trained on 300,000+ records.",
    summary:
      "A heart-disease risk tool that gives someone an early, data-driven warning before they see a doctor. Trained on the CDC BRFSS 2020 dataset of over 300,000 US health records and delivered through an interface a non-specialist can actually read.",
    built: [
      "An XGBoost model over 17 health parameters, validated with K-fold cross-validation and reaching 91.5% prediction accuracy.",
      "A Streamlit interface that presents risk on a green-to-red scale with recommendations matched to the band, rather than a bare probability.",
      "Chosen for tabular health data specifically — gradient-boosted trees still outperform more fashionable approaches on this shape of data.",
    ],
    highlights: [
      {
        title: "A number is not an answer",
        body: "A 63% risk score means nothing to most people. The tool translates it into a zone and a next step, which is the difference between a model and something a person can act on.",
      },
    ],
    status: "Live",
    url: "https://cvd-expert.streamlit.app",
    accent: "var(--burnt-clay)",
  },

  // ── Education ────────────────────────────────────────────────────────────
  {
    slug: "recoding",
    name: "Recoding",
    category: "Education",
    tagline:
      "Timed coding assessments with real code execution and anti-cheat monitoring.",
    summary:
      "A timed coding-exercise platform in active production use by Learn2Earn fellows in Abuja. Candidates write in a real editor against a real runtime, and the platform records enough to review how an answer was produced, not just what was submitted.",
    built: [
      "A Monaco editor (the VS Code engine) with live Go execution through a custom Go microservice deployed on Render and secured by API key.",
      "Real-time anti-cheat monitoring: paste detection, focus-loss tracking, keystroke recording, and full typing replay for submission review.",
      "Autosave, multi-role auth, audit logging, CSV export and bulk user management across 11+ exercise types.",
      "CI on every pull request through GitHub Actions, with branch protection and Neon serverless PostgreSQL behind it.",
    ],
    highlights: [
      {
        title: "Executing untrusted code is the hard part",
        body: "The runner is a separate service on a separate host with its own key, so a hostile submission can reach a sandbox rather than the application that holds candidate records.",
      },
      {
        title: "The replay is the evidence",
        body: "Paste detection alone catches nothing — someone can retype. Recording the keystrokes and replaying them is what distinguishes a person solving a problem from a person transcribing one.",
      },
    ],
    status: "Live",
    url: "https://dbirecoding.vercel.app",
    accent: "var(--warm-terracotta)",
  },

  // ── Mobility ─────────────────────────────────────────────────────────────

  // ── Blockchain ───────────────────────────────────────────────────────────
  {
    slug: "certificate-verification",
    name: "Certificate Verification",
    category: "Blockchain & Credentials",
    tagline:
      "Tamper-proof academic certificates that any employer can verify in seconds, without the university.",
    summary:
      "Certificate fraud is expensive to check and cheap to attempt. This system hashes a certificate, stores the document on IPFS and anchors the hash to Ethereum, so a QR code is enough for an employer to confirm a credential is genuine — with no central server to trust and no registrar to phone.",
    built: [
      "Solidity contracts developed and tested with Foundry and deployed to the Ethereum Sepolia testnet.",
      "Certificates hashed with SHA256, the document held on IPFS through Pinata, and the hash anchored on-chain for immutability.",
      "Public QR-code verification, so the check requires no account, no institution and no server that could go down.",
    ],
    highlights: [
      {
        title: "Verification must outlive the issuer",
        body: "A central verification database is only as durable as the institution running it. Anchoring the hash on-chain means the proof still works if the university's infrastructure does not.",
      },
    ],
    status: "Live",
    url: "https://certificatechain.vercel.app",
    accent: "var(--accent-green)",
  },

  // ── Logistics ────────────────────────────────────────────────────────────

  // ── Retail & supply chain ────────────────────────────────────────────────

  // ── Education & optimisation ─────────────────────────────────────────────
];

export const projectBySlug = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);
