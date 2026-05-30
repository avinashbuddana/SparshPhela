import { useEffect } from "react";

const SITE_NAME = "Sparsh Pehla";
const SITE_DESC = "A luxury maternity and parenting wellness ecosystem in Vadodara — Garbh Sanskar, prenatal yoga, baby massage, lactation guidance, postpartum care and more.";

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
  el.setAttribute("href", href);
}

function removeMeta(attr, key) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function injectJsonLd(id, data) {
  let el = document.head.querySelector(`#${id}`);
  if (data) {
    if (!el) { el = document.createElement("script"); el.id = id; el.type = "application/ld+json"; document.head.appendChild(el); }
    el.textContent = typeof data === "string" ? data : JSON.stringify(data);
  } else {
    el?.remove();
  }
}

/**
 * SEO — updates <head> meta for every page.
 *
 * Props:
 *   title        — page title (appended with "| Sparsh Pehla")
 *   description  — meta description
 *   image        — absolute image URL for OG/Twitter
 *   canonical    — explicit canonical URL (defaults to window.location.href)
 *   type         — "website" | "article" (default: "website")
 *   article      — { publishedTime, modifiedTime, author, authorRole, section, tags, readingTime, focusKeyword }
 *   jsonLd       — any Schema.org object or array of objects (LocalBusiness, BreadcrumbList, FAQ, etc.)
 */
export default function SEO({ title, description, image, canonical, type = "website", article, jsonLd }) {
  // Stringify complex objects so they're stable useEffect deps
  const articleKey = article ? JSON.stringify(article) : "";
  const jsonLdKey  = jsonLd  ? JSON.stringify(jsonLd)  : "";

  useEffect(() => {
    const siteUrl  = window.location.origin;
    const pageUrl  = canonical || window.location.href;
    const seoTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Supporting Every Step of Motherhood`;
    const seoDesc  = description || SITE_DESC;
    const art      = articleKey ? JSON.parse(articleKey) : null;

    // ── Basic ────────────────────────────────────────────────────────────────
    document.title = seoTitle;
    setMeta("name", "description", seoDesc);
    setMeta("name", "robots", "index, follow");
    setLink("canonical", pageUrl);

    // ── Open Graph ───────────────────────────────────────────────────────────
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "en_IN");
    setMeta("property", "og:type", type === "article" ? "article" : "website");
    setMeta("property", "og:title", seoTitle);
    setMeta("property", "og:description", seoDesc);
    setMeta("property", "og:url", pageUrl);
    if (image) setMeta("property", "og:image", image);

    // Article-specific OG
    if (type === "article" && art) {
      if (art.publishedTime) setMeta("property", "article:published_time", art.publishedTime);
      if (art.modifiedTime)  setMeta("property", "article:modified_time", art.modifiedTime);
      if (art.author)        setMeta("property", "article:author", art.author);
      if (art.section)       setMeta("property", "article:section", art.section);
      art.tags?.slice(0, 5).forEach((t, i) => setMeta("property", `article:tag:${i}`, t));
    } else {
      removeMeta("property", "article:published_time");
      removeMeta("property", "article:author");
      removeMeta("property", "article:section");
    }

    // ── Twitter Card ─────────────────────────────────────────────────────────
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seoTitle);
    setMeta("name", "twitter:description", seoDesc);
    if (image) setMeta("name", "twitter:image", image);

    // ── JSON-LD: Article ─────────────────────────────────────────────────────
    if (type === "article" && art) {
      injectJsonLd("sparsh-article-ld", {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": seoDesc,
        "image": image || `${siteUrl}/logo.png`,
        "datePublished": art.publishedTime,
        "dateModified": art.modifiedTime || art.publishedTime,
        "author": {
          "@type": "Person",
          "name": art.author || SITE_NAME,
          ...(art.authorRole ? { "jobTitle": art.authorRole } : {}),
        },
        "publisher": { "@type": "Organization", "name": SITE_NAME, "url": siteUrl },
        "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
        ...(art.section      ? { "articleSection": art.section }                : {}),
        ...(art.tags?.length ? { "keywords": art.tags.join(", ") }             : {}),
        ...(art.readingTime  ? { "timeRequired": `PT${art.readingTime}M` }     : {}),
        ...(art.focusKeyword ? { "about": art.focusKeyword }                   : {}),
      });
    } else {
      injectJsonLd("sparsh-article-ld", null);
    }

    // ── JSON-LD: Page-level schemas (BreadcrumbList, LocalBusiness, FAQ…) ───
    injectJsonLd("sparsh-page-ld", jsonLdKey || null);

  }, [title, description, image, canonical, type, articleKey, jsonLdKey]); // eslint-disable-line

  return null;
}
