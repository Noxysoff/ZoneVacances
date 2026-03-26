import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
  resolvePreferredLocale,
  withLocale,
} from "@/lib/locale";

const LEGACY_ROUTE_MAP: Record<string, string> = {
  "/belgique": "/belgium",
  "/countries/belgium": "/belgium",
  "/countries/france": "/france",
  "/france": "/france",
  "/recherche": "/search",
};

const LOCALE_PATTERN = new RegExp(`^\\/(${SUPPORTED_LOCALES.join("|")})$`);
const LOCALIZED_LEGACY_COUNTRY_PATTERN = new RegExp(
  `^\\/(${SUPPORTED_LOCALES.join("|")})\\/countries\\/(france|belgium)$`,
);

function shouldBypass(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const preferredLocale = resolvePreferredLocale(
    request.cookies.get(LOCALE_COOKIE_NAME)?.value,
    request.headers.get("accept-language"),
  );

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${preferredLocale}/home${search}`, request.url),
    );
  }

  const matchedLegacyPath = LEGACY_ROUTE_MAP[pathname];

  if (matchedLegacyPath) {
    return NextResponse.redirect(
      new URL(withLocale(preferredLocale, `${matchedLegacyPath}${search}`), request.url),
    );
  }

  const localizedLegacyCountryMatch = pathname.match(LOCALIZED_LEGACY_COUNTRY_PATTERN);

  if (localizedLegacyCountryMatch) {
    const [, locale, country] = localizedLegacyCountryMatch;
    return NextResponse.redirect(new URL(`/${locale}/${country}${search}`, request.url));
  }

  if (LOCALE_PATTERN.test(pathname)) {
    return NextResponse.redirect(new URL(`${pathname}/home${search}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
