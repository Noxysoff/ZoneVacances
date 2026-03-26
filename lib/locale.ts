import type { AppLocale } from "@/lib/types";

export const SUPPORTED_LOCALES = ["fr", "en", "pl"] as const satisfies readonly AppLocale[];

export const DEFAULT_LOCALE: AppLocale = "fr";
export const LOCALE_COOKIE_NAME = "zonevacances-locale";

export function isLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as (typeof SUPPORTED_LOCALES)[number]);
}

export function normalizeLocaleCandidate(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.trim().toLowerCase().split(/[-_]/)[0] ?? "";
}

export function resolvePreferredLocale(
  cookieLocale?: string | null,
  acceptLanguage?: string | null,
): AppLocale {
  const cookieCandidate = normalizeLocaleCandidate(cookieLocale);

  if (isLocale(cookieCandidate)) {
    return cookieCandidate;
  }

  const headerCandidates = (acceptLanguage ?? "")
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim())
    .map(normalizeLocaleCandidate);

  for (const candidate of headerCandidates) {
    if (isLocale(candidate)) {
      return candidate;
    }
  }

  return DEFAULT_LOCALE;
}

export function getPathWithoutLocale(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "/";
  }

  if (isLocale(segments[0] ?? "")) {
    const rest = segments.slice(1).join("/");
    return rest.length > 0 ? `/${rest}` : "/";
  }

  return pathname;
}

export function withLocale(locale: AppLocale, pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalized = getPathWithoutLocale(path);
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function replaceLocaleInPath(pathname: string, nextLocale: AppLocale) {
  return withLocale(nextLocale, pathname);
}
