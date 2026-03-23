import { notFound } from "next/navigation";
import { LanguageSelector } from "@/components/language/language-selector";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";

export default async function LanguagePage({
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
    <main className="page-shell">
      <section className="page-heading page-heading--stack">
        <div>
          <p className="page-kicker">ZoneVacances</p>
          <h1 className="page-title">{dictionary.languagePage.title}</h1>
        </div>

        <div className="page-copy page-copy--wide">
          <p>{dictionary.languagePage.subtitle}</p>
          <p>
            {dictionary.languagePage.current}: {locale.toUpperCase()}
          </p>
          <p>{dictionary.languagePage.auto}</p>
        </div>
      </section>

      <LanguageSelector
        currentLabel={dictionary.languagePage.current}
        currentLocale={locale}
      />
    </main>
  );
}
