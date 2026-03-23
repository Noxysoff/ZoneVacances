import { DateTime } from "luxon";
import type { AppLocale } from "@/lib/types";

function getLuxonLocale(locale: AppLocale) {
  const locales: Record<string, string> = {
    fr: "fr",
    en: "en",
    de: "de",
  };

  return locales[locale.slice(0, 2)] ?? locale.slice(0, 2) ?? "en";
}

function getLocaleText(locale: AppLocale, values: Record<string, string>, fallback = "en") {
  return values[locale.slice(0, 2)] ?? values[fallback] ?? Object.values(values)[0] ?? "";
}

export function formatDateLabel(
  startDate: string,
  endDate: string,
  timeZone: string,
  locale: AppLocale = "fr",
) {
  const runtimeLocale = getLuxonLocale(locale);
  const start = DateTime.fromISO(startDate, { zone: timeZone }).setLocale(runtimeLocale);
  const end = DateTime.fromISO(endDate, { zone: timeZone }).setLocale(runtimeLocale);

  if (start.hasSame(end, "day")) {
    return formatSingleDay(start, locale);
  }

  if (start.hasSame(end, "month") && start.hasSame(end, "year")) {
    return formatSameMonthRange(start, end, locale);
  }

  if (start.hasSame(end, "year")) {
    return formatSameYearRange(start, end, locale);
  }

  return formatFullRange(start, end, locale);
}

function formatSingleDay(date: DateTime, locale: AppLocale) {
  const prefix: Record<string, string> = {
    fr: "Le",
    en: "On",
    de: "Am",
  };

  return `${getLocaleText(locale, prefix)} ${date.toFormat("d LLLL yyyy")}`;
}

function formatSameMonthRange(start: DateTime, end: DateTime, locale: AppLocale) {
  const prefix: Record<string, string> = {
    fr: "Du",
    en: "From",
    de: "Von",
  };
  const connector: Record<string, string> = {
    fr: "au",
    en: "to",
    de: "bis",
  };

  return `${getLocaleText(locale, prefix)} ${start.toFormat("d")} ${getLocaleText(locale, connector)} ${end.toFormat("d LLLL yyyy")}`;
}

function formatSameYearRange(start: DateTime, end: DateTime, locale: AppLocale) {
  const prefix: Record<string, string> = {
    fr: "Du",
    en: "From",
    de: "Von",
  };
  const connector: Record<string, string> = {
    fr: "au",
    en: "to",
    de: "bis",
  };

  return `${getLocaleText(locale, prefix)} ${start.toFormat("d LLLL")} ${getLocaleText(locale, connector)} ${end.toFormat("d LLLL yyyy")}`;
}

function formatFullRange(start: DateTime, end: DateTime, locale: AppLocale) {
  const prefix: Record<string, string> = {
    fr: "Du",
    en: "From",
    de: "Von",
  };
  const connector: Record<string, string> = {
    fr: "au",
    en: "to",
    de: "bis",
  };

  return `${getLocaleText(locale, prefix)} ${start.toFormat("d LLLL yyyy")} ${getLocaleText(locale, connector)} ${end.toFormat("d LLLL yyyy")}`;
}

export function buildTargetDateTime(
  date: string,
  timeZone: string,
  mode: "start" | "end",
) {
  const base = DateTime.fromISO(date, { zone: timeZone });
  const withBoundary = mode === "start" ? base.startOf("day") : base.endOf("day");
  const utcDate = withBoundary.toUTC();

  return (
    utcDate.toISO({
      suppressMilliseconds: true,
    }) ?? utcDate.toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
  );
}

export function isDateWithinRange(
  startDate: string,
  endDate: string,
  timeZone: string,
  reference = DateTime.now().setZone(timeZone),
) {
  const start = DateTime.fromISO(startDate, { zone: timeZone }).startOf("day");
  const end = DateTime.fromISO(endDate, { zone: timeZone }).endOf("day");

  return reference >= start && reference <= end;
}

export function isDateAfterRange(
  endDate: string,
  timeZone: string,
  reference = DateTime.now().setZone(timeZone),
) {
  const end = DateTime.fromISO(endDate, { zone: timeZone }).endOf("day");
  return reference > end;
}
