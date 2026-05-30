import { useEffect } from "react";

// Lightweight SEO: updates document title + meta description + og tags
export default function SEO({ title, description, image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Sparsh Pehla` : "Sparsh Pehla — Supporting Every Step of Motherhood";
    document.title = fullTitle;

    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const desc = description || "A luxury maternity and parenting wellness ecosystem — pregnancy care, garbh sanskar, prenatal yoga, baby massage, and more.";
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", "website");
    if (image) setMeta("property", "og:image", image);
  }, [title, description, image]);

  return null;
}
