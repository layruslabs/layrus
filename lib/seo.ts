import type { Service } from "@/lib/services";
import type { Project } from "@/lib/projects";

/**
 * Structured data, in one place.
 *
 * Two audiences read this. Search engines use it to build rich results; answer
 * engines — ChatGPT, Perplexity, Gemini — use it to decide what this company
 * is, what it does and whether a claim about it is citable. Both want the same
 * thing underneath: one consistent entity, repeated identically on every page.
 * Inconsistent NAP details (name, address, phone) across a site and a Google
 * Business Profile is the single most common reason a local listing and a
 * website fail to be understood as the same business.
 *
 * TODO before launch — these are the blanks only the business can fill, and
 * they must match the Google Business Profile character for character:
 *   streetAddress, postalCode, telephone, and whether the operating base is
 *   Abuja (as this site says) or Abuja (as the CV says).
 */
export const BASE_URL = "https://www.layrus.com";

export const ORG_ID = `${BASE_URL}/#organization`;
export const SITE_ID = `${BASE_URL}/#website`;

export const ORG = {
  name: "Layrus Labs",
  legalName: "Layrus Labs Ltd",
  email: "hello@layrus.com",
  locality: "Abuja",
  region: "FCT",
  country: "NG",
  // As registered with the Corporate Affairs Commission. Verifiable against
  // the public register, which is exactly why it belongs on the page.
  rcNumber: "9918991",
  registered: "2026-10-08",
};

/** The company entity. Emitted once, in the layout, so every page carries it. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: ORG.name,
    legalName: ORG.legalName,
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
      width: 1230,
      height: 1092,
    },
    image: `${BASE_URL}/og-image.png`,
    description:
      "Layrus Labs designs, builds and implements custom software systems, AI automation, IoT and embedded systems for businesses with complex technical needs.",
    email: ORG.email,
    identifier: {
      "@type": "PropertyValue",
      name: "RC Number",
      value: ORG.rcNumber,
    },
    foundingDate: ORG.registered,
    address: {
      "@type": "PostalAddress",
      // The CAC record spells this "NTERNATIONAL" — a typo in the register
      // itself. Corrected here; keep whichever form you use identical to the
      // Google Business Profile, because that is what gets matched.
      streetAddress: "Shop CB11/283, International Motor Spare Parts Market, Zuba",
      addressLocality: ORG.locality,
      addressRegion: ORG.region,
      addressCountry: ORG.country,
    },
    areaServed: [
      { "@type": "Country", name: "Nigeria" },
      { "@type": "Place", name: "Worldwide" },
    ],
    knowsAbout: [
      "custom software development",
      "AI automation",
      "large language model integration",
      "embedded systems",
      "IoT",
      "PCB design",
      "cloud infrastructure",
      "blockchain",
      "payment integration",
    ],
    sameAs: [
      "https://www.linkedin.com/company/layruslabs",
      "https://github.com/layruslabs",
      "https://x.com/layruslabs",
      "https://www.instagram.com/layruslabs",
      "https://www.facebook.com/share/1EGYy8WRAU/",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: ORG.email,
        contactType: "sales",
        availableLanguage: ["English"],
      },
    ],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: BASE_URL,
    name: ORG.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** One service, as an offer the company makes. */
export function serviceLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.tagline,
    url: `${BASE_URL}/services/${service.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Nigeria" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.title,
      itemListElement: service.includes.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  };
}

/** One shipped system. `CreativeWork` fits a product better than `Product`. */
export function projectLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.tagline,
    url: `${BASE_URL}/projects/${project.slug}`,
    applicationCategory: project.category,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(project.url ? { sameAs: project.url } : {}),
  };
}

/** Breadcrumb trail for a page one or more levels deep. */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

/** The item list a collection page represents. */
export function collectionLd(
  name: string,
  path: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${BASE_URL}${path}`,
    isPartOf: { "@id": SITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: `${BASE_URL}${item.path}`,
      })),
    },
  };
}
