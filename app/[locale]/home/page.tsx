import { notFound } from "next/navigation";
import { EuropeMap } from "@/components/home/europe-map";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <main className="page-shell home-view">
      <section className="home-stage">
        <div className="home-stage__copy">
          <p className="page-kicker">ZoneVacances</p>
          <h1 className="home-stage__title">{dictionary.home.title}</h1>
          <p className="home-stage__subtitle">{dictionary.home.subtitle}</p>
          <p className="home-stage__helper">{dictionary.home.helper}</p>
        </div>

        <EuropeMap ariaLabel={dictionary.home.mapAriaLabel} locale={locale} />
      </section>
    </main>
  );
}
