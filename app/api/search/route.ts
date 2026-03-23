import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  FRANCE_REGION_NAME_BY_CODE,
  FRANCE_REGION_ZONE_BY_CODE,
  REGION_ZONE_LABELS,
} from "@/lib/constants";
import type { RegionTone, SearchApiResponse, SearchSuggestion } from "@/lib/types";

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

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeQuery(value: string) {
  const trimmed = value.trim();
  const lettersOnly = stripDiacritics(trimmed).replace(/[^a-zA-Z]/g, "");
  const digitsOnly = trimmed.replace(/[^0-9]/g, "");

  return {
    trimmed,
    lettersOnly,
    digitsOnly,
  };
}

function getZoneForRegion(regionCode?: string): RegionTone {
  if (!regionCode) {
    return "SPECIAL";
  }

  return FRANCE_REGION_ZONE_BY_CODE[regionCode] ?? "SPECIAL";
}

function getRegionName(regionCode?: string, fallback?: string) {
  if (!regionCode) {
    return fallback ?? "Region inconnue";
  }

  return fallback ?? FRANCE_REGION_NAME_BY_CODE[regionCode] ?? "Region inconnue";
}

function buildCommuneSuggestion(entry: GeoCommune): SearchSuggestion | null {
  const regionCode = entry.codeRegion ?? entry.region?.code;

  if (!regionCode) {
    return null;
  }

  const zone = getZoneForRegion(regionCode);
  const regionName = getRegionName(regionCode, entry.region?.nom);
  const postalCodes =
    entry.codesPostaux && entry.codesPostaux.length > 0
      ? entry.codesPostaux.slice(0, 3).join(", ")
      : "Code postal inconnu";
  const departmentName = entry.departement?.nom ?? "Departement inconnu";
  const departmentCode = entry.codeDepartement ?? entry.departement?.code ?? "--";

  return {
    id: `commune-${entry.code}`,
    label: entry.nom,
    type: "commune",
    zone,
    zoneLabel: REGION_ZONE_LABELS[zone],
    regionCode,
    regionName,
    detail: `${postalCodes} - ${departmentName} (${departmentCode}) - ${regionName}`,
  };
}

function buildDepartementSuggestion(entry: GeoDepartement): SearchSuggestion | null {
  const regionCode = entry.codeRegion ?? entry.region?.code;

  if (!regionCode) {
    return null;
  }

  const zone = getZoneForRegion(regionCode);
  const regionName = getRegionName(regionCode, entry.region?.nom);

  return {
    id: `departement-${entry.code}`,
    label: entry.nom,
    type: "departement",
    zone,
    zoneLabel: REGION_ZONE_LABELS[zone],
    regionCode,
    regionName,
    detail: `Departement ${entry.code} - ${regionName}`,
  };
}

function buildRegionSuggestion(entry: GeoRegion): SearchSuggestion {
  const zone = getZoneForRegion(entry.code);

  return {
    id: `region-${entry.code}`,
    label: entry.nom,
    type: "region",
    zone,
    zoneLabel: REGION_ZONE_LABELS[zone],
    regionCode: entry.code,
    regionName: getRegionName(entry.code, entry.nom),
    detail: `Region ${entry.code}`,
  };
}

function dedupeSuggestions(entries: Array<SearchSuggestion | null>) {
  const map = new Map<string, SearchSuggestion>();

  for (const entry of entries) {
    if (entry) {
      map.set(entry.id, entry);
    }
  }

  return [...map.values()].slice(0, 12);
}

async function fetchGeoApi<T>(
  endpoint: string,
  params: Record<string, string>,
): Promise<T> {
  const url = new URL(`${env.geoApiBaseUrl}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Geo API a repondu ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

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
    const communeRequests = nameVariants.map((value) =>
      fetchGeoApi<GeoCommune[]>("communes", {
        nom: value,
        boost: "population",
        limit: "6",
        fields:
          "nom,code,codesPostaux,codeDepartement,codeRegion,departement,region",
      }),
    );

    if (postalCodeCandidate.length >= 2) {
      communeRequests.push(
        fetchGeoApi<GeoCommune[]>("communes", {
          codePostal: postalCodeCandidate,
          boost: "population",
          limit: "6",
          fields:
            "nom,code,codesPostaux,codeDepartement,codeRegion,departement,region",
        }),
      );
    }

    const departementRequests: Array<Promise<GeoDepartement[]>> = [];

    for (const value of nameVariants) {
      departementRequests.push(
        fetchGeoApi<GeoDepartement[]>("departements", {
          nom: value,
          limit: "4",
          fields: "nom,code,codeRegion,region",
        }),
      );
    }

    if (numericCodeCandidate) {
      departementRequests.push(
        fetchGeoApi<GeoDepartement[]>("departements", {
          code: numericCodeCandidate,
          fields: "nom,code,codeRegion,region",
        }),
      );
    }

    const regionRequests: Array<Promise<GeoRegion[]>> = [];

    for (const value of nameVariants) {
      regionRequests.push(
        fetchGeoApi<GeoRegion[]>("regions", {
          nom: value,
          limit: "3",
          fields: "nom,code",
        }),
      );
    }

    if (/^[0-9]{2}$/.test(digitsOnly)) {
      regionRequests.push(
        fetchGeoApi<GeoRegion[]>("regions", {
          code: digitsOnly,
          fields: "nom,code",
        }),
      );
    }

    const [communeResults, departementResults, regionResults] = await Promise.all([
      Promise.all(communeRequests),
      Promise.all(departementRequests),
      Promise.all(regionRequests),
    ]);

    const suggestions = dedupeSuggestions([
      ...communeResults.flat().map(buildCommuneSuggestion),
      ...departementResults.flat().map(buildDepartementSuggestion),
      ...regionResults.flat().map(buildRegionSuggestion),
    ]);

    const payload: SearchApiResponse = {
      query,
      suggestions,
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message: "La recherche de zone est temporairement indisponible.",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 502 },
    );
  }
}
