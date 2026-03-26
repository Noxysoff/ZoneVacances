"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import type {
  SearchApiResponse,
  SearchSuggestion,
  SearchSuggestionType,
} from "@/lib/types";

const DEFAULT_TYPE_LABELS: Record<SearchSuggestionType, string> = {
  commune: "Commune",
  departement: "Departement",
  region: "Region",
};

const DEFAULT_LABELS = {
  inputLabel: "Ville, village, departement, region ou code postal",
  loading: "Recherche en cours...",
  noResults: "Aucun resultat pour cette recherche.",
  placeholder: "Paris, Bretagne, 75, 35000...",
  requestError: "La recherche n'a pas pu aboutir.",
};

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="search-icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="11"
        cy="11"
        fill="none"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
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

export function SearchPageClient({
  basePath = "/recherche",
  initialQuery = "",
  labels = DEFAULT_LABELS,
  locale = "fr",
  typeLabels = DEFAULT_TYPE_LABELS,
}: {
  basePath?: string;
  initialQuery?: string;
  labels?: typeof DEFAULT_LABELS;
  locale?: "fr" | "en" | "pl";
  typeLabels?: Record<SearchSuggestionType, string>;
}) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    const timeoutId = window.setTimeout(() => {
      const nextUrl =
        trimmed.length > 0
          ? `${basePath}?q=${encodeURIComponent(trimmed)}`
          : basePath;
      window.history.replaceState(window.history.state, "", nextUrl);
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [basePath, query]);

  useEffect(() => {
    const trimmed = deferredQuery.trim();

    if (trimmed.length === 0) {
      setSuggestions([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(labels.requestError);
        }

        const payload = (await response.json()) as SearchApiResponse;

        startTransition(() => {
          setSuggestions(payload.suggestions);
          setError(null);
        });
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "La recherche est temporairement indisponible.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 120);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [deferredQuery, labels.requestError, locale]);

  return (
    <section className="search-shell">
      <div className="search-bar">
        <label className="search-label" htmlFor="zone-search">
          {labels.inputLabel}
        </label>

        <div className="search-input-wrap">
          <SearchIcon />
          <input
            autoComplete="off"
            autoFocus
            className="search-input"
            id="zone-search"
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder={labels.placeholder}
            spellCheck={false}
            type="search"
            value={query}
          />
        </div>
      </div>

      {error ? <div className="warning-banner">{error}</div> : null}

      {query.trim().length === 0 ? null : isLoading ? (
        <div className="search-empty">{labels.loading}</div>
      ) : suggestions.length === 0 ? (
        <div className="search-empty">{labels.noResults}</div>
      ) : (
        <ul className="search-suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                className="search-suggestion"
                onClick={() => {
                  setQuery(suggestion.label);
                }}
                type="button"
              >
                <div className="search-suggestion__header">
                  <div className="search-suggestion__main">
                    <span className="search-suggestion__title">{suggestion.label}</span>
                    <span className="search-type">{typeLabels[suggestion.type]}</span>
                  </div>

                  <span
                    className="search-zone"
                    style={{ ["--search-zone-color" as string]: suggestion.zoneColor }}
                  >
                    {suggestion.zoneLabel}
                  </span>
                </div>

                <p className="search-detail">{suggestion.detail}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
