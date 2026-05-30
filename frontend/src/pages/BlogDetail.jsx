import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { getBlog, img } from "../lib/api";
import { Reveal } from "../components/motion";
import SEO from "../components/SEO";
import { breadcrumb } from "../lib/seo";
import ContactCTA from "../components/ContactCTA";

function fmtDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setBlog(null);
    setNotFound(false);
    getBlog(slug).then(setBlog).catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-3xl text-ink">Article not found</h1>
        <Link to="/blog" className="text-gold hover:underline">Back to the journal</Link>
      </div>
    );
  }
  if (!blog) return <div className="min-h-screen flex items-center justify-center text-ink-muted">Loading…</div>;

  // SEO values — CMS fields take priority, fall back to blog fields
  const seoTitle = blog.seo_title || blog.title;
  const seoDesc  = blog.meta_description || blog.excerpt;
  const pageUrl  = `${window.location.origin}/blog/${blog.slug}`;

  return (
    <div data-testid="blog-detail-page">
      <SEO
        title={seoTitle}
        description={seoDesc}
        image={img(blog.image)}
        type="article"
        canonical={pageUrl}
        article={{
          publishedTime: blog.created_at,
          author: blog.author,
          authorRole: blog.author_role,
          section: blog.category,
          tags: blog.tags,
          readingTime: blog.reading_time,
          focusKeyword: blog.focus_keyword,
        }}
        jsonLd={breadcrumb([
          { name: "Home", url: "/" },
          { name: "The Journal", url: "/blog" },
          { name: blog.title },
        ])}
      />

      <article>
        {/* Hero header */}
        <header className="pt-36 md:pt-44 pb-12 bg-warmivory">
          <div className="container-px max-w-3xl">
            <Link to="/blog" className="flex items-center gap-2 text-sm text-ink-muted hover:text-gold mb-6 transition-colors">
              <ArrowLeft size={16} /> The Journal
            </Link>
            <span className="label-eyebrow">{blog.category}</span>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight font-medium text-ink text-balance">
              {blog.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
              <span className="font-medium text-ink">{blog.author}</span>
              {blog.author_role && <span className="text-ink-muted">{blog.author_role}</span>}
              {blog.created_at && (
                <span className="flex items-center gap-1.5 text-ink-muted">
                  <CalendarDays size={14} />
                  {fmtDate(blog.created_at)}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-ink-muted">
                <Clock size={14} /> {blog.reading_time} min read
              </span>
            </div>
          </div>
        </header>

        {/* Hero image */}
        <div className="container-px max-w-4xl -mt-2">
          <Reveal>
            <div className="rounded-[2rem] overflow-hidden shadow-xl h-[340px] md:h-[480px]">
              <img src={img(blog.image)} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>

        {/* Article content */}
        <div className="section-py">
          <div className="container-px max-w-3xl">
            <div className="prose-content space-y-6">
              {blog.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-ink-soft">{para}</p>
              ))}
            </div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {blog.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-warmivory border border-beige text-xs text-ink-soft">#{t}</span>
                ))}
              </div>
            )}

            {/* Author card */}
            {blog.author && (
              <div className="mt-12 p-6 rounded-2xl bg-warmivory border border-beige flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0 text-gold font-serif text-lg font-semibold">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-ink">{blog.author}</p>
                  {blog.author_role && <p className="text-sm text-ink-muted">{blog.author_role}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related articles */}
      {blog.related?.length > 0 && (
        <section className="section-py bg-warmivory">
          <div className="container-px">
            <h2 className="font-serif text-3xl text-ink mb-10">Related articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blog.related.map((b) => (
                <Link key={b.slug} to={`/blog/${b.slug}`} className="group block">
                  <div className="relative h-52 rounded-2xl overflow-hidden mb-4">
                    <img src={img(b.image)} alt={b.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  </div>
                  <h3 className="font-serif text-lg text-ink group-hover:text-gold transition-colors leading-snug">{b.title}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-gold">Read <ArrowUpRight size={14} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCTA
        title="Inspired? Let's talk."
        subtitle="Book a personalised consultation with our specialists, call us, or ping us on WhatsApp — we'd love to support you."
      />
    </div>
  );
}
