// Shared Schema.org helpers used across pages

export const SITE_URL = process.env.REACT_APP_SITE_URL || "https://sparshpehla.com";

export const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  "name": "Sparsh Pehla",
  "description": "Premium maternity and parenting wellness centre in Vadodara offering Garbh Sanskar, prenatal yoga, baby massage, lactation guidance, postpartum care and more.",
  "url": SITE_URL,
  "telephone": "+918980024245",
  "email": "sparsh.pehla@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kanha Gold B/s. New BPs, G-102, Dabhoi - Waghodia Ring Rd, nr. Ganesh Nagar, Suryanagar",
    "addressLocality": "Vadodara",
    "addressRegion": "Gujarat",
    "postalCode": "390019",
    "addressCountry": "IN",
  },
  "openingHours": ["Mo-Sa 09:00-18:00"],
  "priceRange": "₹₹₹",
  "areaServed": "Vadodara",
  "knowsAbout": ["Garbh Sanskar", "Prenatal Yoga", "Baby Massage", "Lactation Guidance", "Postpartum Care", "Maternity Photography"],
  "sameAs": [
    "https://www.instagram.com/sparsh.pehla/",
    "https://www.facebook.com/p/SparshPehla-61579467998471/",
  ],
};

export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  "name": "Sparsh Pehla",
  "description": "A luxury maternity and parenting wellness ecosystem — Supporting Every Step of Motherhood.",
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "email": "sparsh.pehla@gmail.com",
  "telephone": "+918980024245",
  "foundingDate": "2015",
  "areaServed": "Vadodara, Gujarat, India",
};

/** Build a BreadcrumbList schema from an array of { name, url? } items. */
export function breadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map(({ name, url }, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": name,
      ...(url ? { "item": `${SITE_URL}${url}` } : {}),
    })),
  };
}

/** Build a FAQ schema from an array of { q, a } objects. */
export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  };
}
