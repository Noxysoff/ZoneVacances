function readOptionalEnvValue(key: string, fallback: string) {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
}

function readRequiredEnvValue(key: string) {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  belgiumAddressApiBaseUrl: readRequiredEnvValue("BELGIUM_ADDRESS_API_BASE_URL"),
  belgiumAddressApiSourceUrl: readRequiredEnvValue("BELGIUM_ADDRESS_API_SOURCE_URL"),
  francePublicHolidaysBaseUrl: readRequiredEnvValue("FRANCE_PUBLIC_HOLIDAYS_BASE_URL"),
  franceSchoolCalendarIcsBaseUrl: readRequiredEnvValue(
    "FRANCE_SCHOOL_CALENDAR_ICS_BASE_URL",
  ),
  franceSchoolCalendarSourceUrl: readRequiredEnvValue("FRANCE_SCHOOL_CALENDAR_SOURCE_URL"),
  francePublicHolidaysSourceUrl: readRequiredEnvValue("FRANCE_PUBLIC_HOLIDAYS_SOURCE_URL"),
  geoApiBaseUrl: readRequiredEnvValue("GEO_API_BASE_URL"),
  geoApiSourceUrl: readRequiredEnvValue("GEO_API_SOURCE_URL"),
  openHolidaysBaseUrl: readRequiredEnvValue("OPEN_HOLIDAYS_BASE_URL"),
  openHolidaysSourceUrl: readRequiredEnvValue("OPEN_HOLIDAYS_SOURCE_URL"),
  siteName: readOptionalEnvValue("NEXT_PUBLIC_SITE_NAME", "ZoneVacances"),
} as const;
