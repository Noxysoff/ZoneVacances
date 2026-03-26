import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SearchPageClient } from "@/components/search/search-page-client";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import type { AppLocale, SearchSuggestionType } from "@/lib/types";

function getSearchLabels(locale: AppLocale) {
  if (locale === "fr") {
    return {
      inputLabel: "Ville, commune, region, departement ou code postal",
      loading: "Recherche en cours...",
      noResults: "Aucun resultat pour cette recherche.",
      placeholder: "Paris, Bruxelles, Liege, 1000, 75...",
      requestError: "La recherche n'a pas pu aboutir.",
    };
  }

  if (locale === "pl") {
    return {
      inputLabel: "Miasto, gmina, region, departament lub kod pocztowy",
      loading: "Trwa wyszukiwanie...",
      noResults: "Brak wynikow dla tego zapytania.",
      placeholder: "Paris, Bruxelles, Liege, 1000, 75...",
      requestError: "Nie udalo sie wykonac wyszukiwania.",
    };
  }

  return {
    inputLabel: "City, municipality, region, department or postal code",
    loading: "Searching...",
    noResults: "No result for this search.",
    placeholder: "Paris, Brussels, Liege, 1000, 75...",
    requestError: "Search could not be completed.",
  };
}

function getSearchTypeLabels(locale: AppLocale): Record<SearchSuggestionType, string> {
  if (locale === "fr") {
    return {
      commune: "Commune",
      departement: "Departement",
      region: "Region",
    };
  }

  if (locale === "pl") {
    return {
      commune: "Gmina",
      departement: "Departament",
      region: "Region",
    };
  }

  return {
    commune: "Town",
    departement: "Department",
    region: "Region",
  };
}

function getSearchIntro(locale: AppLocale) {
  if (locale === "fr") {
    return "Recherche ta ville ou ton code postal et on t'indique ta zone en France ou ta communaute scolaire en Belgique.";
  }

  if (locale === "pl") {
    return "Wyszukaj swoje miasto lub kod pocztowy, a wskazemy Twoja strefe we Francji albo wspolnote szkolna w Belgii.";
  }

  return "Search your city or postal code and we will tell you the school zone in France or the school community in Belgium.";
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ locale }, { q }] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <main className="page-shell">
      <section className="page-heading page-heading--stack">
        <div>
          <p className="page-kicker">ZoneVacances</p>
          <h1 className="page-title">{dictionary.common.search}</h1>
        </div>

        <p className="page-copy page-copy--wide">{getSearchIntro(locale)}</p>
      </section>

      <Suspense fallback={<div className="search-empty">...</div>}>
        <SearchPageClient
          basePath={`/${locale}/search`}
          initialQuery={q?.trim() ?? ""}
          labels={getSearchLabels(locale)}
          locale={locale}
          typeLabels={getSearchTypeLabels(locale)}
        />
      </Suspense>
    </main>
  );
}
