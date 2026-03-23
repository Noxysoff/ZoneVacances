import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryDescription, getSortedCountries } from "@/lib/countries";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const countries = getSortedCountries(locale);

  return (
    <main className="page-shell">
      <section className="page-heading page-heading--stack">
        <div>
          <p className="page-kicker">ZoneVacances</p>
          <h1 className="page-title">{dictionary.countriesPage.title}</h1>
        </div>

        <p className="page-copy page-copy--wide">{dictionary.countriesPage.subtitle}</p>
      </section>

      <section className="country-list">
        {countries.map((country) => {
          return (
            <article className="country-list__card" key={country.slug}>
              <p className="country-list__eyebrow">{country.country.isoCode}</p>
              <h2 className="country-list__title">{country.label}</h2>
              <p className="country-list__copy">
                {getCountryDescription(country.slug, locale)}
              </p>
              <Link
                className="inline-action inline-action--primary"
                href={`/${locale}/countries/${country.slug}` as Route}
              >
                {dictionary.countriesPage.openCountry}
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
