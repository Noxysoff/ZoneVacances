import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";

export default async function PolicyPage({
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
    <main className="page-shell legal-page">
      <section className="page-heading page-heading--stack legal-page__heading">
        <p className="page-kicker">ZoneVacances</p>
        <h1 className="page-title legal-page__title">{dictionary.policyPage.title}</h1>
        <p className="page-copy page-copy--wide legal-page__intro">
          {dictionary.policyPage.subtitle}
        </p>
      </section>

      <section className="legal-terms">
        <section className="legal-terms__section">
          <h2 className="legal-terms__title">{dictionary.policyPage.noCollectionTitle}</h2>
          <div className="legal-terms__body">
            <p className="legal-terms__text">{dictionary.policyPage.policyLead}</p>
            <p className="legal-terms__text">{dictionary.policyPage.noCollectionText}</p>
          </div>
        </section>

        <section className="legal-terms__section">
          <h2 className="legal-terms__title">{dictionary.policyPage.analyticsTitle}</h2>
          <div className="legal-terms__body">
            <p className="legal-terms__text">{dictionary.policyPage.analyticsText}</p>
            <p className="legal-terms__text">
              <a
                className="footer-link"
                href="https://vercel.com/docs/analytics"
                rel="noreferrer"
                target="_blank"
              >
                {dictionary.policyPage.analyticsLinkLabel}
              </a>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
