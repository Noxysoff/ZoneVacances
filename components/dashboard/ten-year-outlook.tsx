import type { TenYearVacationData } from "@/lib/types";

export function TenYearOutlook({
  data,
  error,
  isLoading,
  onRetry,
}: {
  data: TenYearVacationData | null;
  error: string | null;
  isLoading: boolean;
  onRetry?: () => void;
}) {
  return (
    <>
      {isLoading ? (
        <div className="empty-state">Chargement des vacances sur 10 ans...</div>
      ) : error ? (
        <div className="empty-state ten-year-empty">
          <p>{error}</p>
          {onRetry ? (
            <button className="inline-action" onClick={onRetry} type="button">
              Reessayer
            </button>
          ) : null}
        </div>
      ) : data ? (
        <>
          {data.warnings.length > 0 ? (
            <div className="feedback-banner feedback-banner--warning">
              {data.warnings.join(" ")}
            </div>
          ) : null}

          <div className="ten-year-grid">
            {data.years.map((year) => (
              <article className="ten-year-card" key={year.year}>
                <div className="ten-year-card-header">
                  <p className="card-eyebrow">Annee</p>
                  <h3 className="card-title">{year.year}</h3>
                </div>

                <div className="ten-year-zones">
                  {year.zones.map((zone) => (
                    <section className="ten-year-zone" key={`${year.year}-${zone.zone}`}>
                      <p className="ten-year-zone-title">{zone.label}</p>
                      {zone.periods.length > 0 ? (
                        <ul className="ten-year-list">
                          {zone.periods.map((period) => (
                            <li className="ten-year-item" key={period.id}>
                              <span className="ten-year-item-name">{period.name}</span>
                              <span className="ten-year-item-date">{period.dateLabel}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="ten-year-empty-label">Aucune periode retournee.</p>
                      )}
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">Aucune donnee chargee pour la vue 10 ans.</div>
      )}
    </>
  );
}
