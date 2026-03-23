import type {
  BelgiumCommunityDefinition,
  FranceRegionDefinition,
  ZoneDefinition,
} from "@/lib/types";

export const SCHOOL_API_REVALIDATE_SECONDS = 60 * 60 * 6;
export const CLIENT_REFRESH_INTERVAL_MS = 1000 * 60 * 15;

export const FRANCE_TIME_ZONE = "Europe/Paris";
export const BELGIUM_TIME_ZONE = "Europe/Brussels";

export const FRANCE_ZONE_DEFINITIONS: ZoneDefinition[] = [
  {
    zone: "A",
    code: "FR-ZA",
    label: "Zone A",
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.28)",
    academies: [
      "Besancon",
      "Bordeaux",
      "Clermont-Ferrand",
      "Dijon",
      "Grenoble",
      "Limoges",
      "Lyon",
      "Poitiers",
    ],
    regions: [
      "Auvergne-Rhone-Alpes",
      "Bourgogne-Franche-Comte",
      "Nouvelle-Aquitaine",
    ],
  },
  {
    zone: "B",
    code: "FR-ZB",
    label: "Zone B",
    color: "#ef4444",
    glow: "rgba(239, 68, 68, 0.28)",
    academies: [
      "Aix-Marseille",
      "Amiens",
      "Lille",
      "Nancy-Metz",
      "Nantes",
      "Nice",
      "Normandie",
      "Orleans-Tours",
      "Reims",
      "Rennes",
      "Strasbourg",
    ],
    regions: [
      "Bretagne",
      "Centre-Val de Loire",
      "Grand Est",
      "Hauts-de-France",
      "Normandie",
      "Pays de la Loire",
      "Provence-Alpes-Cote d'Azur",
    ],
  },
  {
    zone: "C",
    code: "FR-ZC",
    label: "Zone C",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.28)",
    academies: ["Creteil", "Montpellier", "Paris", "Toulouse", "Versailles"],
    regions: ["Ile-de-France", "Occitanie"],
  },
];

export const BELGIUM_COMMUNITIES: BelgiumCommunityDefinition[] = [
  {
    code: "BE-FR",
    label: "Communaute francaise",
    shortLabel: "Belgique FR",
    color: "#14b8a6",
    glow: "rgba(20, 184, 166, 0.22)",
  },
  {
    code: "BE-NL",
    label: "Communaute flamande",
    shortLabel: "Belgique NL",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.22)",
  },
  {
    code: "BE-DE",
    label: "Communaute germanophone",
    shortLabel: "Belgique DE",
    color: "#eab308",
    glow: "rgba(234, 179, 8, 0.22)",
  },
];

export const REGION_ZONE_COLORS: Record<string, string> = {
  A: "#3b82f6",
  B: "#ef4444",
  C: "#f59e0b",
  SPECIAL: "#6b7280",
};

export const REGION_ZONE_LABELS: Record<string, string> = {
  A: "Zone A",
  B: "Zone B",
  C: "Zone C",
  SPECIAL: "Calendrier specifique",
};

export const FRANCE_REGION_MAP: FranceRegionDefinition[] = [];

export const FRANCE_REGION_ZONE_BY_CODE: Record<string, "A" | "B" | "C" | "SPECIAL"> = {
  "11": "C",
  "24": "B",
  "27": "A",
  "28": "B",
  "32": "B",
  "44": "B",
  "52": "B",
  "53": "B",
  "75": "A",
  "76": "C",
  "84": "A",
  "93": "B",
  "94": "SPECIAL",
};

export const FRANCE_REGION_NAME_BY_CODE: Record<string, string> = {
  "11": "Ile-de-France",
  "24": "Centre-Val de Loire",
  "27": "Bourgogne-Franche-Comte",
  "28": "Normandie",
  "32": "Hauts-de-France",
  "44": "Grand Est",
  "52": "Pays de la Loire",
  "53": "Bretagne",
  "75": "Nouvelle-Aquitaine",
  "76": "Occitanie",
  "84": "Auvergne-Rhone-Alpes",
  "93": "Provence-Alpes-Cote d'Azur",
  "94": "Corse",
};
