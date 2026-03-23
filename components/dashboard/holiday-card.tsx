import { CountdownGrid } from "@/components/dashboard/countdown-grid";
import type { PublicHolidayData } from "@/lib/types";

export function HolidayCard({
  holiday,
  onExpire,
}: {
  holiday: PublicHolidayData;
  onExpire?: () => void;
}) {
  return (
    <article className="holiday-card">
      <div className="card-layout">
        <div className="card-copy">
          <div className="card-topline">
            <div>
              <p className="card-eyebrow">Jour ferie</p>
              <h3 className="card-title">{holiday.name}</h3>
            </div>
            <span className="card-status">{holiday.statusLabel}</span>
          </div>

          <p className="card-date-label">{holiday.dateLabel}</p>
        </div>

        <CountdownGrid
          accentColor="#8f8f8f"
          label={holiday.countdownLabel}
          targetDateTime={holiday.targetDateTime}
          onExpire={onExpire}
        />
      </div>
    </article>
  );
}
