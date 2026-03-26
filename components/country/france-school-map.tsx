import franceDepartmentsMap from "@svg-maps/france.departments";
import franceRegionsMap from "@svg-maps/france.regions";
import type { RegionTone } from "@/lib/types";

type FranceMapLocation = {
  id: string;
  name: string;
  path: string;
};

type FranceMapDefinition = {
  viewBox: string;
  locations: FranceMapLocation[];
};

const typedFranceRegionsMap = franceRegionsMap as FranceMapDefinition;
const typedFranceDepartmentsMap = franceDepartmentsMap as FranceMapDefinition;
const METROPOLITAN_DEPARTMENT_PATTERN = /^(?:0[1-9]|[1-8][0-9]|9[0-5]|2A|2B)$/;

const REGION_TONE_BY_MAP_ID: Record<string, RegionTone> = {
  ara: "A",
  bfc: "A",
  bre: "B",
  cor: "SPECIAL",
  cvl: "B",
  ges: "B",
  hdf: "B",
  idf: "C",
  naq: "A",
  nor: "B",
  occ: "C",
  pac: "B",
  pdl: "B",
};

const MAP_FILL_BY_TONE: Record<RegionTone, string> = {
  A: "rgba(239, 68, 68, 0.11)",
  B: "rgba(59, 130, 246, 0.12)",
  C: "rgba(245, 158, 11, 0.11)",
  SPECIAL: "rgba(125, 133, 151, 0.08)",
};

const metropolitanDepartments = typedFranceDepartmentsMap.locations.filter((department) =>
  METROPOLITAN_DEPARTMENT_PATTERN.test(department.id),
);

export function FranceSchoolMap({
  ariaLabel,
  sticky = true,
}: {
  ariaLabel: string;
  sticky?: boolean;
}) {
  return (
    <div className={`france-map-panel${sticky ? "" : " france-map-panel--static"}`}>
      <svg
        aria-label={ariaLabel}
        className="france-map"
        role="img"
        viewBox={typedFranceDepartmentsMap.viewBox}
      >
        <rect className="france-map__background" height="585" width="613" x="0" y="0" />

        {typedFranceRegionsMap.locations.map((region) => {
          const tone = REGION_TONE_BY_MAP_ID[region.id] ?? "SPECIAL";

          return (
            <path
              className="france-map__region-fill"
              d={region.path}
              fill={MAP_FILL_BY_TONE[tone]}
              key={region.id}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {metropolitanDepartments.map((department) => (
          <path
            className="france-map__department"
            d={department.path}
            fill="none"
            key={department.id}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {typedFranceRegionsMap.locations.map((region) => (
          <path
            className="france-map__region-outline"
            d={region.path}
            fill="none"
            key={`${region.id}-outline`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
