import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/navigation/auto-refresh";
import { LocaleHtmlUpdater } from "@/components/navigation/locale-html-updater";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { getSortedCountries } from "@/lib/countries";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import type { AppLocale } from "@/lib/types";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const countries = getSortedCountries(locale);

  return (
    <>
      <LocaleHtmlUpdater locale={locale as AppLocale} />
      <AutoRefresh />
      <SiteHeader
        countries={countries}
        labels={dictionary.nav}
        locale={locale as AppLocale}
        searchLabel={dictionary.common.search}
      />
      {children}
      <SiteFooter
        legalLabel={dictionary.common.allRightsReserved}
        sourcesLabel={dictionary.common.publicSources}
      />
    </>
  );
}
