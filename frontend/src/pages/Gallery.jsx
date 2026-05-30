import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGallery, img } from "../lib/api";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getGallery().then(setItems).catch(() => {});
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <div data-testid="gallery-page">
      <SEO title="Gallery" description="A curated gallery of tender motherhood moments — maternity, newborn, yoga, and wellness." />
      <PageHero
        eyebrow="Gallery"
        title="Moments worth treasuring"
        subtitle="A glimpse into the tender, beautiful world of motherhood we are honoured to be part of."
        image="photography"
        crumbs={[{ label: "Gallery" }]}
      />

      <section className="section-py bg-ivory">
        <div className="container-px">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                data-testid={`gallery-filter-${c.toLowerCase()}`}
                className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                  active === c ? "bg-gold text-white" : "bg-warmivory text-ink-soft hover:bg-beige border border-beige"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.button
                  layout
                  key={item.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                  onClick={() => setLightbox(item)}
                  data-testid={`gallery-item-${i}`}
                  className="group relative block w-full break-inside-avoid rounded-2xl overflow-hidden focus:outline-none"
                >
                  <img src={img(item.image)} alt={item.title} loading="lazy" className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div>
                      <p className="text-ivory font-serif text-lg">{item.title}</p>
                      <p className="text-ivory/70 text-xs">{item.category}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6"
            data-testid="gallery-lightbox"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-w-4xl">
              <img src={img(lightbox.image)} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-2xl" />
              <p className="text-center text-ivory font-serif text-xl mt-4">{lightbox.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
