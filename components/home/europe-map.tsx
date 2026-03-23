"use client";

import worldMap from "@svg-maps/world";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { APP_COUNTRY_IDS, MAP_ID_TO_COUNTRY_SLUG, getCountryName } from "@/lib/countries";
import { computePathCollectionBounds } from "@/lib/svg-path";
import type { AppLocale } from "@/lib/types";

type MapLocation = {
  id: string;
  name: string;
  path: string;
};

type WorldMapDefinition = {
  locations: MapLocation[];
  viewBox: string;
};

const typedWorldMap = worldMap as WorldMapDefinition;
const mapLocations = typedWorldMap.locations.filter((location) =>
  APP_COUNTRY_IDS.has(location.id),
);
const mapBounds = computePathCollectionBounds(mapLocations.map((location) => location.path));
const mapPaddingX = mapBounds.width * 0.14;
const mapPaddingY = mapBounds.height * 0.22;
const mapViewBox = `${mapBounds.minX - mapPaddingX} ${mapBounds.minY - mapPaddingY} ${mapBounds.width + mapPaddingX * 2} ${mapBounds.height + mapPaddingY * 2}`;

export function EuropeMap({ locale }: { locale: AppLocale }) {
  const router = useRouter();
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);

  const sortedLocations = useMemo(() => {
    if (!activeCountryId) {
      return mapLocations;
    }

    return [...mapLocations].sort((first, second) => {
      if (first.id === activeCountryId) {
        return 1;
      }

      if (second.id === activeCountryId) {
        return -1;
      }

      return 0;
    });
  }, [activeCountryId]);

  return (
    <div className="europe-map-shell">
      <svg
        aria-label="Interactive map of Europe"
        className="europe-map"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={mapViewBox}
      >
        <rect
          className="europe-map__background"
          height={mapBounds.height + mapPaddingY * 2}
          width={mapBounds.width + mapPaddingX * 2}
          x={mapBounds.minX - mapPaddingX}
          y={mapBounds.minY - mapPaddingY}
        />

        {sortedLocations.map((country) => {
          const countrySlug = MAP_ID_TO_COUNTRY_SLUG[country.id];
          const isAvailable = Boolean(countrySlug);
          const isActive = activeCountryId === country.id;
          const label =
            countrySlug && isAvailable
              ? `${getCountryName(countrySlug, locale)}`
              : country.name;

          return (
            <path
              aria-disabled={isAvailable ? undefined : true}
              className={`europe-map__country${isActive ? " is-active" : ""}${
                isAvailable ? " is-available" : ""
              }`}
              d={country.path}
              key={country.id}
              onClick={() => {
                if (!countrySlug) {
                  return;
                }

                router.push(`/${locale}/countries/${countrySlug}` as Route);
              }}
              onKeyDown={(event) => {
                if (!countrySlug) {
                  return;
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/${locale}/countries/${countrySlug}` as Route);
                }
              }}
              onMouseEnter={() => {
                setActiveCountryId(country.id);
              }}
              onMouseLeave={() => {
                setActiveCountryId((current) => (current === country.id ? null : current));
              }}
              tabIndex={isAvailable ? 0 : -1}
            >
              <title>{label}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}
