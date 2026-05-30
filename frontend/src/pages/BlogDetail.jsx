import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, ArrowLeft, ArrowUpRight } from "lucide-react";
import { getBlog, img } from "../lib/api";
import { Reveal } from "../components/motion";
import SEO from "../components/SEO";

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

  return (
    <div data-testid="blog-detail-page">
      <SEO title={blog.title} description={blog.excerpt} image={img(blog.image)} />

      {/* Hero */}
      <article>
        <header className="pt-36 md:pt-44 pb-12 bg-warmivory">
          <div className="container-px max-w-3xl">
            <Link to="/blog" className="flex items-center gap-2 text-sm text-ink-muted hover:text-gold mb-6 transition-colors">
              <ArrowLeft size={16} /> The Journal
            </Link>
            <span className="label-eyebrow">{blog.category}</span>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight font-medium text-ink text-balance">{blog.title}</h1>
            <div className="mt-6 flex items-center gap-4 text-sm text-ink-soft">
              <span className="font-medium text-ink">{blog.author}</span>
              <span className="text-ink-muted">{blog.author_role}</span>
              <span className="flex items-center gap-1.5 text-ink-muted"><Clock size={14} /> {blog.reading_time} min read</span>
            </div>
          </div>
        </header>

        <div className="container-px max-w-4xl -mt-2">
          <Reveal>
            <div className="rounded-[2rem] overflow-hidden shadow-xl h-[340px] md:h-[480px]">
              <img src={img(blog.image)} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>

        {/* Content */}
        <div className="section-py">
          <div className="container-px max-w-3xl">
            <div className="prose-content space-y-6">
              {blog.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-ink-soft">{para}</p>
              ))}
            </div>

            {blog.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {blog.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-warmivory border border-beige text-xs text-ink-soft">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related */}
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
    </div>
  );
}
