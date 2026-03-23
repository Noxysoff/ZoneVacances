import { BelgiumSchoolMap } from "@/components/country/belgium-school-map";
import { CountryCountdownCard } from "@/components/country/country-countdown-card";
import { GenericCountryMap } from "@/components/country/generic-country-map";
import { FranceSchoolMap } from "@/components/dashboard/france-school-map";
import { getCountryDescription, getCountryName } from "@/lib/countries";
import { getDictionary } from "@/lib/i18n";
import type { AppLocale, CountryPageData, PublicHolidayData } from "@/lib/types";

function formatSyncTime(locale: AppLocale, isoString: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

function formatHolidaySubtitle(holiday: PublicHolidayData) {
  return holiday.description
    ? `${holiday.dateLabel}\n${holiday.description}`
    : holiday.dateLabel;
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
  const remainingTitle = locale === "fr" ? "Autres vacances" : dictionary.countryPage.remainingVacations;
  const map =
    isFrance ? (
      <FranceSchoolMap sticky={false} />
    ) : data.country.slug === "belgium" ? (
      <BelgiumSchoolMap sticky={false} />
    ) : (
      <GenericCountryMap
        countryCode={data.country.mapId}
        zoneColors={data.nextVacations.map((zone) => zone.color)}
      />
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
              <p className="page-kicker">{countryName}</p>
              <h2 className="data-section__title">{dictionary.countryPage.publicHolidays}</h2>
            </div>

            {data.publicHolidays.length > 0 ? (
              <div className="data-grid data-grid--france-secondary">
                {data.publicHolidays.map((holiday) => (
                  <CountryCountdownCard
                    accentColor="#71717a"
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
              <p className="page-kicker">{countryName}</p>
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
    <main className="page-shell country-page">
      {data.warnings.map((warning) => (
        <div className="warning-banner" key={warning}>
          {warning}
        </div>
      ))}

      <section className="country-page__layout">
        <header className="country-page__header">
          <p className="page-kicker">ZoneVacances</p>
          <h1 className="page-title">{countryName}</h1>
          <p className="country-page__intro">
            {getCountryDescription(data.country.slug, locale)}
          </p>
          <p className="page-meta">
            {dictionary.countryPage.updatedAt} {formatSyncTime(locale, data.generatedAt)}
          </p>
        </header>

        <aside className="country-page__map">{map}</aside>

        <div className="country-page__content">
          <section className="data-section">
            <div className="data-section__header">
              <p className="page-kicker">{countryName}</p>
              <h2 className="data-section__title">{dictionary.countryPage.nextVacations}</h2>
            </div>

            <div className="data-grid data-grid--primary">
              {data.nextVacations.map((zone) => (
                <CountryCountdownCard
                  accentColor={zone.color}
                  countdown={zone.nextHoliday}
                  eyebrow={zone.label}
                  key={zone.id}
                  locale={locale}
                  subtitle={zone.nextHoliday?.dateLabel}
                  title={zone.nextHoliday?.name ?? dictionary.common.noData}
                />
              ))}
            </div>
          </section>

          <section className="data-section">
            <div className="data-section__header">
              <p className="page-kicker">{countryName}</p>
              <h2 className="data-section__title">{dictionary.countryPage.publicHolidays}</h2>
            </div>

            {data.publicHolidays.length > 0 ? (
              <div className="data-grid">
                {data.publicHolidays.map((holiday) => (
                  <CountryCountdownCard
                    accentColor="#71717a"
                    countdown={holiday}
                    eyebrow={dictionary.common.holiday}
                    key={holiday.id}
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
              <p className="page-kicker">{countryName}</p>
              <h2 className="data-section__title">{dictionary.countryPage.remainingVacations}</h2>
            </div>

            {data.remainingVacations.length > 0 ? (
              <div className="data-grid">
                {data.remainingVacations.map((vacation) => (
                  <CountryCountdownCard
                    accentColor={vacation.color}
                    countdown={vacation}
                    eyebrow={vacation.zoneShortLabel}
                    key={vacation.id}
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
      </section>
    </main>
  );
}
