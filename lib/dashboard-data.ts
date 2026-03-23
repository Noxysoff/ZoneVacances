import { DateTime } from "luxon";
import { getCountryDefinition } from "@/lib/countries";
import { env } from "@/lib/env";
import { getDictionary } from "@/lib/i18n";
import type {
  AppLocale,
  BelgiumCardData,
  CountdownItem,
  CountdownStatusTone,
  CountryDefinition,
  CountryPageData,
  CountrySlug,
  CountryZoneConfig,
  DashboardData,
  HolidayApiEntry,
  PublicHolidayData,
  RemainingVacationData,
  TenYearVacationData,
  TenYearVacationYear,
  VacationPeriodSummary,
  ZoneCardData,
} from "@/lib/types";
import {
  buildTargetDateTime,
  formatDateLabel,
  isDateAfterRange,
  isDateWithinRange,
} from "@/lib/time";

const RECENTLY_PAST_RETENTION_DAYS = 21;

type NagerPublicHolidayEntry = {
  countryCode: string;
  counties: string[] | null;
  date: string;
  global: boolean;
  localName: string;
  name: string;
  types: string[];
};

type FrancePublicHolidayApiResponse = Record<string, string>;

type FranceSchoolZoneCode = "FR-ZA" | "FR-ZB" | "FR-ZC";

const ZONE_COLOR_PALETTE = [
  { color: "#3b82f6", glow: "rgba(59, 130, 246, 0.28)" },
  { color: "#ef4444", glow: "rgba(239, 68, 68, 0.28)" },
  { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.28)" },
  { color: "#10b981", glow: "rgba(16, 185, 129, 0.28)" },
  { color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.28)" },
  { color: "#06b6d4", glow: "rgba(6, 182, 212, 0.28)" },
  { color: "#ec4899", glow: "rgba(236, 72, 153, 0.28)" },
  { color: "#84cc16", glow: "rgba(132, 204, 22, 0.28)" },
];

const API_LANGUAGE_ALLOWLIST = new Set([
  "BG",
  "BS",
  "CA",
  "CS",
  "CY",
  "DA",
  "DE",
  "EL",
  "EN",
  "ES",
  "ET",
  "FI",
  "FR",
  "GA",
  "HR",
  "HU",
  "IS",
  "IT",
  "LB",
  "LT",
  "LV",
  "MK",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "RU",
  "SK",
  "SL",
  "SQ",
  "SR",
  "SV",
  "TR",
  "UK",
]);

const COUNTRY_ZONE_OVERRIDES: Record<
  string,
  Record<string, Partial<Pick<CountryZoneConfig, "color" | "glow" | "label" | "shortLabel">>>
> = {
  BE: {
    "BE-DE": {
      color: "#eab308",
      glow: "rgba(234, 179, 8, 0.24)",
    },
    "BE-FR": {
      color: "#14b8a6",
      glow: "rgba(20, 184, 166, 0.24)",
    },
    "BE-NL": {
      color: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.24)",
    },
  },
  FR: {
    "FR-ZA": {
      color: "#3b82f6",
      glow: "rgba(59, 130, 246, 0.28)",
    },
    "FR-ZB": {
      color: "#ef4444",
      glow: "rgba(239, 68, 68, 0.28)",
    },
    "FR-ZC": {
      color: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.28)",
    },
  },
};

const FRANCE_OFFICIAL_ZONE_FILES: Record<FranceSchoolZoneCode, string> = {
  "FR-ZA": "Zone-A.ics",
  "FR-ZB": "Zone-B.ics",
  "FR-ZC": "Zone-C.ics",
};

function buildApiWindow(timeZone: string) {
  const now = DateTime.now().setZone(timeZone);

  return {
    validFrom: now.minus({ days: 45 }).toISODate() ?? "",
    validTo: now.plus({ months: 18 }).toISODate() ?? "",
  };
}

function buildTenYearApiWindow(timeZone: string) {
  const now = DateTime.now().setZone(timeZone);

  return {
    validFrom: now.toISODate() ?? "",
    validTo: now.plus({ years: 10 }).endOf("year").toISODate() ?? "",
  };
}

function getApiLanguage(locale: AppLocale) {
  const candidate = locale.slice(0, 2).toUpperCase();
  return API_LANGUAGE_ALLOWLIST.has(candidate) ? candidate : "EN";
}

function getLocalizedText(entries: HolidayApiEntry["name"], locale: AppLocale) {
  const preferredLanguage = getApiLanguage(locale);

  return (
    entries.find((entry) => entry.language === preferredLanguage)?.text ??
    entries.find((entry) => entry.language === "FR")?.text ??
    entries.find((entry) => entry.language === "EN")?.text ??
    entries.find((entry) => entry.language === "DE")?.text ??
    entries[0]?.text ??
    "Event"
  );
}

function normalizeLabel(value: string) {
  return value.trim().length > 0 ? value.trim() : "Zone";
}

function getNationalZoneLabel(locale: AppLocale) {
  const normalizedLocale = locale.slice(0, 2);

  switch (normalizedLocale) {
    case "de":
      return "National";
    case "es":
      return "Nacional";
    case "fr":
      return "National";
    case "it":
      return "Nazionale";
    case "nl":
      return "Nationaal";
    case "pl":
      return "Krajowy";
    case "pt":
      return "Nacional";
    case "ro":
      return "National";
    case "ru":
      return "Natsionalny";
    case "tr":
      return "Ulusal";
    case "uk":
      return "Natsionalnyi";
    default:
      return "National";
  }
}

function normalizeIcsText(value: string) {
  return value
    .replace(/\\,/g, ",")
    .replace(/\\n/g, " ")
    .replace(/\\'/g, "'")
    .trim();
}

function normalizeFranceSummary(summary: string) {
  return summary.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function parseFranceSchoolCalendar(icsText: string, zoneCode: FranceSchoolZoneCode) {
  const unfolded = icsText.replace(/\r?\n[ \t]/g, "");
  const events = unfolded.split("BEGIN:VEVENT").slice(1);
  const zoneLabel = zoneCode.replace("FR-Z", "Zone ");

  return events
    .map((eventBlock) => {
      const uid = eventBlock.match(/UID:(.+)/)?.[1]?.trim();
      const summary = eventBlock.match(/SUMMARY:(.+)/)?.[1]?.trim();
      const startRaw = eventBlock.match(/DTSTART;VALUE=DATE:(\d{8})/)?.[1];
      const endRaw = eventBlock.match(/DTEND;VALUE=DATE:(\d{8})/)?.[1];

      if (!uid || !summary || !startRaw || !endRaw) {
        return null;
      }

      const normalizedSummary = normalizeIcsText(summary);
      const normalizedKey = normalizeFranceSummary(normalizedSummary);

      if (normalizedKey.includes("prerentree")) {
        return null;
      }

      const startDate = DateTime.fromFormat(startRaw, "yyyyLLdd", {
        zone: "Europe/Paris",
      }).toISODate();
      const endDate = DateTime.fromFormat(endRaw, "yyyyLLdd", {
        zone: "Europe/Paris",
      })
        .minus({ days: 1 })
        .toISODate();

      if (!startDate || !endDate) {
        return null;
      }

      const parsedEntry: HolidayApiEntry = {
        id: `${zoneCode}-${uid}`,
        startDate,
        endDate,
        type: "SchoolHoliday",
        name: [{ language: "FR", text: normalizedSummary }],
        regionalScope: zoneLabel,
        temporalScope: "Official school calendar",
        groups: [
          {
            code: zoneCode,
            shortName: zoneLabel,
          },
        ],
      };

      return parsedEntry;
    })
    .filter(Boolean) as HolidayApiEntry[];
}

async function fetchOpenHolidays(
  endpoint: string,
  params: Record<string, string>,
) {
  const url = new URL(`${env.openHolidaysBaseUrl}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60 * 60 * 6,
    },
  });

  if (!response.ok) {
    throw new Error(`OpenHolidays ${endpoint} returned ${response.status}`);
  }

  return (await response.json()) as HolidayApiEntry[];
}

async function fetchFranceOfficialSchoolHolidays() {
  const responses = await Promise.all(
    Object.entries(FRANCE_OFFICIAL_ZONE_FILES).map(async ([zoneCode, fileName]) => {
      const response = await fetch(`${env.franceSchoolCalendarIcsBaseUrl}/${fileName}`, {
        headers: {
          Accept: "text/calendar, text/plain;q=0.9, */*;q=0.8",
        },
        next: {
          revalidate: 60 * 60 * 12,
        },
      });

      if (!response.ok) {
        throw new Error(`France school calendar returned ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const content = new TextDecoder("utf-8").decode(buffer);

      return parseFranceSchoolCalendar(content, zoneCode as FranceSchoolZoneCode);
    }),
  );

  return responses.flat().sort((first, second) => first.startDate.localeCompare(second.startDate));
}

async function fetchFranceOfficialPublicHolidays() {
  const now = DateTime.now().setZone("Europe/Paris");
  const years = [now.year, now.plus({ years: 1 }).year];
  const responses = await Promise.all(
    years.map(async (year) => {
      const response = await fetch(
        `${env.francePublicHolidaysBaseUrl}/metropole/${year}.json`,
        {
          headers: {
            Accept: "application/json",
          },
          next: {
            revalidate: 60 * 60 * 12,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`France public holidays returned ${response.status}`);
      }

      return (await response.json()) as FrancePublicHolidayApiResponse;
    }),
  );

  return responses
    .flatMap((payload) =>
      Object.entries(payload).map(([date, name]) => ({
        id: `fr-public-${date}`,
        startDate: date,
        endDate: date,
        type: "PublicHoliday",
        name: [{ language: "FR", text: name }],
        regionalScope: "Metropole",
        temporalScope: "Official public holidays",
        nationwide: true,
      }) satisfies HolidayApiEntry),
    )
    .sort((first, second) => first.startDate.localeCompare(second.startDate));
}

async function fetchNagerPublicHolidayEntries(country: CountryDefinition) {
  const now = DateTime.now().setZone(country.timeZone);
  const years = [now.year, now.plus({ years: 1 }).year];
  const responses = await Promise.all(
    years.map(async (year) => {
      const response = await fetch(
        `${env.nagerDateBaseUrl}/PublicHolidays/${year}/${country.isoCode}`,
        {
          headers: {
            Accept: "application/json",
          },
          next: {
            revalidate: 60 * 60 * 6,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Nager.Date PublicHolidays returned ${response.status}`);
      }

      return (await response.json()) as NagerPublicHolidayEntry[];
    }),
  );

  const uniqueEntries = new Map<string, HolidayApiEntry>();

  for (const entry of responses.flat()) {
    const id = `nager-${country.isoCode}-${entry.date}-${entry.name}`;

    uniqueEntries.set(id, {
      id,
      startDate: entry.date,
      endDate: entry.date,
      type: "PublicHoliday",
      name: [{ language: "EN", text: entry.name }],
      regionalScope: entry.global ? "National" : "Regional",
      temporalScope: entry.types.join(","),
      nationwide: entry.global,
      subdivisions:
        entry.counties?.map((code) => ({
          code,
          shortName: code,
        })) ?? [],
    });
  }

  return [...uniqueEntries.values()].sort((first, second) =>
    first.startDate.localeCompare(second.startDate),
  );
}

function buildCountdownItem(
  entry: HolidayApiEntry,
  timeZone: string,
  locale: AppLocale,
  statusTone?: CountdownStatusTone,
): CountdownItem {
  const dictionary = getDictionary(locale);
  const isOngoing = isDateWithinRange(entry.startDate, entry.endDate, timeZone);
  const resolvedStatusTone =
    statusTone ?? (isOngoing ? "current" : "upcoming");
  const countdownMode = resolvedStatusTone === "upcoming" ? "untilStart" : "untilEnd";

  return {
    id: entry.id,
    name: getLocalizedText(entry.name, locale),
    dateLabel: formatDateLabel(entry.startDate, entry.endDate, timeZone, locale),
    startDate: entry.startDate,
    endDate: entry.endDate,
    targetDateTime: buildTargetDateTime(
      countdownMode === "untilStart" ? entry.startDate : entry.endDate,
      timeZone,
      countdownMode === "untilStart" ? "start" : "end",
    ),
    countdownMode,
    countdownLabel:
      resolvedStatusTone === "upcoming"
        ? dictionary.countdown.startsIn
        : resolvedStatusTone === "current"
          ? dictionary.countdown.remaining
          : dictionary.countdown.ended,
    statusLabel:
      resolvedStatusTone === "upcoming"
        ? dictionary.countdown.upcoming
        : resolvedStatusTone === "current"
          ? dictionary.countdown.current
          : dictionary.countdown.past,
    statusTone: resolvedStatusTone,
  };
}

function sortByStartDate(entries: HolidayApiEntry[]) {
  return [...entries].sort((first, second) =>
    first.startDate.localeCompare(second.startDate),
  );
}

function normalizeHolidayCampaignKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isFranceBridgeHolidayEntry(entry: HolidayApiEntry) {
  return normalizeHolidayCampaignKey(getLocalizedText(entry.name, "fr")) === "pont de l ascension";
}

function buildFranceBridgePublicHolidays(entries: HolidayApiEntry[]) {
  const bridgeEntries = entries.filter(isFranceBridgeHolidayEntry);
  const dedupedEntries = new Map<string, HolidayApiEntry>();

  for (const entry of bridgeEntries) {
    const key = `${entry.startDate}-${entry.endDate}-${normalizeHolidayCampaignKey(
      getLocalizedText(entry.name, "fr"),
    )}`;

    if (!dedupedEntries.has(key)) {
      dedupedEntries.set(key, {
        ...entry,
        id: `fr-bridge-${entry.startDate}-${entry.endDate}`,
        type: "PublicHoliday",
        regionalScope: "Metropole",
        temporalScope: "Official school calendar",
        nationwide: true,
        groups: undefined,
        subdivisions: undefined,
      });
    }
  }

  return [...dedupedEntries.values()].sort((first, second) =>
    first.startDate.localeCompare(second.startDate),
  );
}

function buildFranceCampaignGroupKey(entry: HolidayApiEntry, timeZone: string) {
  const startYear = DateTime.fromISO(entry.startDate, { zone: timeZone }).year;
  return `${normalizeHolidayCampaignKey(getLocalizedText(entry.name, "fr"))}-${startYear}`;
}

function getFrancePublicHolidayDescription(
  entry: HolidayApiEntry,
  locale: AppLocale,
) {
  const key = normalizeHolidayCampaignKey(getLocalizedText(entry.name, "fr"));
  const isFrench = locale.startsWith("fr");

  switch (key) {
    case "jour de l an":
      return isFrench ? "Premier jour de l'annee civile." : "First day of the calendar year.";
    case "lundi de paques":
      return isFrench
        ? "Lendemain du dimanche de Paques."
        : "The day after Easter Sunday.";
    case "fete du travail":
    case "1er mai":
      return isFrench
        ? "Journee internationale des travailleurs."
        : "International Workers' Day.";
    case "victoire 1945":
    case "8 mai":
      return isFrench
        ? "Commemoration de la fin de la Seconde Guerre mondiale en Europe."
        : "Commemoration of the end of World War II in Europe.";
    case "ascension":
      return isFrench
        ? "Fete chretienne celebree quarante jours apres Paques."
        : "Christian feast celebrated forty days after Easter.";
    case "pont de l ascension":
      return isFrench
        ? "Weekend prolonge de l'Ascension commun aux trois zones scolaires."
        : "Ascension bridge weekend shared by all three school zones.";
    case "lundi de pentecote":
      return isFrench
        ? "Lendemain de la Pentecote."
        : "The day after Pentecost.";
    case "fete nationale":
    case "14 juillet":
      return isFrench
        ? "Commemoration de la prise de la Bastille et de la Fete de la Federation."
        : "Commemoration of Bastille Day and the Fete de la Federation.";
    case "assomption":
      return isFrench
        ? "Fete chretienne consacree a l'Assomption de Marie."
        : "Christian feast dedicated to the Assumption of Mary.";
    case "toussaint":
      return isFrench ? "Fete chretienne de tous les saints." : "Christian feast of All Saints.";
    case "armistice":
    case "11 novembre":
      return isFrench
        ? "Commemoration de l'armistice de 1918."
        : "Commemoration of the 1918 Armistice.";
    case "noel":
      return isFrench ? "Fete de Noel." : "Christmas Day.";
    default:
      return undefined;
  }
}

function getPublicHolidayDescription(
  country: CountryDefinition,
  entry: HolidayApiEntry,
  locale: AppLocale,
) {
  if (country.isoCode === "FR") {
    return getFrancePublicHolidayDescription(entry, locale);
  }

  return undefined;
}

function resolveCountdownStatusTone(
  entry: HolidayApiEntry,
  timeZone: string,
): CountdownStatusTone {
  if (isDateWithinRange(entry.startDate, entry.endDate, timeZone)) {
    return "current";
  }

  if (isDateAfterRange(entry.endDate, timeZone)) {
    return "past";
  }

  return "upcoming";
}

function buildZoneConfigs(
  country: CountryDefinition,
  entries: HolidayApiEntry[],
  locale: AppLocale,
): CountryZoneConfig[] {
  const collator = new Intl.Collator("en");
  const zoneMap = new Map<string, CountryZoneConfig>();
  const overrides = COUNTRY_ZONE_OVERRIDES[country.isoCode] ?? {};

  for (const entry of entries) {
    for (const subdivision of entry.subdivisions ?? []) {
      if (!zoneMap.has(subdivision.code)) {
        const override = overrides[subdivision.code];
        const palette = ZONE_COLOR_PALETTE[zoneMap.size % ZONE_COLOR_PALETTE.length];

        zoneMap.set(subdivision.code, {
          code: subdivision.code,
          color: override?.color ?? palette.color,
          glow: override?.glow ?? palette.glow,
          label: normalizeLabel(override?.label ?? subdivision.shortName ?? subdivision.code),
          matchType: "subdivision",
          shortLabel: normalizeLabel(
            override?.shortLabel ?? subdivision.shortName ?? subdivision.code,
          ),
        });
      }
    }

    for (const group of entry.groups ?? []) {
      if (!zoneMap.has(group.code)) {
        const override = overrides[group.code];
        const palette = ZONE_COLOR_PALETTE[zoneMap.size % ZONE_COLOR_PALETTE.length];

        zoneMap.set(group.code, {
          code: group.code,
          color: override?.color ?? palette.color,
          glow: override?.glow ?? palette.glow,
          label: normalizeLabel(override?.label ?? group.shortName ?? group.code),
          matchType: "group",
          shortLabel: normalizeLabel(override?.shortLabel ?? group.shortName ?? group.code),
        });
      }
    }
  }

  if (zoneMap.size === 0) {
    const palette = ZONE_COLOR_PALETTE[0];
    const nationalLabel = getNationalZoneLabel(locale);

    zoneMap.set(`${country.isoCode}-NATIONAL`, {
      code: `${country.isoCode}-NATIONAL`,
      color: palette.color,
      glow: palette.glow,
      label: nationalLabel,
      matchType: "national",
      shortLabel: nationalLabel,
    });
  }

  return [...zoneMap.values()].sort((first, second) =>
    collator.compare(first.label, second.label),
  );
}

function zoneMatchesEntry(entry: HolidayApiEntry, zone: CountryZoneConfig) {
  if (zone.matchType === "national") {
    return (entry.subdivisions?.length ?? 0) === 0 && (entry.groups?.length ?? 0) === 0;
  }

  if (zone.matchType === "subdivision") {
    return entry.subdivisions?.some((subdivision) => subdivision.code === zone.code) ?? false;
  }

  return entry.groups?.some((group) => group.code === zone.code) ?? false;
}

function findNextOrCurrentHoliday(
  country: CountryDefinition,
  entries: HolidayApiEntry[],
  zone: CountryZoneConfig,
  locale: AppLocale,
) {
  const relevantEntries = sortByStartDate(entries).filter((entry) =>
    zoneMatchesEntry(entry, zone),
  );

  const current = relevantEntries.find((entry) =>
    isDateWithinRange(entry.startDate, entry.endDate, country.timeZone),
  );

  if (current) {
    return buildCountdownItem(current, country.timeZone, locale, "current");
  }

  const now = DateTime.now().setZone(country.timeZone);
  const recentPast = [...relevantEntries]
    .reverse()
    .find((entry) => {
      const end = DateTime.fromISO(entry.endDate, {
        zone: country.timeZone,
      }).endOf("day");
      const elapsedDays = now.diff(end, "days").days;

      return elapsedDays > 0 && elapsedDays <= RECENTLY_PAST_RETENTION_DAYS;
    });

  if (recentPast) {
    return buildCountdownItem(recentPast, country.timeZone, locale, "past");
  }

  const upcoming = relevantEntries.find(
    (entry) => !isDateAfterRange(entry.endDate, country.timeZone),
  );

  return upcoming ? buildCountdownItem(upcoming, country.timeZone, locale, "upcoming") : null;
}

function buildFranceZoneCampaigns(
  country: CountryDefinition,
  entries: HolidayApiEntry[],
  locale: AppLocale,
) {
  const zones = buildZoneConfigs(country, entries, locale);
  const groupedEntries = new Map<
    string,
    { entries: HolidayApiEntry[]; maxEndDate: string; minStartDate: string }
  >();

  for (const entry of sortByStartDate(entries)) {
    const key = buildFranceCampaignGroupKey(entry, country.timeZone);
    const currentGroup = groupedEntries.get(key);

    if (!currentGroup) {
      groupedEntries.set(key, {
        entries: [entry],
        maxEndDate: entry.endDate,
        minStartDate: entry.startDate,
      });
      continue;
    }

    currentGroup.entries.push(entry);
    currentGroup.maxEndDate =
      currentGroup.maxEndDate > entry.endDate ? currentGroup.maxEndDate : entry.endDate;
    currentGroup.minStartDate =
      currentGroup.minStartDate < entry.startDate ? currentGroup.minStartDate : entry.startDate;
  }

  const currentCampaign = [...groupedEntries.values()]
    .sort((first, second) => first.minStartDate.localeCompare(second.minStartDate))
    .find((campaign) => !isDateAfterRange(campaign.maxEndDate, country.timeZone));

  if (!currentCampaign) {
    return null;
  }

  return zones.map((zone) => {
    const campaignEntryForZone = sortByStartDate(currentCampaign.entries).find((entry) =>
      zoneMatchesEntry(entry, zone),
    );

    return {
      id: zone.code,
      label: zone.label,
      shortLabel: zone.shortLabel,
      code: zone.code,
      color: zone.color,
      glow: zone.glow,
      matchType: zone.matchType,
      nextHoliday: campaignEntryForZone
        ? buildCountdownItem(
            campaignEntryForZone,
            country.timeZone,
            locale,
            resolveCountdownStatusTone(campaignEntryForZone, country.timeZone),
          )
        : findNextOrCurrentHoliday(country, entries, zone, locale),
    };
  });
}

function buildCountryZones(
  country: CountryDefinition,
  entries: HolidayApiEntry[],
  locale: AppLocale,
) {
  if (country.isoCode === "FR") {
    const franceCampaigns = buildFranceZoneCampaigns(country, entries, locale);

    if (franceCampaigns) {
      return franceCampaigns;
    }
  }

  return buildZoneConfigs(country, entries, locale).map((zone) => ({
    id: zone.code,
    label: zone.label,
    shortLabel: zone.shortLabel,
    code: zone.code,
    color: zone.color,
    glow: zone.glow,
    matchType: zone.matchType,
    nextHoliday: findNextOrCurrentHoliday(country, entries, zone, locale),
  }));
}

function buildRemainingVacations(
  country: CountryDefinition,
  entries: HolidayApiEntry[],
  locale: AppLocale,
  excludedCountdownIds: Set<string> = new Set(),
): RemainingVacationData[] {
  const zones = buildZoneConfigs(country, entries, locale);
  const currentYear = DateTime.now().setZone(country.timeZone).year;

  return zones
    .flatMap((zone) =>
      sortByStartDate(entries)
        .filter((entry) => zoneMatchesEntry(entry, zone))
        .filter((entry) => !isDateAfterRange(entry.endDate, country.timeZone))
        .filter((entry) => {
          const startYear = DateTime.fromISO(entry.startDate, {
            zone: country.timeZone,
          }).year;
          const endYear = DateTime.fromISO(entry.endDate, {
            zone: country.timeZone,
          }).year;

          return startYear === currentYear || endYear === currentYear;
        })
        .map((entry) => {
          const countdownItem = buildCountdownItem(entry, country.timeZone, locale);
          const id = `${zone.code}-${entry.id}`;

          return {
            ...countdownItem,
            id,
            zoneId: zone.code,
            zoneLabel: zone.label,
            zoneShortLabel: zone.shortLabel,
            color: zone.color,
          };
        })
        .filter((entry) => !excludedCountdownIds.has(entry.id)),
    )
    .sort((first, second) => first.startDate.localeCompare(second.startDate));
}

function buildPublicHolidayCards(
  entries: HolidayApiEntry[],
  country: CountryDefinition,
  locale: AppLocale,
): PublicHolidayData[] {
  const maxItems = country.isoCode === "FR" ? 5 : 3;
  const relevantEntries = sortByStartDate(entries).filter(
    (entry) => entry.nationwide ?? true,
  );

  return relevantEntries
    .filter((entry) => !isDateAfterRange(entry.endDate, country.timeZone))
    .slice(0, maxItems)
    .map((entry) => ({
      ...buildCountdownItem(entry, country.timeZone, locale),
      description: getPublicHolidayDescription(country, entry, locale),
      nationwide: Boolean(entry.nationwide ?? true),
      regionalScope: entry.regionalScope,
    }));
}

function buildVacationSummary(
  entry: HolidayApiEntry,
  country: CountryDefinition,
  locale: AppLocale,
  zoneCode?: string,
): VacationPeriodSummary {
  return {
    id: zoneCode ? `${zoneCode}-${entry.id}` : entry.id,
    name: getLocalizedText(entry.name, locale),
    dateLabel: formatDateLabel(entry.startDate, entry.endDate, country.timeZone, locale),
    startDate: entry.startDate,
    endDate: entry.endDate,
  };
}

function buildTenYearVacationYears(
  entries: HolidayApiEntry[],
  locale: AppLocale,
): TenYearVacationYear[] {
  const country = getCountryDefinition("france");
  const currentYear = DateTime.now().setZone(country.timeZone).year;
  const years = Array.from({ length: 10 }, (_, index) => currentYear + index);
  const sortedEntries = sortByStartDate(entries);
  const zones = buildZoneConfigs(country, entries, locale);

  return years.map((year) => ({
    year,
    zones: zones.map((zone) => ({
      zone: zone.code,
      label: zone.label,
      periods: sortedEntries
        .filter(
          (entry) =>
            entry.startDate.startsWith(String(year)) && zoneMatchesEntry(entry, zone),
        )
        .map((entry) => buildVacationSummary(entry, country, locale, zone.code)),
    })),
  }));
}

async function fetchCountryHolidayData(country: CountryDefinition, locale: AppLocale) {
  if (country.isoCode === "FR") {
    const officialSchoolResult = await fetchFranceOfficialSchoolHolidays()
      .then((value) => ({ status: "fulfilled" as const, value }))
      .catch((reason) => ({ status: "rejected" as const, reason }));
    const officialPublicHolidayResult = await fetchFranceOfficialPublicHolidays()
      .then((value) => ({ status: "fulfilled" as const, value }))
      .catch((reason) => ({ status: "rejected" as const, reason }));

    return {
      publicHolidayResult:
        officialPublicHolidayResult.status === "fulfilled" &&
        officialPublicHolidayResult.value.length > 0
          ? officialPublicHolidayResult
          : await fetchOpenHolidays("PublicHolidays", {
              countryIsoCode: country.isoCode,
              languageIsoCode: getApiLanguage(locale),
              validFrom: buildApiWindow(country.timeZone).validFrom,
              validTo: buildApiWindow(country.timeZone).validTo,
            })
              .then((value) => ({ status: "fulfilled" as const, value }))
              .catch((reason) => ({ status: "rejected" as const, reason })),
      schoolResult:
        officialSchoolResult.status === "fulfilled" && officialSchoolResult.value.length > 0
          ? officialSchoolResult
          : await fetchOpenHolidays("SchoolHolidays", {
              countryIsoCode: country.isoCode,
              languageIsoCode: getApiLanguage(locale),
              validFrom: buildApiWindow(country.timeZone).validFrom,
              validTo: buildApiWindow(country.timeZone).validTo,
            })
              .then((value) => ({ status: "fulfilled" as const, value }))
              .catch((reason) => ({ status: "rejected" as const, reason })),
    };
  }

  const apiWindow = buildApiWindow(country.timeZone);
  const languageIsoCode = getApiLanguage(locale);

  const [schoolResult, publicHolidayResult] = await Promise.allSettled([
    fetchOpenHolidays("SchoolHolidays", {
      countryIsoCode: country.isoCode,
      languageIsoCode,
      validFrom: apiWindow.validFrom,
      validTo: apiWindow.validTo,
    }),
    fetchOpenHolidays("PublicHolidays", {
      countryIsoCode: country.isoCode,
      languageIsoCode,
      validFrom: apiWindow.validFrom,
      validTo: apiWindow.validTo,
    }),
  ]);

  return {
    publicHolidayResult,
    schoolResult,
  };
}

export async function getCountryPageData(
  countrySlug: CountrySlug,
  locale: AppLocale,
): Promise<CountryPageData> {
  const country = getCountryDefinition(countrySlug);
  const dictionary = getDictionary(locale);
  const { schoolResult, publicHolidayResult } = await fetchCountryHolidayData(country, locale);

  const schoolHolidays = schoolResult.status === "fulfilled" ? schoolResult.value : [];
  const openHolidayPublicHolidays =
    publicHolidayResult.status === "fulfilled" ? publicHolidayResult.value : [];
  const warnings: string[] = [];
  const zoneSchoolHolidays =
    country.isoCode === "FR"
      ? schoolHolidays.filter((entry) => !isFranceBridgeHolidayEntry(entry))
      : schoolHolidays;
  let publicHolidayEntries = openHolidayPublicHolidays;

  if (publicHolidayEntries.length === 0) {
    try {
      publicHolidayEntries = await fetchNagerPublicHolidayEntries(country);
    } catch {
      publicHolidayEntries = [];
    }
  }

  if (schoolResult.status === "rejected" || schoolHolidays.length === 0) {
    warnings.push(dictionary.countryPage.noVacationData);
  }

  if (country.isoCode === "FR") {
    publicHolidayEntries = sortByStartDate([
      ...publicHolidayEntries,
      ...buildFranceBridgePublicHolidays(schoolHolidays),
    ]);
  }

  const nextVacations = buildCountryZones(country, zoneSchoolHolidays, locale);
  const excludedRemainingVacationIds = new Set(
    nextVacations.flatMap((zone) =>
      zone.nextHoliday ? [`${zone.code}-${zone.nextHoliday.id}`] : [],
    ),
  );

  return {
    country,
    generatedAt: new Date().toISOString(),
    nextVacations,
    remainingVacations: buildRemainingVacations(
      country,
      zoneSchoolHolidays,
      locale,
      excludedRemainingVacationIds,
    ),
    publicHolidays: buildPublicHolidayCards(publicHolidayEntries, country, locale),
    warnings,
  };
}

export async function getDashboardData(locale: AppLocale = "fr"): Promise<DashboardData> {
  const [franceData, belgiumData] = await Promise.all([
    getCountryPageData("france", locale),
    getCountryPageData("belgium", locale),
  ]);

  const zones: ZoneCardData[] = franceData.nextVacations.slice(0, 3).map((zone) => ({
    zone: (zone.label.split(" ").at(-1) ?? "A") as "A" | "B" | "C",
    label: zone.label,
    code: zone.code,
    color: zone.color,
    glow: zone.glow,
    academies: [],
    regions: [],
    nextHoliday: zone.nextHoliday,
  }));

  const belgium: BelgiumCardData[] = belgiumData.nextVacations.slice(0, 3).map((zone) => ({
    code: zone.code,
    label: zone.label,
    shortLabel: zone.shortLabel,
    color: zone.color,
    glow: zone.glow,
    nextHoliday: zone.nextHoliday,
  }));

  return {
    generatedAt: franceData.generatedAt,
    zones,
    belgium,
    publicHolidays: franceData.publicHolidays,
    sources: franceData.country.sources,
    warnings: [...franceData.warnings, ...belgiumData.warnings],
  };
}

export async function getTenYearVacationData(
  locale: AppLocale = "fr",
): Promise<TenYearVacationData> {
  const country = getCountryDefinition("france");
  const tenYearWindow = buildTenYearApiWindow(country.timeZone);

  const franceSchoolResult = await fetchOpenHolidays("SchoolHolidays", {
    countryIsoCode: country.isoCode,
    languageIsoCode: getApiLanguage(locale),
    validFrom: tenYearWindow.validFrom,
    validTo: tenYearWindow.validTo,
  })
    .then((value) => ({ status: "fulfilled" as const, value }))
    .catch((error) => ({ status: "rejected" as const, reason: error }));

  const warnings: string[] = [];
  const franceSchoolHolidays =
    franceSchoolResult.status === "fulfilled" ? franceSchoolResult.value : [];

  if (franceSchoolResult.status === "rejected") {
    warnings.push("Ten-year school holiday data is temporarily unavailable.");
  }

  return {
    generatedAt: new Date().toISOString(),
    years: buildTenYearVacationYears(franceSchoolHolidays, locale),
    warnings,
  };
}
