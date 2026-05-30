import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const NAV = [
    { to: "/",            label: "Home",     key: null },
    { to: "/about",       label: t("nav.about"),    key: "about" },
    { to: "/services",    label: t("nav.services"), key: "services" },
    { to: "/blog",        label: t("nav.journal"),  key: "journal" },
    { to: "/gallery",     label: t("nav.gallery"),  key: "gallery" },
    { to: "/testimonials",label: t("nav.stories"),  key: "stories" },
    { to: "/contact",     label: t("nav.contact"),  key: "contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-[0_8px_32px_rgba(139,125,107,0.08)] py-3" : "py-5 bg-transparent"
      }`}
    >
      <nav className="container-px flex items-center justify-between">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2 group">
          <Logo size="md" />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {NAV.filter(i => i.key).map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                data-testid={`nav-${item.key}`}
                className={({ isActive }) =>
                  `relative text-sm tracking-wide transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300 ${
                    isActive ? "text-gold after:w-full" : "text-ink-soft hover:text-ink after:w-0 hover:after:w-full"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Link
            to="/book"
            data-testid="navbar-book-cta"
            className="hidden sm:inline-flex items-center rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gold-dark hover:scale-[1.03] hover:shadow-lg"
          >
            {t("common.book_consultation")}
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button data-testid="mobile-menu-trigger" className="lg:hidden p-2 text-ink" aria-label="Open menu">
                <Menu strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-ivory border-beige w-[300px]">
              <div className="flex flex-col h-full">
                <Logo size="md" className="mb-8" />
                <ul className="flex flex-col gap-5">
                  {NAV.filter(i => i.key).map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        data-testid={`mobile-nav-${item.key}`}
                        className={({ isActive }) =>
                          `font-serif text-xl ${isActive ? "text-gold" : "text-ink"}`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <LanguageSwitcher />
                </div>
                <Link
                  to="/book"
                  data-testid="mobile-book-cta"
                  className="mt-4 inline-flex justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-white"
                >
                  {t("common.book_consultation")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
