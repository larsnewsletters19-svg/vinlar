// Hjälpfunktioner för att hitta var en region eller underregion ligger på kartan.
// Ligger i en egen fil (inte i RegionMap.tsx) så att den kan användas överallt
// utan att Leaflet laddas på servern.
import coords from '@/data/regionCoords.json';

export type MapTarget = { regionId: string; pointName?: string };
export type MapFocus = MapTarget & { key: number };

const regionCoords = coords.regions as Record<string, unknown>;
const subPoints = coords.subRegionPoints as Record<string, { name: string }[]>;

// Gör sökning okänslig för versaler och accenter: "Penedes" hittar "Penedès"
const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/** Har regionen en plats på kartan? */
export function hasMapLocation(regionId: string) {
  return regionId in regionCoords;
}

/**
 * Hitta en region eller underregion på kartan utifrån namn.
 * Returnerar null om namnet inte finns på kartan.
 */
export function findMapTarget(
  name: string,
  regions: { id: string; name: string }[],
): MapTarget | null {
  const n = norm(name);

  const region = regions.find((r) => norm(r.name) === n && hasMapLocation(r.id));
  if (region) return { regionId: region.id };

  for (const [regionId, points] of Object.entries(subPoints)) {
    const p = points.find((pt) => norm(pt.name) === n);
    if (p) return { regionId, pointName: p.name };
  }
  return null;
}

/**
 * Alla platser på kartan som matchar en sökning (delsträng).
 * Används av sökfältet för att visa "Visa på karta".
 */
export function searchMapTargets(
  query: string,
  regions: { id: string; name: string; country: string }[],
): (MapTarget & { label: string; sublabel: string })[] {
  const q = norm(query);
  if (q.length < 2) return [];

  const results: (MapTarget & { label: string; sublabel: string })[] = [];

  for (const r of regions) {
    if (hasMapLocation(r.id) && norm(r.name).includes(q)) {
      results.push({ regionId: r.id, label: r.name, sublabel: r.country });
    }
  }

  for (const [regionId, points] of Object.entries(subPoints)) {
    const owner = regions.find((r) => r.id === regionId);
    for (const p of points) {
      if (norm(p.name).includes(q) && !results.some((x) => x.label === p.name)) {
        results.push({
          regionId,
          pointName: p.name,
          label: p.name,
          sublabel: owner ? `Del av ${owner.name}` : '',
        });
      }
    }
  }
  return results;
}
