"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLanguageNativeLabel } from "@/lib/i18n";
import { LOCALE_COOKIE_NAME, SUPPORTED_LOCALES, replaceLocaleInPath } from "@/lib/locale";
import type { AppLocale, CountrySlug } from "@/lib/types";

type SiteHeaderProps = {
  countries: Array<{
    label: string;
    slug: CountrySlug;
  }>;
  labels: {
    allLanguages: string;
    availableCountries: string;
    countries: string;
    home: string;
    language: string;
    selectLanguage: string;
  };
  locale: AppLocale;
  searchLabel: string;
};

function BrandLogo() {
  return (
    <svg
      aria-hidden="true"
      className="site-brand__logo-svg"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill="none"
        height="24"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.7"
        width="24"
        x="4"
        y="6"
      />
      <path d="M10 4V9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M22 4V9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M5 12H27" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="9" y="16" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="15" y="16" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="21" y="16" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="9" y="22" />
      <rect fill="currentColor" height="3" rx="1.5" width="3" x="15" y="22" />
    </svg>
  );
}

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

function setPreferredLocale(locale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function SiteHeader({ countries, labels, locale, searchLabel }: SiteHeaderProps) {
  const pathname = usePathname();
  const homeHref = `/${locale}/home` as Route;
  const countriesRootHref = `/${locale}/countries` as Route;
  const languagePageHref = `/${locale}/language` as Route;
  const searchHref = `/${locale}/search` as Route;
  const isHomeActive = pathname === `/${locale}` || pathname === `/${locale}/home`;
  const isCountriesActive = pathname.startsWith(`/${locale}/countries`);
  const isLanguageActive = pathname.startsWith(`/${locale}/language`);
  const isSearchActive = pathname.startsWith(`/${locale}/search`);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href={homeHref}>
          <span className="site-brand__logo">
            <BrandLogo />
          </span>
          <span className="site-brand__text">ZoneVacances</span>
        </Link>

        <nav aria-label="Primary navigation" className="site-nav">
          <Link
            aria-current={isHomeActive ? "page" : undefined}
            className={`site-nav__link${isHomeActive ? " is-active" : ""}`}
            href={homeHref}
          >
            {labels.home}
          </Link>

          <Link
            aria-current={isSearchActive ? "page" : undefined}
            className={`site-nav__link${isSearchActive ? " is-active" : ""}`}
            href={searchHref}
          >
            {searchLabel}
          </Link>

          <details className="site-menu">
            <summary
              className={`site-menu__trigger${isCountriesActive ? " is-active" : ""}`}
            >
              <span>{labels.countries}</span>
              <ChevronIcon />
            </summary>

            <div className="site-menu__panel">
              <p className="site-menu__label">{labels.availableCountries}</p>
              <div className="site-menu__list">
                {countries.map((country) => (
                  <Link
                    className="site-menu__item"
                    href={`/${locale}/countries/${country.slug}` as Route}
                    key={country.slug}
                  >
                    {country.label}
                  </Link>
                ))}
                <Link className="site-menu__item site-menu__item--muted" href={countriesRootHref}>
                  {labels.availableCountries}
                </Link>
              </div>
            </div>
          </details>

          <details className="site-menu">
            <summary
              className={`site-menu__trigger${isLanguageActive ? " is-active" : ""}`}
            >
              <span className="site-menu__trigger-label">
                <GlobeIcon />
                {labels.language}
              </span>
              <ChevronIcon />
            </summary>

            <div className="site-menu__panel">
              <p className="site-menu__label">{labels.selectLanguage}</p>
              <div className="site-menu__list">
                {SUPPORTED_LOCALES.map((nextLocale) => (
                  <Link
                    className="site-menu__item"
                    href={replaceLocaleInPath(pathname, nextLocale) as Route}
                    key={nextLocale}
                    onClick={() => {
                      setPreferredLocale(nextLocale);
                    }}
                  >
                    {getLanguageNativeLabel(nextLocale)}
                  </Link>
                ))}

                <Link className="site-menu__item site-menu__item--muted" href={languagePageHref}>
                  {labels.allLanguages}
                </Link>
              </div>
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}
