import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SearchPageClient } from "@/components/search/search-page-client";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import type { AppLocale } from "@/lib/types";

function getSearchLabels(locale: AppLocale) {
  const normalizedLocale = locale.slice(0, 2);

  if (normalizedLocale === "fr") {
    return {
      emptyHint:
        "Tape une lettre et on te propose tout de suite la commune, le departement ou la region avec sa zone scolaire.",
      helper: "La recherche se lance automatiquement a chaque lettre.",
      inputLabel: "Ville, village, departement, region ou code postal",
      loading: "Recherche en cours...",
      noResults: "Aucun resultat pour cette recherche.",
      placeholder: "Paris, Bretagne, 75, 35000...",
      requestError: "La recherche n'a pas pu aboutir.",
    };
  }

  if (normalizedLocale === "de") {
    return {
      emptyHint:
        "Tippe einen Buchstaben und die Liste aktualisiert sich sofort mit Ort, Departement oder Region samt Schulzone.",
      helper: "Die Suche startet automatisch bei jeder Eingabe.",
      inputLabel: "Stadt, Dorf, Departement, Region oder Postleitzahl",
      loading: "Suche lauft...",
      noResults: "Kein Ergebnis fur diese Suche.",
      placeholder: "Paris, Bretagne, 75, 35000...",
      requestError: "Die Suche konnte nicht abgeschlossen werden.",
    };
  }

  if (normalizedLocale === "en") {
    return {
      emptyHint:
        "Type a letter and the list updates instantly with a city, department or region and its school zone.",
      helper: "Search runs automatically on every keystroke.",
      inputLabel: "City, village, department, region or postal code",
      loading: "Searching...",
      noResults: "No result for this search.",
      placeholder: "Paris, Brittany, 75, 35000...",
      requestError: "Search could not be completed.",
    };
  }

  return {
    emptyHint:
      "Type a letter and the list updates instantly with a city, department or region and its school zone.",
    helper: "Search runs automatically on every keystroke.",
    inputLabel: "City, village, department, region or postal code",
    loading: "Searching...",
    noResults: "No result for this search.",
    placeholder: "Paris, Bretagne, 75, 35000...",
    requestError: "Search could not be completed.",
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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

        <p className="page-copy page-copy--wide">{dictionary.home.helper}</p>
      </section>

      <Suspense fallback={<div className="search-empty">...</div>}>
        <SearchPageClient
          basePath={`/${locale}/search`}
          labels={getSearchLabels(locale)}
        />
      </Suspense>
    </main>
  );
}
