function readEnvValue(key: string, fallback: string) {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export const env = {
  francePublicHolidaysBaseUrl: readEnvValue(
    "FRANCE_PUBLIC_HOLIDAYS_BASE_URL",
    "https://calendrier.api.gouv.fr/jours-feries",
  ),
  franceSchoolCalendarIcsBaseUrl: readEnvValue(
    "FRANCE_SCHOOL_CALENDAR_ICS_BASE_URL",
    "https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire",
  ),
  geoApiBaseUrl: readEnvValue("GEO_API_BASE_URL", "https://geo.api.gouv.fr"),
  nagerDateBaseUrl: readEnvValue("NAGER_DATE_BASE_URL", "https://date.nager.at/api/v3"),
  openHolidaysBaseUrl: readEnvValue(
    "OPEN_HOLIDAYS_BASE_URL",
    "https://openholidaysapi.org",
  ),
  siteName: readEnvValue("NEXT_PUBLIC_SITE_NAME", "ZoneVacances"),
} as const;
