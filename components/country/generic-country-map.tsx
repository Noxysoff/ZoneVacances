import worldMap from "@svg-maps/world";
import { computePathCollectionBounds } from "@/lib/svg-path";

type WorldMapLocation = {
  id: string;
  name: string;
  path: string;
};

type WorldMapDefinition = {
  locations: WorldMapLocation[];
  viewBox: string;
};

const typedWorldMap = worldMap as WorldMapDefinition;

function buildGradientStops(colors: string[]) {
  if (colors.length === 1) {
    return [
      { color: colors[0], offset: "0%" },
      { color: colors[0], offset: "100%" },
    ];
  }

  return colors.flatMap((color, index) => {
    const start = `${(index / colors.length) * 100}%`;
    const end = `${((index + 1) / colors.length) * 100}%`;

    return [
      { color, offset: start },
      { color, offset: end },
    ];
  });
}

export function GenericCountryMap({
  countryCode,
  zoneColors,
}: {
  countryCode: string;
  zoneColors: string[];
}) {
  const location = typedWorldMap.locations.find((item) => item.id === countryCode);

  if (!location) {
    return null;
  }

  const bounds = computePathCollectionBounds([location.path]);
  const paddingX = bounds.width * 0.12;
  const paddingY = bounds.height * 0.12;
  const viewBox = `${bounds.minX - paddingX} ${bounds.minY - paddingY} ${bounds.width + paddingX * 2} ${bounds.height + paddingY * 2}`;
  const gradientId = `country-map-gradient-${countryCode}`;
  const guideId = `country-map-guides-${countryCode}`;
  const stops = buildGradientStops(zoneColors.length > 0 ? zoneColors : ["rgba(255,255,255,0.08)"]);

  return (
    <div className="country-map-panel">
      <svg
        aria-label={location.name}
        className="generic-country-map"
        role="img"
        viewBox={viewBox}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            {stops.map((stop, index) => (
              <stop key={`${stop.offset}-${index}`} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>

          <clipPath id={guideId}>
            <path d={location.path} />
          </clipPath>
        </defs>

        <rect className="generic-country-map__background" height={bounds.height + paddingY * 2} width={bounds.width + paddingX * 2} x={bounds.minX - paddingX} y={bounds.minY - paddingY} />

        <path className="generic-country-map__fill" d={location.path} fill={`url(#${gradientId})`} />

        <g clipPath={`url(#${guideId})`}>
          <path
            className="generic-country-map__guide"
            d={`M ${bounds.minX - paddingX} ${bounds.minY + bounds.height * 0.32} L ${bounds.maxX + paddingX} ${bounds.minY + bounds.height * 0.42}`}
          />
          <path
            className="generic-country-map__guide"
            d={`M ${bounds.minX - paddingX} ${bounds.minY + bounds.height * 0.58} L ${bounds.maxX + paddingX} ${bounds.minY + bounds.height * 0.62}`}
          />
          <path
            className="generic-country-map__guide"
            d={`M ${bounds.minX + bounds.width * 0.28} ${bounds.minY - paddingY} L ${bounds.minX + bounds.width * 0.5} ${bounds.maxY + paddingY}`}
          />
        </g>

        <path className="generic-country-map__outline" d={location.path} />
      </svg>
    </div>
  );
}
