# Sparsh Pehla — Product Requirements Document

## Original Problem Statement
Premium, elegant, emotionally warm luxury maternity & parenting wellness website "Sparsh Pehla" (tagline: "Supporting Every Step of Motherhood"). Inspired by amaltamara.com luxury wellness aesthetic. Built with React + FastAPI + MongoDB (adapted from requested Next.js/Sanity stack), Framer Motion animations, AI-generated imagery, blog system, custom admin/CMS panel, SEO-friendly.

## User Choices
- Stack: React + FastAPI + MongoDB
- AI images: Gemini Nano Banana (gemini-3.1-flash-image-preview) — 22 premium images generated & served via /api/media
- Auth: JWT-based custom admin login
- Forms: stored in DB + admin panel (no email)
- Scope: full build

## Architecture
- **Backend** (`/app/backend/server.py`, `seed_data.py`): FastAPI, MongoDB (motor), JWT auth (bcrypt + pyjwt, Bearer token + httponly cookie). Media served from `/app/backend/media` via `/api/media/{key}` with stock fallbacks. Auto-seeds 14 services, 6 blogs, 6 testimonials, 6 FAQs, 12 gallery items + admin user on startup.
- **Frontend** (`/app/frontend/src`): React + react-router-dom, Framer Motion, Lenis smooth scroll, Tailwind. Fonts: Playfair Display (headings) + Outfit (body). Palette: warm ivory/beige/gold/peach/lavender.
- **AI Images**: `generate_images.py` (re-runnable, skips existing).

## Personas
- Expecting mothers & new parents (primary)
- Families seeking holistic maternity/parenting wellness
- Admin (clinic owner) managing inquiries/bookings/content

## Implemented (2026-02 / initial build)
- Pages: Home (cinematic hero, intro, about, services, why-us, journey timeline, featured program, testimonials carousel, instagram feed, blog preview, FAQ, CTA), About, Services (14 cards), Service Detail (hero/story/benefits/who-for/process/gallery/FAQ/testimonials/inquiry form), Blog (filters + search + featured), Blog Detail (related), Gallery (filter + lightbox), Testimonials, Contact (form + Google Map), Book Consultation (Select + Calendar + time), Admin Login + Dashboard (stats, inquiries/bookings/subscribers tabs, status dropdown, delete).
- Backend: full public + protected admin CRUD; inquiries/bookings/newsletter capture; generic content CRUD.
- WhatsApp floating button, sticky glass navbar, elegant footer with newsletter.
- SEO meta/OG tags per page.
- Testing: 100% backend (30/30), 100% frontend critical flows (iteration_1).

## Prioritized Backlog
- **P1**: Admin content editor UI for blogs/services/testimonials/gallery (CRUD APIs exist; UI is read-focused currently). Email notifications (Resend) for new inquiries/bookings.
- **P1**: Real Instagram feed integration; sitemap.xml + robots.txt + JSON-LD schema markup.
- **P2**: Brute-force lockout on login; per-collection Pydantic validation for admin CRUD; split server.py into routers; image optimization/CDN; Google Analytics + Meta Pixel.
- **P2**: Multi-image galleries per service uploaded via admin; blog rich-text editor.

## Credentials
Admin: admin@sparshpehla.com / SparshAdmin@2026 (see /app/memory/test_credentials.md)
