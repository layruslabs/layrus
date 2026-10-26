import type { DiagramSpec } from "@/components/ArchitectureDiagram";

/**
 * The company's offering, in one place. The footer links to every one of
 * these and the homepage cards show the four with architecture diagrams, so
 * the list lives here rather than in either of them — two copies of a service
 * name is how a site ends up with a link to a page that calls it something
 * else.
 */
export interface Service {
  slug: string;
  num: string;
  title: string;
  /** One line, for cards and lists. */
  tagline: string;
  /** The opening paragraph of the service's own page. */
  intro: string;
  /** What the engagement actually covers. */
  includes: string[];
  accent: string;
  /** Only the four disciplines the homepage illustrates. */
  arch?: DiagramSpec;
}

export const SERVICES: Service[] = [
  {
    slug: "software",
    num: "01",
    title: "Software Systems",
    tagline:
      "Custom business software, web applications, APIs and system integrations built around how your team actually works.",
    intro:
      "We build the systems a business actually runs on — the orders, the stock, the billing, the reporting — shaped around the way your team already works rather than a template they have to adopt.",
    includes: [
      "Custom web applications and internal tools",
      "Multi-tenant SaaS platforms",
      "APIs and third-party integrations",
      "Database design, and migration off spreadsheets",
      "Reporting and analytics",
      "Ongoing support and iteration",
    ],
    accent: "var(--forest-green)",
    // three-tier: one client tier (web, mobile and desktop are all clients),
    // the application tier, then the stores behind it
    arch: {
      caption: "Software Architecture",
      stages: [
        { nodes: [{ label: "Client", icon: "web" }] },
        { band: true, nodes: [{ label: "Application & API", icon: "server" }] },
        {
          nodes: [
            { label: "Database", icon: "db" },
            { label: "Cache", icon: "bolt" },
            { label: "Storage", icon: "drive" },
          ],
        },
      ],
    },
  },
  {
    slug: "ai",
    num: "02",
    title: "AI & Automation",
    tagline:
      "AI agents, workflow automation, RAG systems and intelligent business tools that take repetitive work off your desk.",
    intro:
      "AI where it earns its place: answering the questions your team answers a hundred times a day, reading the documents nobody wants to read, and taking the repetitive work off the desk.",
    includes: [
      "WhatsApp and chat assistants",
      "Retrieval-augmented systems over your own documents",
      "Workflow automation between tools that don't talk to each other",
      "Document extraction and classification",
      "Human review at the points where a mistake is expensive",
      "Evaluation suites, so quality is measured rather than assumed",
    ],
    accent: "var(--warm-terracotta)",
    // fan-in from the channels, fan-out to model, knowledge and tools
    arch: {
      caption: "AI Architecture",
      stages: [
        {
          nodes: [
            { label: "Chat", icon: "chat" },
            { label: "Email", icon: "mail" },
            { label: "Webhooks", icon: "link" },
          ],
        },
        { band: true, nodes: [{ label: "Agent Runtime", icon: "spark" }] },
        {
          nodes: [
            { label: "LLM", icon: "chip" },
            { label: "Vector Store", icon: "vector" },
            { label: "Tools", icon: "modules" },
          ],
        },
      ],
    },
  },
  {
    slug: "embedded",
    num: "03",
    title: "Embedded Engineering",
    tagline:
      "PCB design, embedded systems, IoT, firmware and hardware/software integration from prototype through to production.",
    intro:
      "Hardware that has to keep working in the field — on a factory floor, in a vehicle, on a farm — where the network drops and there is nobody standing by to reboot it.",
    includes: [
      "PCB design and prototyping",
      "Firmware for microcontrollers",
      "Sensor and actuator integration",
      "IoT gateways and connectivity",
      "Device-to-cloud telemetry pipelines",
      "Enclosure design and production support",
    ],
    accent: "var(--burnt-clay)",
    // a signal chain: physical I/O into the microcontroller, out through a
    // gateway, and up to the cloud and whatever reads it
    arch: {
      caption: "Device Architecture",
      stages: [
        {
          nodes: [
            { label: "Sensors", icon: "sensor" },
            { label: "Actuators", icon: "cog" },
          ],
        },
        { band: true, nodes: [{ label: "Firmware & MCU", icon: "chip" }] },
        { nodes: [{ label: "Gateway", icon: "gateway" }] },
        {
          nodes: [
            { label: "Cloud", icon: "cloud" },
            { label: "Dashboard", icon: "chart" },
          ],
        },
      ],
      // The actuators are drawn beside the sensors because that is where they
      // sit on a board, but they are what the system drives — the signal gets
      // to them last, and only after the dashboard has decided something.
      order: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [0, 1]],
    },
  },
  {
    slug: "cloud",
    num: "04",
    title: "Cloud & Infrastructure",
    tagline:
      "Deployment, scaling and support so the system still holds up in year three, not just on launch day.",
    intro:
      "The part nobody sees until it stops working: how the thing is deployed, what happens when it gets busy, and whether year three is calm or expensive.",
    includes: [
      "Cloud architecture and deployment",
      "Containerisation and release pipelines",
      "Database scaling, replication and backups",
      "Monitoring, logging and alerting",
      "Cost review and right-sizing",
      "Load testing before you need it",
    ],
    accent: "var(--forest-green)",
    // horizontal scale-out: traffic balanced across app servers, with the
    // read load split off the primary database
    arch: {
      caption: "Scale Architecture",
      stages: [
        { nodes: [{ label: "Client", icon: "users" }] },
        { band: true, nodes: [{ label: "Load Balancer", icon: "balance" }] },
        {
          nodes: [
            { label: "App Servers", icon: "server" },
            { label: "Cache", icon: "bolt" },
          ],
        },
        {
          nodes: [
            { label: "Primary DB", icon: "db" },
            { label: "Read Replica", icon: "replicas" },
          ],
        },
      ],
    },
  },
  {
    slug: "discovery",
    num: "05",
    title: "Technical Discovery",
    tagline:
      "Work out what the problem actually is, what it will take and whether the expensive version is the one you need.",
    intro:
      "Before anything gets built: what the problem actually is, what solving it will take, and whether the expensive version is the one you need.",
    includes: [
      "Requirements workshops with the people doing the work",
      "Systems and data audit",
      "Architecture and feasibility assessment",
      "Scope, phasing and cost estimate",
      "A build-versus-buy recommendation",
      "A written plan you can take to anyone",
    ],
    accent: "var(--warm-terracotta)",
  },
  {
    slug: "managed",
    num: "06",
    title: "Managed Implementation",
    tagline:
      "Ongoing maintenance, monitoring and iteration for systems that are already running.",
    intro:
      "For systems that are already running and need somebody accountable for them — whether we built them or you inherited them.",
    includes: [
      "Ongoing maintenance and bug fixes",
      "Monitoring and incident response",
      "Security patching and dependency updates",
      "Feature iteration on an agreed cadence",
      "Documentation, and handover readiness if you move on",
      "A named engineer rather than a ticket queue",
    ],
    accent: "var(--burnt-clay)",
  },
];

/** A service that comes with an architecture diagram — the homepage four. */
export type IllustratedService = Service & { arch: DiagramSpec };

export const ILLUSTRATED = SERVICES.filter(
  (s): s is IllustratedService => Boolean(s.arch),
);

export const serviceHref = (s: Service) => `/services/${s.slug}`;
export const serviceBySlug = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);
