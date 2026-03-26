"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/navigation/brand-logo";
import { getLanguageNativeLabel } from "@/lib/i18n";
import { LOCALE_COOKIE_NAME, SUPPORTED_LOCALES, replaceLocaleInPath } from "@/lib/locale";
import type { AppLocale, CountrySlug } from "@/lib/types";

type SiteHeaderProps = {
  countries: Array<{
    label: string;
    slug: CountrySlug;
  }>;
  labels: {
    closeMenu: string;
    home: string;
    language: string;
    openMenu: string;
    primaryNavigation: string;
    selectLanguage: string;
  };
  locale: AppLocale;
  searchLabel: string;
};

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="site-nav__icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" fill="none" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.8 12h16.4M12 3.5c2 2.1 3.2 5.1 3.2 8.5S14 18.4 12 20.5M12 3.5c-2 2.1-3.2 5.1-3.2 8.5s1.2 6.4 3.2 8.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="site-nav__chevron"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25 7.5L10 12.25L14.75 7.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="site-burger__icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={open ? "M6 6L18 18M18 6L6 18" : "M4 7H20M4 12H20M4 17H20"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" className="site-link__icon" viewBox="0 0 24 24">
      <path
        d="M4 10.5L12 4L20 10.5M6.5 9.5V19H17.5V9.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="site-link__icon" viewBox="0 0 24 24">
      <circle cx="11" cy="11" fill="none" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16L21 21"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FranceIcon() {
  return (
    <svg aria-hidden="true" className="site-link__icon" viewBox="0 0 24 24">
      <path
        d="M4.4 15.2C4.9 13.9 6.4 12.2 8.8 10.4C11.3 8.6 14.6 7 18.2 5.9C19.3 6.5 19.9 7.5 19.7 8.6C18.9 10.2 17.2 12 14.6 13.9C12 15.8 9.2 17.2 6.5 18C5.5 17.5 4.8 16.5 4.4 15.2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8 14.8L9.3 16.1M10.8 12.8L12.1 14.1M13.5 10.8L14.8 12.1M16.2 8.8L17.4 10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function BelgiumIcon() {
  return (
    <svg aria-hidden="true" className="site-link__icon" viewBox="0 0 24 24">
      <path
        d="M7 9.2H17L16 19H8L7 9.2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.6 9.2L6.4 6.7M9.8 9.2L9.1 5.9M12.2 9.2V5.3M14.7 9.2L15.4 5.9M17 9.2L18.4 6.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <path
        d="M8 11.8C9.3 12.7 10.5 13.1 12 13.1C13.5 13.1 14.7 12.7 16 11.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function getLinkIcon(label: string, href: Route) {
  if (href.includes("/home")) {
    return <HomeIcon />;
  }

  if (href.includes("/search")) {
    return <SearchIcon />;
  }

  if (href.includes("/france")) {
    return <FranceIcon />;
  }

  if (href.includes("/belgium")) {
    return <BelgiumIcon />;
  }

  return null;
}

function setPreferredLocale(locale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function SiteHeader({ countries, labels, locale, searchLabel }: SiteHeaderProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const homeHref = `/${locale}/home` as Route;
  const searchHref = `/${locale}/search` as Route;
  const isHomeActive = pathname === `/${locale}` || pathname === `/${locale}/home`;
  const isSearchActive = pathname.startsWith(`/${locale}/search`);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openLanguageMenu = () => {
    clearCloseTimeout();
    setIsLanguageMenuOpen(true);
  };

  const closeLanguageMenu = () => {
    clearCloseTimeout();
    setIsLanguageMenuOpen(false);
  };

  const scheduleLanguageMenuClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsLanguageMenuOpen(false);
      closeTimeoutRef.current = null;
    }, 120);
  };

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  useEffect(() => {
    if (!isLanguageMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isLanguageMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const primaryLinks = [
    {
      active: isHomeActive,
      href: homeHref,
      label: labels.home,
    },
    {
      active: isSearchActive,
      href: searchHref,
      label: searchLabel,
    },
    ...countries.map((country) => ({
      active: pathname === `/${locale}/${country.slug}`,
      href: `/${locale}/${country.slug}` as Route,
      label: country.label,
    })),
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__mobile">
          <button
            aria-expanded={isMobileMenuOpen}
            aria-label={labels.openMenu}
            className="site-burger"
            onClick={() => {
              setIsMobileMenuOpen((current) => !current);
            }}
            type="button"
          >
            <BurgerIcon open={isMobileMenuOpen} />
          </button>

          <Link className="site-brand site-brand--mobile" href={homeHref}>
            <span className="site-brand__copy">
              <span className="site-brand__text">ZoneVacances</span>
              <span className="site-brand__beta">Beta</span>
            </span>
          </Link>
        </div>

        <Link className="site-brand site-brand--desktop" href={homeHref}>
          <span className="site-brand__logo">
            <BrandLogo className="site-brand__logo-svg" />
          </span>
          <span className="site-brand__copy">
            <span className="site-brand__text">ZoneVacances</span>
            <span className="site-brand__beta">Beta</span>
          </span>
        </Link>

        <nav aria-label={labels.primaryNavigation} className="site-nav" ref={navRef}>
          {primaryLinks.map((link) => (
            <Link
              aria-current={link.active ? "page" : undefined}
              className={`site-nav__link${link.active ? " is-active" : ""}`}
              href={link.href}
              key={link.href}
            >
              <span className="site-link__content">
                {getLinkIcon(link.label, link.href)}
                <span>{link.label}</span>
              </span>
            </Link>
          ))}

          <div
            className={`site-menu${isLanguageMenuOpen ? " is-open" : ""}`}
            onBlur={(event) => {
              const nextTarget = event.relatedTarget as Node | null;

              if (!event.currentTarget.contains(nextTarget)) {
                closeLanguageMenu();
              }
            }}
            onMouseEnter={openLanguageMenu}
            onMouseLeave={scheduleLanguageMenuClose}
          >
            <button
              aria-expanded={isLanguageMenuOpen}
              aria-haspopup="true"
              className="site-menu__trigger"
              type="button"
              onClick={() => {
                if (isLanguageMenuOpen) {
                  closeLanguageMenu();
                  return;
                }

                openLanguageMenu();
              }}
              onFocus={openLanguageMenu}
            >
              <span className="site-menu__trigger-label">
                <GlobeIcon />
                {labels.language}
              </span>
              <ChevronIcon />
            </button>

            <div
              aria-hidden={!isLanguageMenuOpen}
              className="site-menu__panel"
              onMouseEnter={openLanguageMenu}
              onMouseLeave={scheduleLanguageMenuClose}
            >
              <p className="site-menu__label">{labels.selectLanguage}</p>
              <div className="site-menu__list">
                {SUPPORTED_LOCALES.map((nextLocale) => (
                  <Link
                    className="site-menu__item"
                    href={replaceLocaleInPath(pathname, nextLocale) as Route}
                    key={nextLocale}
                    onClick={() => {
                      setPreferredLocale(nextLocale);
                      closeLanguageMenu();
                    }}
                    tabIndex={isLanguageMenuOpen ? 0 : -1}
                  >
                    {getLanguageNativeLabel(nextLocale)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div
        aria-hidden={!isMobileMenuOpen}
        className={`mobile-drawer-backdrop${isMobileMenuOpen ? " is-open" : ""}`}
        onClick={() => {
          setIsMobileMenuOpen(false);
        }}
      />

      <aside className={`mobile-drawer${isMobileMenuOpen ? " is-open" : ""}`}>
        <div className="mobile-drawer__header">
          <p className="mobile-drawer__title">ZoneVacances</p>
          <button
            aria-label={labels.closeMenu}
            className="mobile-drawer__close"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
            type="button"
          >
            <BurgerIcon open />
          </button>
        </div>

        <div className="mobile-drawer__section">
          {primaryLinks.map((link) => (
            <Link
              aria-current={link.active ? "page" : undefined}
              className={`mobile-drawer__link${link.active ? " is-active" : ""}`}
              href={link.href}
              key={`mobile-${link.href}`}
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="site-link__content">
                {getLinkIcon(link.label, link.href)}
                <span>{link.label}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mobile-drawer__section">
          <p className="mobile-drawer__label">{labels.selectLanguage}</p>
          <div className="mobile-drawer__languages">
            {SUPPORTED_LOCALES.map((nextLocale) => (
              <Link
                className={`mobile-drawer__language${locale === nextLocale ? " is-active" : ""}`}
                href={replaceLocaleInPath(pathname, nextLocale) as Route}
                key={`mobile-lang-${nextLocale}`}
                onClick={() => {
                  setPreferredLocale(nextLocale);
                  setIsMobileMenuOpen(false);
                }}
              >
                {getLanguageNativeLabel(nextLocale)}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
}
