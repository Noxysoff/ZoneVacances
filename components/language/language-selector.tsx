"use client";

import type { Route } from "next";
import Link from "next/link";
import { getLanguageNativeLabel } from "@/lib/i18n";
import { LOCALE_COOKIE_NAME, SUPPORTED_LOCALES } from "@/lib/locale";
import type { AppLocale } from "@/lib/types";

export function LanguageSelector({
  currentLocale,
  currentLabel,
}: {
  currentLabel: string;
  currentLocale: AppLocale;
}) {
  return (
    <section className="language-grid">
      {SUPPORTED_LOCALES.map((locale) => (
        <Link
          className={`language-card${locale === currentLocale ? " is-active" : ""}`}
          href={`/${locale}/home` as Route}
          key={locale}
          onClick={() => {
            document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; samesite=lax`;
          }}
        >
          <span className="language-card__label">{getLanguageNativeLabel(locale)}</span>
          <span className="language-card__meta">
            {locale === currentLocale ? currentLabel : locale.toUpperCase()}
          </span>
        </Link>
      ))}
    </section>
  );
}
