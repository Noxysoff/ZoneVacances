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
  get belgiumAddressApiBaseUrl() {
    return readRequiredEnvValue("BELGIUM_ADDRESS_API_BASE_URL");
  },
  get belgiumAddressApiSourceUrl() {
    return readRequiredEnvValue("BELGIUM_ADDRESS_API_SOURCE_URL");
  },
  get francePublicHolidaysBaseUrl() {
    return readRequiredEnvValue("FRANCE_PUBLIC_HOLIDAYS_BASE_URL");
  },
  get franceSchoolCalendarIcsBaseUrl() {
    return readRequiredEnvValue("FRANCE_SCHOOL_CALENDAR_ICS_BASE_URL");
  },
  get franceSchoolCalendarSourceUrl() {
    return readRequiredEnvValue("FRANCE_SCHOOL_CALENDAR_SOURCE_URL");
  },
  get francePublicHolidaysSourceUrl() {
    return readRequiredEnvValue("FRANCE_PUBLIC_HOLIDAYS_SOURCE_URL");
  },
  get geoApiBaseUrl() {
    return readRequiredEnvValue("GEO_API_BASE_URL");
  },
  get geoApiSourceUrl() {
    return readRequiredEnvValue("GEO_API_SOURCE_URL");
  },
  get openHolidaysBaseUrl() {
    return readRequiredEnvValue("OPEN_HOLIDAYS_BASE_URL");
  },
  get openHolidaysSourceUrl() {
    return readRequiredEnvValue("OPEN_HOLIDAYS_SOURCE_URL");
  },
  get siteName() {
    return readOptionalEnvValue("NEXT_PUBLIC_SITE_NAME", "ZoneVacances");
  },
} as const;
