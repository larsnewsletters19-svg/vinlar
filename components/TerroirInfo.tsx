import terroirData from '@/data/terroir.json';

export type Terroir = {
  altitude: [number, number];
  irrigation: string;
  warmth: 'svalt' | 'måttligt' | 'varmt' | 'hett';
  climateType: string;
  rainfallMm: [number, number];
  terrain: string;
  keyFactors: string[];
  whyItTastes: string;
};

const data = terroirData as Record<string, Terroir>;

export function getTerroir(id: string): Terroir | null {
  return data[id] ?? null;
}

const WARMTH_LABEL: Record<string, string> = {
  svalt: '❄️ Svalt',
  måttligt: '🌤️ Måttligt varmt',
  varmt: '☀️ Varmt',
  hett: '🔥 Hett',
};

function range([a, b]: [number, number], unit: string) {
  return a === b ? `${a} ${unit}` : `${a}–${b} ${unit}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-wine-900 text-wine-200 border border-wine-700 whitespace-nowrap">
      {children}
    </span>
  );
}

/**
 * Visar terroir för en region.
 * compact = bara ikoner och "varför smakar det så här" (för kartans infokort)
 */
export default function TerroirInfo({ id, compact = false }: { id: string; compact?: boolean }) {
  const t = getTerroir(id);
  if (!t) return null;

  return (
    <div className={compact ? 'mb-3' : 'mb-6'}>
      {!compact && <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-2">Terroir</h3>}

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge>⛰️ {range(t.altitude, 'm')}</Badge>
        <Badge>{WARMTH_LABEL[t.warmth] ?? t.warmth}</Badge>
        <Badge>💧 {capitalize(t.irrigation)}</Badge>
        <Badge>🌧️ {range(t.rainfallMm, 'mm/år')}</Badge>
        {!compact && <Badge>🌍 {t.climateType}</Badge>}
      </div>

      <div className="rounded-xl bg-wine-900/60 border border-wine-800 p-3 mb-3">
        <div className="text-xs font-medium text-amber-400 mb-1">🍷 Varför smakar det så här?</div>
        <p className="text-sm text-wine-200 leading-snug">{t.whyItTastes}</p>
      </div>

      {!compact && (
        <>
          <p className="text-sm text-wine-300 mb-2">
            <span className="text-wine-500">Landskap:</span> {t.terrain}
          </p>
          <ul className="space-y-1.5">
            {t.keyFactors.map((f) => (
              <li key={f} className="text-sm text-wine-300 flex gap-2">
                <span className="text-wine-500">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
