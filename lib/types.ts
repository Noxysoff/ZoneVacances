export type AppLocale = string;
export type CountrySlug = string;
export type CountryIsoCode = string;
export type ZoneId = "A" | "B" | "C";
export type RegionTone = ZoneId | "SPECIAL";
export type CountdownMode = "untilStart" | "untilEnd";
export type CountdownStatusTone = "current" | "past" | "upcoming";
export type SearchSuggestionType = "commune" | "departement" | "region";
export type CountryZoneMatchType = "group" | "national" | "subdivision";

export interface LocalizedText {
  language: string;
  text: string;
}

export interface HolidayApiEntry {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  name: LocalizedText[];
  regionalScope: string;
  temporalScope: string;
  nationwide?: boolean;
  subdivisions?: Array<{
    code: string;
    shortName: string;
  }>;
  groups?: Array<{
    code: string;
    shortName: string;
  }>;
}

export interface ZoneDefinition {
  zone: ZoneId;
  code: string;
  label: string;
  color: string;
  glow: string;
  academies: string[];
  regions: string[];
}

export interface BelgiumCommunityDefinition {
  code: string;
  label: string;
  shortLabel: string;
  color: string;
  glow: string;
}

export interface FranceRegionDefinition {
  code: string;
  name: string;
  shortLabel: string;
  zone: RegionTone;
  academies: string[];
  polygon: string;
  labelX: number;
  labelY: number;
  note?: string;
}

export interface CountdownItem {
  id: string;
  name: string;
  dateLabel: string;
  startDate: string;
  endDate: string;
  targetDateTime: string;
  countdownMode: CountdownMode;
  countdownLabel: string;
  statusLabel: string;
  statusTone: CountdownStatusTone;
}

export interface ZoneCardData {
  zone: ZoneId;
  label: string;
  code: string;
  color: string;
  glow: string;
  academies: string[];
  regions: string[];
  nextHoliday: CountdownItem | null;
}

export interface BelgiumCardData {
  code: string;
  label: string;
  shortLabel: string;
  color: string;
  glow: string;
  nextHoliday: CountdownItem | null;
}

export interface PublicHolidayData extends CountdownItem {
  description?: string;
  nationwide: boolean;
  regionalScope: string;
}

export interface VacationPeriodSummary {
  id: string;
  name: string;
  dateLabel: string;
  startDate: string;
  endDate: string;
}

export interface TenYearZoneVacations {
  zone: string;
  label: string;
  periods: VacationPeriodSummary[];
}

export interface TenYearVacationYear {
  year: number;
  zones: TenYearZoneVacations[];
}

export interface TenYearVacationData {
  generatedAt: string;
  years: TenYearVacationYear[];
  warnings: string[];
}

export interface DashboardData {
  generatedAt: string;
  zones: ZoneCardData[];
  belgium: BelgiumCardData[];
  publicHolidays: PublicHolidayData[];
  sources: Array<{
    label: string;
    href: string;
  }>;
  warnings: string[];
}

export interface SearchSuggestion {
  id: string;
  label: string;
  type: SearchSuggestionType;
  zone: RegionTone;
  zoneLabel: string;
  regionCode: string;
  regionName: string;
  detail: string;
}

export interface SearchApiResponse {
  query: string;
  suggestions: SearchSuggestion[];
}

export interface LocaleLabelMap {
  [locale: string]: string;
}

export interface CountryDefinition {
  slug: CountrySlug;
  isoCode: CountryIsoCode;
  mapId: string;
  defaultName: string;
  timeZone: string;
  sources: Array<{
    href: string;
    label: string;
  }>;
}

export interface CountryZoneConfig {
  code: string;
  color: string;
  glow: string;
  label: string;
  matchType: CountryZoneMatchType;
  shortLabel: string;
}

export interface CountryZoneCountdownData {
  id: string;
  label: string;
  shortLabel: string;
  code: string;
  color: string;
  glow: string;
  matchType: CountryZoneMatchType;
  nextHoliday: CountdownItem | null;
}

export interface RemainingVacationData extends CountdownItem {
  zoneId: string;
  zoneLabel: string;
  zoneShortLabel: string;
  color: string;
}

export interface CountryPageData {
  country: CountryDefinition;
  generatedAt: string;
  nextVacations: CountryZoneCountdownData[];
  remainingVacations: RemainingVacationData[];
  publicHolidays: PublicHolidayData[];
  warnings: string[];
}
