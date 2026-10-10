'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import coords from '@/data/regionCoords.json';
import TerroirInfo from '@/components/TerroirInfo';
import type { MapFocus } from '@/lib/mapLookup';

type Region = {
  id: string;
  name: string;
  country: string;
  countryId: string;
  emoji: string;
  shortDescription: string;
  mainGrapes: string[];
  subRegions: string[];
  parentRegionId?: string;
};

type Coord = { lat: number; lng: number; zoom: number };
type SubPoint = { name: string; lat: number; lng: number; note?: string; grapes?: string[] };

const regionCoords = coords.regions as Record<string, Coord>;
const subPoints = coords.subRegionPoints as Record<string, SubPoint[]>;

const COUNTRY_COLORS: Record<string, string> = {
  france: '#3b82f6',
  italy: '#22c55e',
  spain: '#ef4444',
  germany: '#eab308',
  austria: '#f97316',
  portugal: '#a855f7',
  hungary: '#84cc16',
  greece: '#0ea5e9',
  georgia: '#e11d48',
  newworld: '#06b6d4',
};

// Flyger till vald region/punkt, annars zoomar ut så alla markörer syns
function MapController({
  focus,
  bounds,
}: {
  focus: { lat: number; lng: number; zoom: number } | null;
  bounds: LatLngBoundsExpression | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (focus) {
      map.flyTo([focus.lat, focus.lng], focus.zoom, { duration: 1.2 });
    } else if (bounds) {
      map.flyToBounds(bounds, { padding: [30, 30], maxZoom: 7, duration: 1 });
    }
  }, [focus, bounds, map]);
  return null;
}

function GrapeChips({ grapes }: { grapes: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {grapes.map((g) => (
        <span key={g} className="text-xs px-2 py-1 rounded-full bg-wine-800 text-wine-200 border border-wine-700">
          🍇 {g}
        </span>
      ))}
    </div>
  );
}

export default function RegionMap({
  regions,
  onOpenRegion,
  focusRequest = null,
}: {
  regions: Region[];
  onOpenRegion: (id: string) => void;
  focusRequest?: MapFocus | null;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<SubPoint | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // När landfiltret byts eller någon ber kartan visa en plats:
  // välj den platsen om den finns i listan, annars nollställ
  useEffect(() => {
    if (focusRequest && regionCoords[focusRequest.regionId] && regions.some((r) => r.id === focusRequest.regionId)) {
      const point = focusRequest.pointName
        ? (subPoints[focusRequest.regionId] ?? []).find((p) => p.name === focusRequest.pointName) ?? null
        : null;
      setSelectedId(focusRequest.regionId);
      setSelectedPoint(point);
      setPanelOpen(true);
    } else {
      setSelectedId(null);
      setSelectedPoint(null);
      setPanelOpen(false);
    }
  }, [regions, focusRequest]);

  const withCoords = regions.filter((r) => regionCoords[r.id]);
  const topLevel = withCoords.filter((r) => !r.parentRegionId);
  const selected = withCoords.find((r) => r.id === selectedId) ?? null;

  const focusParentId = selected ? selected.parentRegionId ?? selected.id : null;
  const focusParent = withCoords.find((r) => r.id === focusParentId) ?? null;
  const childRegions = withCoords.filter((r) => focusParentId && r.parentRegionId === focusParentId);

  // Underregioner utan egen profil (namnprickar)
  const extraPoints = useMemo(() => {
    if (!focusParentId) return [];
    const ids = [focusParentId, ...childRegions.map((c) => c.id)];
    const childNames = new Set(childRegions.map((c) => c.name));
    return ids.flatMap((id) => subPoints[id] ?? []).filter((p) => !childNames.has(p.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusParentId, regions]);

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (topLevel.length === 0) return null;
    return topLevel.map((r) => [regionCoords[r.id].lat, regionCoords[r.id].lng] as [number, number]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regions]);

  // Vald namnprick: zooma in ett steg till på just den. Annars: vald region.
  const focus = useMemo(() => {
    if (!selected) return null;
    const rc = regionCoords[selected.id];
    if (selectedPoint) return { lat: selectedPoint.lat, lng: selectedPoint.lng, zoom: Math.max(rc.zoom, 10) + 1 };
    return rc;
  }, [selected, selectedPoint]);

  const selectRegion = (id: string) => {
    setSelectedId(id);
    setSelectedPoint(null);
    setPanelOpen(true);
  };

  const selectPoint = (p: SubPoint) => {
    setSelectedPoint(p);
    setPanelOpen(true);
  };

  const zoomOut = () => {
    setSelectedPoint(null);
    if (selected?.parentRegionId) {
      setSelectedId(selected.parentRegionId);
    } else {
      setSelectedId(null);
      setPanelOpen(false);
    }
  };

  // Vilken region "äger" den valda namnpricken (för rubrik och knapp)
  const pointOwner = selectedPoint ? focusParent ?? selected : null;

  return (
    <div id="region-map" className="mb-6 bg-wine-900 rounded-2xl border border-wine-800 overflow-hidden scroll-mt-4">
      <div className="relative h-[60vh] min-h-[380px] sm:h-[520px] z-0">
        <MapContainer center={[45, 5]} zoom={4} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController focus={focus} bounds={bounds} />

          {/* Huvudregioner */}
          {topLevel.map((r) => {
            const c = regionCoords[r.id];
            const active = r.id === focusParentId;
            return (
              <CircleMarker
                key={r.id}
                center={[c.lat, c.lng]}
                radius={active ? 12 : 9}
                pathOptions={{
                  color: '#fff',
                  weight: 2,
                  fillColor: COUNTRY_COLORS[r.countryId] ?? '#7f1d1d',
                  fillOpacity: focusParentId && !active ? 0.4 : 0.9,
                }}
                eventHandlers={{ click: () => selectRegion(r.id) }}
              >
                <Tooltip direction="top" offset={[0, -8]}>{r.name}</Tooltip>
              </CircleMarker>
            );
          })}

          {/* Underregioner med egen profil */}
          {childRegions.map((r) => {
            const c = regionCoords[r.id];
            return (
              <CircleMarker
                key={r.id}
                center={[c.lat, c.lng]}
                radius={r.id === selectedId ? 10 : 8}
                pathOptions={{ color: '#fff', weight: 2, fillColor: '#be123c', fillOpacity: 0.95 }}
                eventHandlers={{ click: () => selectRegion(r.id) }}
              >
                <Tooltip permanent direction="right" offset={[8, 0]}>{r.name}</Tooltip>
              </CircleMarker>
            );
          })}

          {/* Underregioner utan egen profil */}
          {extraPoints.map((p) => (
            <CircleMarker
              key={p.name}
              center={[p.lat, p.lng]}
              radius={selectedPoint?.name === p.name ? 8 : 6}
              pathOptions={{ color: '#be123c', weight: 2, fillColor: '#fff', fillOpacity: 1 }}
              eventHandlers={{ click: () => selectPoint(p) }}
            >
              <Tooltip permanent direction="right" offset={[6, 0]}>{p.name}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        {selected && (
          <button
            onClick={zoomOut}
            className="absolute top-3 right-3 z-[1000] bg-wine-900/90 text-wine-100 text-sm px-3 py-1.5 rounded-lg border border-wine-700 hover:bg-wine-800"
          >
            ← Zooma ut
          </button>
        )}

        {/* Infokort ovanpå kartan */}
        {panelOpen && (selected || selectedPoint) && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-96 z-[1000] max-h-[55%] overflow-y-auto bg-wine-950/95 backdrop-blur rounded-2xl border border-wine-700 p-4 shadow-xl">
            <button
              onClick={() => setPanelOpen(false)}
              aria-label="Stäng"
              className="absolute top-2 right-3 text-wine-400 hover:text-wine-100 text-lg"
            >
              ×
            </button>

            {selectedPoint ? (
              <div>
                <div className="font-display text-lg text-wine-50 pr-6">{selectedPoint.name}</div>
                {pointOwner && (
                  <div className="text-xs text-wine-500 mb-2">
                    Del av {pointOwner.name} · {pointOwner.country}
                  </div>
                )}
                {selectedPoint.note && (
                  <p className="text-sm text-wine-300 leading-snug mb-3">{selectedPoint.note}</p>
                )}
                {selectedPoint.grapes && <GrapeChips grapes={selectedPoint.grapes} />}
                {pointOwner && (
                  <button
                    onClick={() => onOpenRegion(pointOwner.id)}
                    className="w-full py-2 rounded-xl bg-wine-700 hover:bg-wine-600 text-white text-sm"
                  >
                    Läs om {pointOwner.name} →
                  </button>
                )}
              </div>
            ) : selected ? (
              <div>
                <div className="flex items-center gap-2 mb-0.5 pr-6">
                  <span>{selected.emoji}</span>
                  <div className="font-display text-lg text-wine-50">{selected.name}</div>
                </div>
                <div className="text-xs text-wine-500 mb-2">
                  {selected.country}
                  {focusParent && focusParent.id !== selected.id && ` · del av ${focusParent.name}`}
                </div>
                <p className="text-sm text-wine-300 leading-snug mb-3">{selected.shortDescription}</p>
                <GrapeChips grapes={selected.mainGrapes} />
                <TerroirInfo id={selected.id} compact />
                {(childRegions.length > 0 || extraPoints.length > 0) && selected.id === focusParentId && (
                  <p className="text-xs text-wine-400 mb-3">Tryck på prickarna på kartan för att läsa om underregionerna.</p>
                )}
                <button
                  onClick={() => onOpenRegion(selected.id)}
                  className="w-full py-2 rounded-xl bg-wine-600 hover:bg-wine-500 text-white text-sm font-medium"
                >
                  Läs mer om {selected.name} →
                </button>
              </div>
            ) : null}
          </div>
        )}

        {!selected && (
          <div className="absolute bottom-3 left-3 z-[1000] bg-wine-950/90 text-wine-300 text-xs px-3 py-2 rounded-lg border border-wine-800">
            Tryck på en prick för att se regionen
          </div>
        )}
      </div>
    </div>
  );
}
