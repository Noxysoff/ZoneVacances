import { CountdownGrid } from "@/components/dashboard/countdown-grid";
import type { ZoneCardData } from "@/lib/types";

export function ZoneCard({
  zone,
  onExpire,
}: {
  zone: ZoneCardData;
  onExpire?: () => void;
}) {
  return (
    <article
      className="zone-card"
      data-zone={zone.zone}
      style={{ ["--zone-color" as string]: zone.color }}
    >
      <div className="card-layout">
        <div className="card-copy">
          <div className="card-topline">
            <div>
              <p className="card-eyebrow">{zone.label}</p>
              <h3 className="card-title">{zone.nextHoliday?.name ?? "Aucune donnee"}</h3>
            </div>
            <span className="card-status">{zone.nextHoliday?.statusLabel ?? "API"}</span>
          </div>

          <p className="card-date-label">
            {zone.nextHoliday?.dateLabel ??
              "Les donnees vacances scolaires seront retablies des que l'API repondra."}
          </p>
        </div>

        {zone.nextHoliday ? (
          <CountdownGrid
            accentColor={zone.color}
            label={zone.nextHoliday.countdownLabel}
            targetDateTime={zone.nextHoliday.targetDateTime}
            onExpire={onExpire}
          />
        ) : (
          <div className="empty-state">Synchronisation temporairement indisponible.</div>
        )}
      </div>
    </article>
  );
}
