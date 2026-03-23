import { CountdownGrid } from "@/components/dashboard/countdown-grid";
import type { BelgiumCardData } from "@/lib/types";

export function BelgiumStrip({
  items,
  onExpire,
}: {
  items: BelgiumCardData[];
  onExpire?: () => void;
}) {
  return (
    <div className="belgium-row">
      {items.map((item) => (
        <article
          className="belgium-card"
          key={item.code}
          style={{ ["--zone-color" as string]: item.color }}
        >
          <div className="card-layout">
            <div className="card-copy">
              <div className="card-topline">
                <div>
                  <p className="card-eyebrow">{item.shortLabel}</p>
                  <h3 className="card-title">{item.nextHoliday?.name ?? "Aucune donnee"}</h3>
                </div>
                <span className="card-status">{item.nextHoliday?.statusLabel ?? "API"}</span>
              </div>

              <p className="card-date-label">
                {item.nextHoliday?.dateLabel ??
                  "Le flux OpenHolidays ne repond pas pour cette communaute."}
              </p>
            </div>

            {item.nextHoliday ? (
              <CountdownGrid
                accentColor={item.color}
                label={item.nextHoliday.countdownLabel}
                targetDateTime={item.nextHoliday.targetDateTime}
                onExpire={onExpire}
              />
            ) : (
              <div className="empty-state">Donnees indisponibles.</div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
