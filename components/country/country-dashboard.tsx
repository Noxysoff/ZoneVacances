import { BelgiumSchoolMap } from "@/components/country/belgium-school-map";
import { CountryCountdownCard } from "@/components/country/country-countdown-card";
import { FranceSchoolMap } from "@/components/country/france-school-map";
import { getCountryName } from "@/lib/countries";
import { getDictionary } from "@/lib/i18n";
import type { AppLocale, CountryPageData, PublicHolidayData } from "@/lib/types";

function formatHolidaySubtitle(holiday: PublicHolidayData) {
  return holiday.description
    ? `${holiday.dateLabel}\n${holiday.description}`
    : holiday.dateLabel;
}

function getPublicHolidayAccentColor(holiday: PublicHolidayData) {
  return holiday.statusTone === "current" ? "#22c55e" : "#71717a";
}

export function CountryDashboard({
  data,
  locale,
}: {
  data: CountryPageData;
  locale: AppLocale;
}) {
  const dictionary = getDictionary(locale);
  const countryName = getCountryName(data.country.slug, locale);
  const isFrance = data.country.slug === "france";
  const hasScrollableZones = !isFrance && data.nextVacations.length > 3;
  const remainingTitle = dictionary.countryPage.otherVacations;
  const map =
    isFrance ? (
      <FranceSchoolMap ariaLabel={dictionary.countryPage.franceMapLabel} sticky={false} />
    ) : (
      <BelgiumSchoolMap ariaLabel={dictionary.countryPage.belgiumMapLabel} sticky={false} />
    );

  if (isFrance) {
    return (
      <main className="page-shell country-page country-page--france">
        {data.warnings.map((warning) => (
          <div className="warning-banner" key={warning}>
            {warning}
          </div>
        ))}

        <section className="france-page-hero">
          <div className="france-page-hero__body">
            <header className="country-page__header france-page-hero__header">
              <p className="page-kicker">{countryName}</p>
              <h1 className="page-title">{dictionary.countryPage.nextVacations}</h1>
            </header>

            <section className="data-section france-page-hero__next">
              <div className="france-page-hero__next-grid">
                {data.nextVacations.map((zone) => (
                  <CountryCountdownCard
                    accentColor={zone.color}
                    countdown={zone.nextHoliday}
                    eyebrow={zone.label}
                    key={zone.id}
                    layout="inline"
                    locale={locale}
                    subtitle={zone.nextHoliday?.dateLabel}
                    title={zone.nextHoliday?.name ?? dictionary.common.noData}
                  />
                ))}
              </div>
            </section>

            <aside className="country-page__map france-page-hero__map">{map}</aside>
          </div>
        </section>

        <div className="country-page__content country-page__content--france">
          <section className="data-section">
            <div className="data-section__header">
              <h2 className="data-section__title">{dictionary.countryPage.publicHolidays}</h2>
            </div>

            {data.publicHolidays.length > 0 ? (
              <div className="data-grid data-grid--france-secondary">
                {data.publicHolidays.map((holiday) => (
                  <CountryCountdownCard
                    accentColor={getPublicHolidayAccentColor(holiday)}
                    countdown={holiday}
                    eyebrow={dictionary.common.holiday}
                    key={holiday.id}
                    layout="inline"
                    locale={locale}
                    subtitle={formatHolidaySubtitle(holiday)}
                    title={holiday.name}
                  />
                ))}
              </div>
            ) : (
              <div className="section-empty">{dictionary.countryPage.noPublicHolidays}</div>
            )}
          </section>

          <section className="data-section">
            <div className="data-section__header">
              <h2 className="data-section__title">{remainingTitle}</h2>
            </div>

            {data.remainingVacations.length > 0 ? (
              <div className="data-grid data-grid--france-secondary">
                {data.remainingVacations.map((vacation) => (
                  <CountryCountdownCard
                    accentColor={vacation.color}
                    countdown={vacation}
                    eyebrow={vacation.zoneShortLabel}
                    key={vacation.id}
                    layout="inline"
                    locale={locale}
                    subtitle={vacation.dateLabel}
                    title={vacation.name}
                  />
                ))}
              </div>
            ) : (
              <div className="section-empty">{dictionary.countryPage.noRemainingVacations}</div>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell country-page country-page--france">
      {data.warnings.map((warning) => (
        <div className="warning-banner" key={warning}>
          {warning}
        </div>
      ))}

      <section className="france-page-hero">
        <div
          className={`france-page-hero__body${
            hasScrollableZones ? " country-page__hero-body--scrollable" : ""
          }`}
        >
          {hasScrollableZones ? (
            <div className="country-page__hero-column">
              <header className="country-page__header france-page-hero__header">
                <p className="page-kicker">{countryName}</p>
                <h1 className="page-title">{dictionary.countryPage.nextVacations}</h1>
              </header>

              <section className="data-section france-page-hero__next country-page__zones-scroll">
                <div className="france-page-hero__next-grid">
                  {data.nextVacations.map((zone) => (
                    <CountryCountdownCard
                      accentColor={zone.color}
                      countdown={zone.nextHoliday}
                      eyebrow={zone.label}
                      key={zone.id}
                      layout="inline"
                      locale={locale}
                      subtitle={zone.nextHoliday?.dateLabel}
                      title={zone.nextHoliday?.name ?? dictionary.common.noData}
                    />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <>
              <header className="country-page__header france-page-hero__header">
                <p className="page-kicker">{countryName}</p>
                <h1 className="page-title">{dictionary.countryPage.nextVacations}</h1>
              </header>

              <section className="data-section france-page-hero__next">
                <div className="france-page-hero__next-grid">
                  {data.nextVacations.map((zone) => (
                    <CountryCountdownCard
                      accentColor={zone.color}
                      countdown={zone.nextHoliday}
                      eyebrow={zone.label}
                      key={zone.id}
                      layout="inline"
                      locale={locale}
                      subtitle={zone.nextHoliday?.dateLabel}
                      title={zone.nextHoliday?.name ?? dictionary.common.noData}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          <aside className="country-page__map france-page-hero__map">{map}</aside>
        </div>
      </section>

      <div className="country-page__content country-page__content--france">
        <section className="data-section">
          <div className="data-section__header">
            <h2 className="data-section__title">{dictionary.countryPage.publicHolidays}</h2>
          </div>

          {data.publicHolidays.length > 0 ? (
            <div className="data-grid data-grid--france-secondary">
              {data.publicHolidays.map((holiday) => (
                <CountryCountdownCard
                  accentColor={getPublicHolidayAccentColor(holiday)}
                  countdown={holiday}
                  eyebrow={dictionary.common.holiday}
                  key={holiday.id}
                  layout="inline"
                  locale={locale}
                  subtitle={formatHolidaySubtitle(holiday)}
                  title={holiday.name}
                />
              ))}
            </div>
          ) : (
            <div className="section-empty">{dictionary.countryPage.noPublicHolidays}</div>
          )}
        </section>

        <section className="data-section">
          <div className="data-section__header">
            <h2 className="data-section__title">{dictionary.countryPage.remainingVacations}</h2>
          </div>

          {data.remainingVacations.length > 0 ? (
            <div className="data-grid data-grid--france-secondary">
              {data.remainingVacations.map((vacation) => (
                <CountryCountdownCard
                  accentColor={vacation.color}
                  countdown={vacation}
                  eyebrow={vacation.zoneShortLabel}
                  key={vacation.id}
                  layout="inline"
                  locale={locale}
                  subtitle={vacation.dateLabel}
                  title={vacation.name}
                />
              ))}
            </div>
          ) : (
            <div className="section-empty">{dictionary.countryPage.noRemainingVacations}</div>
          )}
        </section>
      </div>
    </main>
  );
}
