import { CountdownGrid } from "@/components/country/countdown-grid";
import type { AppLocale, CountdownItem } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";

export function CountryCountdownCard({
  accentColor,
  countdown,
  eyebrow,
  layout = "stacked",
  locale,
  subtitle,
  title,
}: {
  accentColor: string;
  countdown: CountdownItem | null;
  eyebrow: string;
  layout?: "inline" | "stacked";
  locale: AppLocale;
  subtitle?: string;
  title: string;
}) {
  const dictionary = getDictionary(locale);

  return (
    <article
      className={`data-card${layout === "inline" ? " data-card--inline" : ""}`}
      style={{ ["--card-accent" as string]: accentColor }}
    >
      {layout === "inline" ? (
        <div className="data-card__header data-card__header--inline">
          <div className="data-card__copy data-card__copy--inline">
            <p className="data-card__eyebrow">{eyebrow}</p>
            <h3 className="data-card__title">{title}</h3>
            {subtitle ? <p className="data-card__subtitle">{subtitle}</p> : null}
          </div>

          <span
            className="data-card__status data-card__status--inline"
            data-tone={countdown?.statusTone ?? "upcoming"}
          >
            {countdown?.statusLabel ?? dictionary.common.unavailable}
          </span>

          {countdown ? (
            <CountdownGrid
              accentColor={accentColor}
              compact
              label={countdown.countdownLabel}
              refreshOnExpire={countdown.statusTone !== "past"}
              targetDateTime={countdown.targetDateTime}
              unitLabels={{
                days: dictionary.countdown.days,
                hours: dictionary.countdown.hours,
                minutes: dictionary.countdown.minutes,
                seconds: dictionary.countdown.seconds,
              }}
            />
          ) : (
            <div className="data-card__empty">{dictionary.countryPage.noVacationData}</div>
          )}
        </div>
      ) : (
        <>
          <div className="data-card__header">
            <div className="data-card__copy">
              <p className="data-card__eyebrow">{eyebrow}</p>
              <h3 className="data-card__title">{title}</h3>
              {subtitle ? <p className="data-card__subtitle">{subtitle}</p> : null}
            </div>
            <span
              className="data-card__status"
              data-tone={countdown?.statusTone ?? "upcoming"}
            >
              {countdown?.statusLabel ?? dictionary.common.unavailable}
            </span>
          </div>

          {countdown ? (
            <CountdownGrid
              accentColor={accentColor}
              label={countdown.countdownLabel}
              refreshOnExpire={countdown.statusTone !== "past"}
              targetDateTime={countdown.targetDateTime}
              unitLabels={{
                days: dictionary.countdown.days,
                hours: dictionary.countdown.hours,
                minutes: dictionary.countdown.minutes,
                seconds: dictionary.countdown.seconds,
              }}
            />
          ) : (
            <div className="data-card__empty">{dictionary.countryPage.noVacationData}</div>
          )}
        </>
      )}
    </article>
  );
}
