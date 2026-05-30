import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { getBlogs, getBlogCategories, img } from "../lib/api";
import { Reveal, StaggerGroup, StaggerItem } from "../components/motion";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getBlogCategories().then((c) => setCategories(["All", ...c])).catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (active !== "All") params.category = active;
    if (search) params.search = search;
    const t = setTimeout(() => getBlogs(params).then(setBlogs).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [active, search]);

  const featured = blogs.find((b) => b.featured) || blogs[0];
  const rest = blogs.filter((b) => b !== featured);

  return (
    <div data-testid="blog-page">
      <SEO title="The Journal" description="Wisdom, tips, and gentle guidance on pregnancy care, garbh sanskar, baby care, nutrition, and emotional wellness." />
      <PageHero
        eyebrow="The Journal"
        title="Stories & wisdom for your journey"
        subtitle="Thoughtful articles on pregnancy, parenting, and wellness — written with care by our experts."
        image="emotional_wellness"
        crumbs={[{ label: "Journal" }]}
      />

      <section className="section-py bg-ivory">
        <div className="container-px">
          {/* Search + Filters */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  data-testid={`blog-category-${c.replace(/\s+/g, "-").toLowerCase()}`}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    active === c ? "bg-gold text-white" : "bg-warmivory text-ink-soft hover:bg-beige border border-beige"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative lg:w-72 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} strokeWidth={1.5} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                data-testid="blog-search"
                className="w-full rounded-full bg-warmivory border border-beige pl-11 pr-4 py-2.5 text-sm outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          {blogs.length === 0 && (
            <p className="text-center text-ink-muted py-20">No articles found. Try a different search or category.</p>
          )}

          {/* Featured */}
          {featured && active === "All" && !search && (
            <Reveal className="mb-14">
              <Link to={`/blog/${featured.slug}`} data-testid={`blog-featured-${featured.slug}`} className="group grid md:grid-cols-2 gap-8 bg-warmivory rounded-3xl overflow-hidden border border-beige">
                <div className="h-72 md:h-full overflow-hidden">
                  <img src={img(featured.image)} alt={featured.title} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="label-eyebrow">Featured · {featured.category}</span>
                  <h2 className="mt-4 font-serif text-3xl text-ink leading-snug group-hover:text-gold transition-colors">{featured.title}</h2>
                  <p className="mt-4 text-ink-soft leading-relaxed">{featured.excerpt}</p>
                  <p className="mt-6 text-sm text-ink-muted">{featured.author} · {featured.reading_time} min read</p>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Grid */}
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(active === "All" && !search ? rest : blogs).map((b) => (
              <StaggerItem key={b.slug}>
                <Link to={`/blog/${b.slug}`} data-testid={`blog-card-${b.slug}`} className="group block h-full">
                  <div className="relative h-56 rounded-2xl overflow-hidden mb-5">
                    <img src={img(b.image)} alt={b.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                    <span className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-xs font-medium text-ink">{b.category}</span>
                  </div>
                  <p className="text-xs text-ink-muted">{b.reading_time} min read</p>
                  <h3 className="mt-2 font-serif text-xl text-ink leading-snug group-hover:text-gold transition-colors">{b.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft line-clamp-2">{b.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </div>
  );
}
