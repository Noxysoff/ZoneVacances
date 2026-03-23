import { notFound } from "next/navigation";
import { CountryDashboard } from "@/components/country/country-dashboard";
import { COUNTRIES } from "@/lib/countries";
import { getCountryPageData } from "@/lib/dashboard-data";
import { isLocale } from "@/lib/locale";
import type { CountrySlug } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;

  if (!isLocale(locale) || !(country in COUNTRIES)) {
    notFound();
  }

  const data = await getCountryPageData(country as CountrySlug, locale);

  return <CountryDashboard data={data} locale={locale} />;
}
