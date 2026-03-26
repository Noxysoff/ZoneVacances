import { getLocalizedCountryName } from "@/lib/i18n";
import type { AppLocale, CountryDefinition, CountrySlug } from "@/lib/types";

const FRANCE: CountryDefinition = {
  slug: "france",
  isoCode: "FR",
  mapId: "fr",
  defaultName: "France",
  timeZone: "Europe/Paris",
};

const BELGIUM: CountryDefinition = {
  slug: "belgium",
  isoCode: "BE",
  mapId: "be",
  defaultName: "Belgium",
  timeZone: "Europe/Brussels",
};

export const APP_COUNTRY_IDS = new Set(["fr", "be"]);

export const COUNTRIES: Record<CountrySlug, CountryDefinition> = {
  belgium: BELGIUM,
  france: FRANCE,
};

export const AVAILABLE_COUNTRY_SLUGS: CountrySlug[] = ["france", "belgium"];

export const MAP_ID_TO_COUNTRY_SLUG: Record<string, CountrySlug> = {
  be: "belgium",
  fr: "france",
};

export function getCountryDefinition(country: string) {
  return COUNTRIES[country as CountrySlug];
}

export function getCountryName(country: CountrySlug, locale: AppLocale) {
  const definition = COUNTRIES[country];

  return getLocalizedCountryName(definition.isoCode, locale, definition.defaultName);
}

export function getCountryDescription(country: CountrySlug, locale: AppLocale) {
  const countryName = getCountryName(country, locale);

  if (locale === "fr") {
    return `${countryName} : vacances scolaires, vacances restantes et jours feries.`;
  }

  if (locale === "pl") {
    return `${countryName}: ferie szkolne, pozostale przerwy i swieta panstwowe.`;
  }

  return `${countryName}: school holidays, remaining breaks and public holidays.`;
}

export function getSortedCountries(locale: AppLocale) {
  const collator = new Intl.Collator(locale);

  return [...AVAILABLE_COUNTRY_SLUGS]
    .map((slug) => ({
      country: COUNTRIES[slug],
      label: getCountryName(slug, locale),
      slug,
    }))
    .sort((first, second) => collator.compare(first.label, second.label));
}
