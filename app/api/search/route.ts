import belgiumMap from "@/data/belgium-map.json";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  FRANCE_REGION_NAME_BY_CODE,
  FRANCE_REGION_ZONE_BY_CODE,
  REGION_ZONE_COLORS,
} from "@/lib/constants";
import { isLocale } from "@/lib/locale";
import type {
  AppLocale,
  CountrySlug,
  RegionTone,
  SearchApiResponse,
  SearchSuggestion,
} from "@/lib/types";

export const dynamic = "force-dynamic";

type GeoRegion = {
  code: string;
  nom: string;
};

type GeoDepartement = {
  code: string;
  nom: string;
  codeRegion?: string;
  region?: GeoRegion;
};

type GeoCommune = {
  code: string;
  nom: string;
  codeDepartement?: string;
  codeRegion?: string;
  codesPostaux?: string[];
  departement?: GeoDepartement;
  region?: GeoRegion;
};

type BestAddressEntry = {
  hasMunicipality?: {
    nisCode?: string;
    name?: Record<string, string>;
  };
  hasPostalInfo?: {
    postCode?: string;
  };
};

type BestAddressResponse = {
  items?: BestAddressEntry[];
};

type BelgiumMapPayload = {
  municipalities: Array<{
    community: "BE-DE" | "BE-FR" | "BE-NL";
    districtId: string | null;
    id: string;
    label: string;
  }>;
};

type SearchCopy = {
  belgiumCommunityLabels: Record<"BE-DE" | "BE-FR" | "BE-NL", string>;
  countryLabels: Record<CountrySlug, string>;
  departmentLabel: string;
  departmentUnknown: string;
  noResultsTitle: string;
  postalCodeUnknown: string;
  regionLabel: string;
  regionUnknown: string;
  requestError: string;
  zoneLabels: Record<RegionTone, string>;
};

const typedBelgiumMap = belgiumMap as BelgiumMapPayload;
const BELGIUM_COMMUNITY_COLORS: Record<"BE-DE" | "BE-FR" | "BE-NL", string> = {
  "BE-DE": "#eab308",
  "BE-FR": "#14b8a6",
  "BE-NL": "#38bdf8",
};

const belgiumCommunityByNisCode = new Map(
  typedBelgiumMap.municipalities.map((municipality) => [
    municipality.id.replace("BE_", ""),
    municipality.community,
  ]),
);

function getSearchCopy(locale: AppLocale): SearchCopy {
  if (locale === "fr") {
    return {
      belgiumCommunityLabels: {
        "BE-DE": "Communaute germanophone",
        "BE-FR": "Communaute francaise",
        "BE-NL": "Communaute flamande",
      },
      countryLabels: {
        belgium: "Belgique",
        france: "France",
      },
      departmentLabel: "Departement",
      departmentUnknown: "Departement inconnu",
      noResultsTitle: "Aucun resultat pour cette recherche.",
      postalCodeUnknown: "Code postal inconnu",
      regionLabel: "Region",
      regionUnknown: "Region inconnue",
      requestError: "La recherche de zone est temporairement indisponible.",
      zoneLabels: {
        A: "Zone A",
        B: "Zone B",
        C: "Zone C",
        SPECIAL: "Calendrier specifique",
      },
    };
  }

  if (locale === "pl") {
    return {
      belgiumCommunityLabels: {
        "BE-DE": "Wspolnota niemieckojezyczna",
        "BE-FR": "Wspolnota francuska",
        "BE-NL": "Wspolnota flamandzka",
      },
      countryLabels: {
        belgium: "Belgia",
        france: "Francja",
      },
      departmentLabel: "Departament",
      departmentUnknown: "Nieznany departament",
      noResultsTitle: "Brak wynikow dla tego zapytania.",
      postalCodeUnknown: "Nieznany kod pocztowy",
      regionLabel: "Region",
      regionUnknown: "Nieznany region",
      requestError: "Wyszukiwanie stref jest chwilowo niedostepne.",
      zoneLabels: {
        A: "Strefa A",
        B: "Strefa B",
        C: "Strefa C",
        SPECIAL: "Kalendarz specjalny",
      },
    };
  }

  return {
    belgiumCommunityLabels: {
      "BE-DE": "German-speaking Community",
      "BE-FR": "French Community",
      "BE-NL": "Flemish Community",
    },
    countryLabels: {
      belgium: "Belgium",
      france: "France",
    },
    departmentLabel: "Department",
    departmentUnknown: "Unknown department",
    noResultsTitle: "No result for this search.",
    postalCodeUnknown: "Unknown postal code",
    regionLabel: "Region",
    regionUnknown: "Unknown region",
    requestError: "Zone search is temporarily unavailable.",
    zoneLabels: {
      A: "Zone A",
      B: "Zone B",
      C: "Zone C",
      SPECIAL: "Special calendar",
    },
  };
}

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeQuery(value: string) {
  const trimmed = value.trim();
  const lettersOnly = stripDiacritics(trimmed).replace(/[^a-zA-Z]/g, "");
  const digitsOnly = trimmed.replace(/[^0-9]/g, "");

  return {
    digitsOnly,
    lettersOnly,
    trimmed,
  };
}

function getZoneForRegion(regionCode?: string): RegionTone {
  if (!regionCode) {
    return "SPECIAL";
  }

  return FRANCE_REGION_ZONE_BY_CODE[regionCode] ?? "SPECIAL";
}

function getRegionName(copy: SearchCopy, regionCode?: string, fallback?: string) {
  if (!regionCode) {
    return fallback ?? copy.regionUnknown;
  }

  return fallback ?? FRANCE_REGION_NAME_BY_CODE[regionCode] ?? copy.regionUnknown;
}

function buildFrenchCommuneSuggestion(
  entry: GeoCommune,
  copy: SearchCopy,
): SearchSuggestion | null {
  const regionCode = entry.codeRegion ?? entry.region?.code;

  if (!regionCode) {
    return null;
  }

  const zone = getZoneForRegion(regionCode);
  const regionName = getRegionName(copy, regionCode, entry.region?.nom);
  const postalCodes =
    entry.codesPostaux && entry.codesPostaux.length > 0
      ? entry.codesPostaux.slice(0, 3).join(", ")
      : copy.postalCodeUnknown;
  const departmentName = entry.departement?.nom ?? copy.departmentUnknown;
  const departmentCode = entry.codeDepartement ?? entry.departement?.code ?? "--";

  return {
    country: "france",
    id: `fr-commune-${entry.code}`,
    label: entry.nom,
    type: "commune",
    zone,
    zoneColor: REGION_ZONE_COLORS[zone],
    zoneLabel: copy.zoneLabels[zone],
    regionCode,
    regionName,
    detail: `${copy.countryLabels.france} - ${postalCodes} - ${departmentName} (${departmentCode}) - ${regionName}`,
  };
}

function buildFrenchDepartementSuggestion(
  entry: GeoDepartement,
  copy: SearchCopy,
): SearchSuggestion | null {
  const regionCode = entry.codeRegion ?? entry.region?.code;

  if (!regionCode) {
    return null;
  }

  const zone = getZoneForRegion(regionCode);
  const regionName = getRegionName(copy, regionCode, entry.region?.nom);

  return {
    country: "france",
    id: `fr-departement-${entry.code}`,
    label: entry.nom,
    type: "departement",
    zone,
    zoneColor: REGION_ZONE_COLORS[zone],
    zoneLabel: copy.zoneLabels[zone],
    regionCode,
    regionName,
    detail: `${copy.countryLabels.france} - ${copy.departmentLabel} ${entry.code} - ${regionName}`,
  };
}

function buildFrenchRegionSuggestion(
  entry: GeoRegion,
  copy: SearchCopy,
): SearchSuggestion {
  const zone = getZoneForRegion(entry.code);

  return {
    country: "france",
    id: `fr-region-${entry.code}`,
    label: entry.nom,
    type: "region",
    zone,
    zoneColor: REGION_ZONE_COLORS[zone],
    zoneLabel: copy.zoneLabels[zone],
    regionCode: entry.code,
    regionName: getRegionName(copy, entry.code, entry.nom),
    detail: `${copy.countryLabels.france} - ${copy.regionLabel} ${entry.code}`,
  };
}

function getLocalizedBelgiumMunicipalityName(
  names: Record<string, string> | undefined,
  locale: AppLocale,
) {
  if (!names) {
    return "";
  }

  if (locale === "fr") {
    return names.fr ?? names.nl ?? names.de ?? Object.values(names)[0] ?? "";
  }

  if (locale === "pl") {
    return names.fr ?? names.nl ?? names.de ?? Object.values(names)[0] ?? "";
  }

  return names.en ?? names.fr ?? names.nl ?? names.de ?? Object.values(names)[0] ?? "";
}

function buildBelgiumMunicipalitySuggestions(
  entries: BestAddressEntry[],
  copy: SearchCopy,
  locale: AppLocale,
) {
  const suggestions = new Map<string, SearchSuggestion>();

  for (const entry of entries) {
    const nisCode = entry.hasMunicipality?.nisCode;
    const municipalityLabel = getLocalizedBelgiumMunicipalityName(
      entry.hasMunicipality?.name,
      locale,
    );
    const postCode = entry.hasPostalInfo?.postCode;

    if (!nisCode || !municipalityLabel) {
      continue;
    }

    const community = belgiumCommunityByNisCode.get(nisCode) ?? "BE-FR";

    suggestions.set(`be-commune-${nisCode}`, {
      country: "belgium",
      id: `be-commune-${nisCode}`,
      label: municipalityLabel,
      type: "commune",
      zone: community,
      zoneColor: BELGIUM_COMMUNITY_COLORS[community],
      zoneLabel: copy.belgiumCommunityLabels[community],
      regionCode: nisCode,
      regionName: municipalityLabel,
      detail: `${copy.countryLabels.belgium} - ${postCode ?? copy.postalCodeUnknown}`,
    });
  }

  return [...suggestions.values()];
}

function dedupeSuggestions(entries: Array<SearchSuggestion | null>) {
  const map = new Map<string, SearchSuggestion>();

  for (const entry of entries) {
    if (entry) {
      map.set(entry.id, entry);
    }
  }

  return [...map.values()].slice(0, 14);
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Search API responded ${response.status}`);
  }

  return (await response.json()) as T;
}

function buildGeoApiUrl(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${env.geoApiBaseUrl}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

function buildBelgiumApiUrl(params: Record<string, string>) {
  const url = new URL(`${env.belgiumAddressApiBaseUrl}/addresses`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const localeCandidate = searchParams.get("locale");
  const locale: AppLocale = isLocale(localeCandidate ?? "")
    ? (localeCandidate as AppLocale)
    : "fr";
  const copy = getSearchCopy(locale);

  if (query.length === 0) {
    const payload: SearchApiResponse = {
      query,
      suggestions: [],
    };

    return NextResponse.json(payload);
  }

  const { lettersOnly, digitsOnly, trimmed } = normalizeQuery(query);
  const nameVariants = Array.from(
    new Set([trimmed, lettersOnly].filter((value) => value.length > 0)),
  );
  const numericCodeCandidate =
    /^[0-9]{1,2}[A-B]?$/i.test(trimmed) || /^[0-9]{1,2}$/.test(digitsOnly)
      ? trimmed.toUpperCase()
      : "";
  const postalCodeCandidate = digitsOnly.length >= 2 ? digitsOnly : "";

  try {
    const frenchCommuneRequests = nameVariants.map((value) =>
      fetchJson<GeoCommune[]>(
        buildGeoApiUrl("communes", {
          boost: "population",
          fields:
            "nom,code,codesPostaux,codeDepartement,codeRegion,departement,region",
          limit: "6",
          nom: value,
        }),
      ),
    );

    if (postalCodeCandidate.length >= 2) {
      frenchCommuneRequests.push(
        fetchJson<GeoCommune[]>(
          buildGeoApiUrl("communes", {
            boost: "population",
            codePostal: postalCodeCandidate,
            fields:
              "nom,code,codesPostaux,codeDepartement,codeRegion,departement,region",
            limit: "6",
          }),
        ),
      );
    }

    const frenchDepartmentRequests: Array<Promise<GeoDepartement[]>> = [];

    for (const value of nameVariants) {
      frenchDepartmentRequests.push(
        fetchJson<GeoDepartement[]>(
          buildGeoApiUrl("departements", {
            fields: "nom,code,codeRegion,region",
            limit: "4",
            nom: value,
          }),
        ),
      );
    }

    if (numericCodeCandidate) {
      frenchDepartmentRequests.push(
        fetchJson<GeoDepartement[]>(
          buildGeoApiUrl("departements", {
            code: numericCodeCandidate,
            fields: "nom,code,codeRegion,region",
          }),
        ),
      );
    }

    const frenchRegionRequests: Array<Promise<GeoRegion[]>> = [];

    for (const value of nameVariants) {
      frenchRegionRequests.push(
        fetchJson<GeoRegion[]>(
          buildGeoApiUrl("regions", {
            fields: "nom,code",
            limit: "3",
            nom: value,
          }),
        ),
      );
    }

    if (/^[0-9]{2}$/.test(digitsOnly)) {
      frenchRegionRequests.push(
        fetchJson<GeoRegion[]>(
          buildGeoApiUrl("regions", {
            code: digitsOnly,
            fields: "nom,code",
          }),
        ),
      );
    }

    const belgiumRequests: Array<Promise<BestAddressResponse>> = [];

    for (const value of nameVariants) {
      belgiumRequests.push(
        fetchJson<BestAddressResponse>(
          buildBelgiumApiUrl({
            municipalityName: value,
            pageSize: "8",
          }),
        ),
      );
    }

    if (postalCodeCandidate.length >= 4) {
      belgiumRequests.push(
        fetchJson<BestAddressResponse>(
          buildBelgiumApiUrl({
            pageSize: "8",
            postCode: postalCodeCandidate,
          }),
        ),
      );
    }

    const [
      frenchCommuneResults,
      frenchDepartmentResults,
      frenchRegionResults,
      belgiumResults,
    ] = await Promise.all([
      Promise.all(frenchCommuneRequests),
      Promise.all(frenchDepartmentRequests),
      Promise.all(frenchRegionRequests),
      Promise.all(belgiumRequests),
    ]);

    const belgiumSuggestions = buildBelgiumMunicipalitySuggestions(
      belgiumResults.flatMap((result) => result.items ?? []),
      copy,
      locale,
    );

    const suggestions = dedupeSuggestions([
      ...frenchCommuneResults.flat().map((entry) => buildFrenchCommuneSuggestion(entry, copy)),
      ...frenchDepartmentResults
        .flat()
        .map((entry) => buildFrenchDepartementSuggestion(entry, copy)),
      ...frenchRegionResults.flat().map((entry) => buildFrenchRegionSuggestion(entry, copy)),
      ...belgiumSuggestions,
    ]);

    const payload: SearchApiResponse = {
      query,
      suggestions,
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message: copy.requestError,
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 502 },
    );
  }
}
