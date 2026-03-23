import worldMap from "@svg-maps/world";
import { getLocalizedCountryName } from "@/lib/i18n";
import type { AppLocale, CountryDefinition, CountrySlug } from "@/lib/types";

type WorldMapLocation = {
  id: string;
  name: string;
  path: string;
};

type WorldMapDefinition = {
  locations: WorldMapLocation[];
  viewBox: string;
};

const typedWorldMap = worldMap as WorldMapDefinition;

export const APP_COUNTRY_IDS = new Set([
  "at",
  "be",
  "bg",
  "ch",
  "cy",
  "cz",
  "de",
  "dk",
  "ee",
  "es",
  "fi",
  "fr",
  "gb",
  "gr",
  "hr",
  "hu",
  "ie",
  "it",
  "lt",
  "lu",
  "mt",
  "nl",
  "pl",
  "pt",
  "ro",
  "lv",
  "se",
  "si",
  "sk",
]);

const COUNTRY_NAME_OVERRIDES: Record<string, string> = {
  mk: "North Macedonia",
  xk: "Kosovo",
};

const TIME_ZONE_BY_COUNTRY_ISO: Record<string, string> = {
  AD: "Europe/Andorra",
  AL: "Europe/Tirane",
  AT: "Europe/Vienna",
  BA: "Europe/Sarajevo",
  BE: "Europe/Brussels",
  BG: "Europe/Sofia",
  BY: "Europe/Minsk",
  CH: "Europe/Zurich",
  CY: "Asia/Nicosia",
  CZ: "Europe/Prague",
  DE: "Europe/Berlin",
  DK: "Europe/Copenhagen",
  EE: "Europe/Tallinn",
  ES: "Europe/Madrid",
  FI: "Europe/Helsinki",
  FR: "Europe/Paris",
  GB: "Europe/London",
  GR: "Europe/Athens",
  HR: "Europe/Zagreb",
  HU: "Europe/Budapest",
  IE: "Europe/Dublin",
  IS: "Atlantic/Reykjavik",
  IT: "Europe/Rome",
  LI: "Europe/Zurich",
  LT: "Europe/Vilnius",
  LU: "Europe/Luxembourg",
  LV: "Europe/Riga",
  MC: "Europe/Monaco",
  MD: "Europe/Chisinau",
  ME: "Europe/Belgrade",
  MK: "Europe/Skopje",
  MT: "Europe/Malta",
  NL: "Europe/Amsterdam",
  NO: "Europe/Oslo",
  PL: "Europe/Warsaw",
  PT: "Europe/Lisbon",
  RO: "Europe/Bucharest",
  RS: "Europe/Belgrade",
  RU: "Europe/Moscow",
  SE: "Europe/Stockholm",
  SI: "Europe/Ljubljana",
  SK: "Europe/Bratislava",
  SM: "Europe/Rome",
  TR: "Europe/Istanbul",
  UA: "Europe/Kyiv",
  VA: "Europe/Rome",
  XK: "Europe/Belgrade",
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildCountryDefinition(location: WorldMapLocation): CountryDefinition {
  const isoCode = location.id.toUpperCase();
  const defaultName = COUNTRY_NAME_OVERRIDES[location.id] ?? location.name;
  const sources =
    isoCode === "FR"
      ? [
          {
            href: "https://data.education.gouv.fr/explore/dataset/fr-en-calendrier-scolaire",
            label: "Education France",
          },
          {
            href: "https://calendrier.api.gouv.fr/jours-feries/",
            label: "Jours feries FR",
          },
        ]
      : [
          {
            href: "https://www.openholidaysapi.org/",
            label: "OpenHolidays API",
          },
        ];

  return {
    slug: slugify(defaultName),
    isoCode,
    mapId: location.id,
    defaultName,
    timeZone: TIME_ZONE_BY_COUNTRY_ISO[isoCode] ?? "Europe/Brussels",
    sources,
  };
}

export const COUNTRIES: Record<CountrySlug, CountryDefinition> = Object.fromEntries(
  typedWorldMap.locations
    .filter((location) => APP_COUNTRY_IDS.has(location.id))
    .map((location) => {
      const definition = buildCountryDefinition(location);
      return [definition.slug, definition];
    }),
) as Record<CountrySlug, CountryDefinition>;

export const AVAILABLE_COUNTRY_SLUGS: CountrySlug[] = Object.keys(COUNTRIES);
export const MAP_ID_TO_COUNTRY_SLUG: Record<string, CountrySlug> = Object.fromEntries(
  Object.values(COUNTRIES).map((country) => [country.mapId, country.slug]),
) as Record<string, CountrySlug>;

export function getCountryDefinition(country: CountrySlug) {
  return COUNTRIES[country];
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

  if (locale === "de") {
    return `${countryName}: Schulferien, verbleibende Ferien und Feiertage.`;
  }

  if (locale === "es") {
    return `${countryName}: vacaciones escolares, vacaciones restantes y festivos.`;
  }

  if (locale === "it") {
    return `${countryName}: vacanze scolastiche, vacanze restanti e festivita.`;
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
