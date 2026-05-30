import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { img, api } from "../../lib/api";

const CATEGORIES = [
  "Garbh Sanskar", "Pregnancy Yoga", "Postpartum Recovery",
  "Baby Care", "Nutrition", "Emotional Wellness", "Parenting",
];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const INPUT = "w-full rounded-xl border border-beige bg-warmivory px-4 py-2.5 text-sm text-ink outline-none focus:border-gold transition-colors placeholder:text-ink-muted";
const LABEL = "block text-xs font-medium text-ink-muted mb-1.5 uppercase tracking-wide";

function CounterBadge({ value, ideal }) {
  const len = (value || "").length;
  const [lo, hi] = ideal;
  const color = len === 0 ? "text-ink-muted" : len < lo ? "text-amber-500" : len <= hi ? "text-green-600" : "text-red-500";
  return <span className={`text-xs font-mono ${color}`}>{len} / {hi}</span>;
}

function highlight(text, keyword) {
  if (!keyword || !text) return text;
  const re = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.split(re).map((part, i) =>
    re.test(part) ? <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5">{part}</mark> : part
  );
}

function GooglePreview({ title, slug, description, keyword }) {
  const displayTitle = title ? `${title} | Sparsh Pehla` : "Sparsh Pehla";
  const displayUrl = `sparshpehla.com › blog › ${slug || "article-slug"}`;
  const displayDesc = description || "Article description will appear here once you fill in the excerpt or meta description field.";
  return (
    <div className="rounded-xl border border-beige bg-warmivory p-5">
      <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-3">Google Preview</p>
      <div className="text-xs text-ink-muted mb-1">{displayUrl}</div>
      <div className="text-[#1a0dab] text-base font-medium leading-snug mb-1 line-clamp-1">
        {highlight(displayTitle, keyword)}
      </div>
      <div className="text-sm text-[#4d5156] leading-relaxed line-clamp-2">
        {highlight(displayDesc, keyword)}
      </div>
    </div>
  );
}

export default function AdminBlogForm({ blog, onSave, onClose }) {
  const isEdit = !!blog?.id;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    author: "",
    author_role: "",
    tags: "",
    reading_time: 5,
    featured: false,
    image: "",
    seo_title: "",
    meta_description: "",
    focus_keyword: "",
    ...(blog
      ? { ...blog, tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "" }
      : {}),
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileRef = useRef(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  useEffect(() => {
    if (!isEdit && form.title) set("slug", slugify(form.title));
  }, [form.title]);// eslint-disable-line

  useEffect(() => { setImgError(false); }, [form.image]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/media/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set("image", data.key);
    } catch {
      alert("Upload failed — please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        reading_time: Number(form.reading_time) || 5,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-beige shrink-0">
          <h2 className="font-serif text-2xl text-ink">
            {isEdit ? "Edit Article" : "New Article"}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-beige flex items-center justify-center text-ink-soft transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable form body */}
        <form id="blog-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-8 py-6 space-y-5">
          {/* Title */}
          <div>
            <label className={LABEL}>Title *</label>
            <input
              className={INPUT}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              placeholder="Article title…"
            />
          </div>

          {/* Slug + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Slug *</label>
              <input
                className={INPUT}
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
                required
                placeholder="url-friendly-slug"
              />
            </div>
            <div>
              <label className={LABEL}>Category *</label>
              <input
                list="blog-categories"
                className={INPUT}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                required
                placeholder="e.g. Baby Care"
              />
              <datalist id="blog-categories">
                {CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* Author + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Author *</label>
              <input
                className={INPUT}
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                required
                placeholder="Dr. Ananya Mehta"
              />
            </div>
            <div>
              <label className={LABEL}>Author Role</label>
              <input
                className={INPUT}
                value={form.author_role}
                onChange={(e) => set("author_role", e.target.value)}
                placeholder="e.g. Garbh Sanskar Specialist"
              />
            </div>
          </div>

          {/* Image key + upload + Reading time */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className={LABEL}>Image</label>
              <div className="flex gap-2">
                <input
                  className={INPUT}
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="key name or upload →"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-beige bg-warmivory text-sm text-ink-soft hover:border-gold hover:text-gold disabled:opacity-50 transition-colors"
                >
                  {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleUpload}
              />
              <p className="mt-1 text-xs text-ink-muted">
                Upload PNG / JPG / WebP, or type a key: hero, yoga, garbh_sanskar, baby_massage…
              </p>
            </div>
            <div>
              <label className={LABEL}>Read time (min)</label>
              <input
                type="number"
                min="1"
                max="60"
                className={INPUT}
                value={form.reading_time}
                onChange={(e) => set("reading_time", e.target.value)}
              />
            </div>
          </div>

          {/* Image preview */}
          {form.image && !imgError && (
            <div className="h-36 rounded-xl overflow-hidden border border-beige bg-beige">
              <img
                src={img(form.image)}
                alt="preview"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}
          {form.image && imgError && (
            <p className="text-xs text-red-500 -mt-3">Image key not found — check the key name above.</p>
          )}

          {/* Tags + Featured */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className={LABEL}>Tags (comma separated)</label>
              <input
                className={INPUT}
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="yoga, wellness, trimester"
              />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="blog-featured"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 accent-gold rounded"
              />
              <label htmlFor="blog-featured" className="text-sm text-ink-soft cursor-pointer select-none">
                Mark as Featured
              </label>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className={LABEL}>Excerpt *</label>
            <textarea
              className={`${INPUT} resize-none`}
              rows={3}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              required
              placeholder="Short description shown on blog cards and search results…"
            />
          </div>

          {/* Content */}
          <div>
            <label className={LABEL}>Content *</label>
            <textarea
              className={`${INPUT} resize-y`}
              rows={12}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              required
              placeholder="Full article body. Use blank lines between paragraphs — they render automatically on the article page."
            />
          </div>

          {/* ── SEO Section ─────────────────────────────────────────────── */}
          <div className="pt-4 border-t border-beige">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">SEO Settings</p>

            {/* Focus Keyword */}
            <div className="mb-4">
              <label className={LABEL}>Focus Keyword</label>
              <input
                className={INPUT}
                value={form.focus_keyword}
                onChange={(e) => set("focus_keyword", e.target.value)}
                placeholder="e.g. prenatal yoga benefits, garbh sanskar music"
              />
              <p className="mt-1 text-xs text-ink-muted">The main phrase you want this article to rank for in Google.</p>
            </div>

            {/* SEO Title */}
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <label className={LABEL} style={{ marginBottom: 0 }}>SEO Title</label>
                <CounterBadge value={form.seo_title || form.title} ideal={[50, 60]} />
              </div>
              <input
                className={INPUT}
                value={form.seo_title}
                onChange={(e) => set("seo_title", e.target.value)}
                placeholder={form.title ? `${form.title} | Sparsh Pehla` : "Leave blank to use article title"}
              />
              <p className="mt-1 text-xs text-ink-muted">Shown in Google results. Ideal: 50–60 characters. Blank = article title.</p>
            </div>

            {/* Meta Description */}
            <div className="mb-6">
              <div className="flex justify-between mb-1.5">
                <label className={LABEL} style={{ marginBottom: 0 }}>Meta Description</label>
                <CounterBadge value={form.meta_description || form.excerpt} ideal={[150, 160]} />
              </div>
              <textarea
                className={`${INPUT} resize-none`}
                rows={3}
                value={form.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
                placeholder={form.excerpt || "Leave blank to use the excerpt"}
              />
              <p className="mt-1 text-xs text-ink-muted">Shown under the title in Google. Ideal: 150–160 characters. Blank = excerpt.</p>
            </div>

            {/* Google Search Preview */}
            <GooglePreview
              title={form.seo_title || form.title}
              slug={form.slug}
              description={form.meta_description || form.excerpt}
              keyword={form.focus_keyword}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-beige flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-beige text-sm text-ink-soft hover:bg-beige transition-colors"
          >
            Cancel
          </button>
          <button
            form="blog-form"
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-gold text-white text-sm font-medium hover:bg-gold/90 disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Publish Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
