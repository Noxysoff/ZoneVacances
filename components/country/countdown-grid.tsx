"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type CountdownUnitLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const DEFAULT_UNIT_LABELS: CountdownUnitLabels = {
  days: "Jours",
  hours: "Heures",
  minutes: "Minutes",
  seconds: "Secondes",
};

function getCountdownParts(
  targetDateTime: string,
  unitLabels: CountdownUnitLabels,
) {
  const difference = Math.max(new Date(targetDateTime).getTime() - Date.now(), 0);
  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    isComplete: difference === 0,
    parts: [
      { label: unitLabels.days, value: String(days).padStart(2, "0") },
      { label: unitLabels.hours, value: String(hours).padStart(2, "0") },
      { label: unitLabels.minutes, value: String(minutes).padStart(2, "0") },
      { label: unitLabels.seconds, value: String(seconds).padStart(2, "0") },
    ],
  };
}

export function CountdownGrid({
  targetDateTime,
  label,
  accentColor,
  compact = false,
  onExpire,
  refreshOnExpire = true,
  unitLabels = DEFAULT_UNIT_LABELS,
}: {
  targetDateTime: string;
  label: string;
  accentColor: string;
  compact?: boolean;
  onExpire?: () => void;
  refreshOnExpire?: boolean;
  unitLabels?: CountdownUnitLabels;
}) {
  const router = useRouter();
  const unitLabelSignature = [
    unitLabels.days,
    unitLabels.hours,
    unitLabels.minutes,
    unitLabels.seconds,
  ].join("|");
  const [countdown, setCountdown] = useState(() =>
    getCountdownParts(targetDateTime, unitLabels),
  );
  const hasExpiredRef = useRef(false);

  const triggerExpire = useEffectEvent(() => {
    if (onExpire) {
      onExpire();
      return;
    }

    router.refresh();
  });
  const tick = useEffectEvent(() => {
    const nextCountdown = getCountdownParts(targetDateTime, unitLabels);
    setCountdown(nextCountdown);

    if (refreshOnExpire && nextCountdown.isComplete && !hasExpiredRef.current) {
      hasExpiredRef.current = true;
      triggerExpire();
    }
  });

  useEffect(() => {
    hasExpiredRef.current = false;

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetDateTime, unitLabelSignature]);

  return (
    <div
      className={`countdown-shell${compact ? " countdown-shell--compact" : ""}`}
      style={{ ["--accent-color" as string]: accentColor }}
    >
      <p className="countdown-label">{label}</p>
      <div className={`countdown-grid${compact ? " countdown-grid--compact" : ""}`}>
        {countdown.parts.map((part) => (
          <div
            className={`countdown-cell${compact ? " countdown-cell--compact" : ""}`}
            key={part.label}
          >
            <span className="countdown-value" suppressHydrationWarning>
              {part.value}
            </span>
            <span className="countdown-unit">{part.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
