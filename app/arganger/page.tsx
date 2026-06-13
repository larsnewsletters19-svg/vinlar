'use client';

import { useState } from 'react';
import vintagesRaw from '@/data/vintages.json';

// ─── Typer ────────────────────────────────────────────────────────────────────
interface VintageYear {
  year: number;
  rating: number;
  character: string;
  highlights: string;
}

interface VintagesData {
  [region: string]: VintageYear[];
}

const vintages = vintagesRaw as VintagesData;

// ─── Regionkonfiguration ──────────────────────────────────────────────────────
const REGIONS: { id: string; name: string; land: string; flagga: string; druvor: string }[] = [
  { id: 'bordeaux',  name: 'Bordeaux',   land: 'Frankrike', flagga: '🇫🇷', druvor: 'Cab. Sauv. · Merlot' },
  { id: 'bourgogne', name: 'Bourgogne',  land: 'Frankrike', flagga: '🇫🇷', druvor: 'Pinot Noir · Chardonnay' },
  { id: 'champagne', name: 'Champagne',  land: 'Frankrike', flagga: '🇫🇷', druvor: 'Pinot Noir · Chardonnay' },
  { id: 'rhone',     name: 'Rhône',      land: 'Frankrike', flagga: '🇫🇷', druvor: 'Syrah · Grenache' },
  { id: 'barolo',    name: 'Barolo',     land: 'Italien',   flagga: '🇮🇹', druvor: 'Nebbiolo' },
  { id: 'toscana',   name: 'Toscana',    land: 'Italien',   flagga: '🇮🇹', druvor: 'Sangiovese' },
  { id: 'rioja',     name: 'Rioja',      land: 'Spanien',   flagga: '🇪🇸', druvor: 'Tempranillo' },
  { id: 'mosel',     name: 'Mosel',      land: 'Tyskland',  flagga: '🇩🇪', druvor: 'Riesling' },
  { id: 'douro',     name: 'Douro',      land: 'Portugal',  flagga: '🇵🇹', druvor: 'Touriga Nac. · Tinta Roriz' },
  { id: 'napa',      name: 'Napa Valley',land: 'USA',       flagga: '🇺🇸', druvor: 'Cabernet Sauvignon' },
  { id: 'barossa',   name: 'Barossa',    land: 'Australien',flagga: '🇦🇺', druvor: 'Shiraz · Grenache' },
  { id: 'mendoza',   name: 'Mendoza',    land: 'Argentina', flagga: '🇦🇷', druvor: 'Malbec' },
];

// ─── Färgkodning per betyg ────────────────────────────────────────────────────
function ratingColor(r: number): string {
  switch (r) {
    case 5: return 'bg-emerald-700 hover:bg-emerald-600 text-emerald-100';
    case 4: return 'bg-lime-800 hover:bg-lime-700 text-lime-100';
    case 3: return 'bg-yellow-800 hover:bg-yellow-700 text-yellow-100';
    case 2: return 'bg-orange-900 hover:bg-orange-800 text-orange-200';
    case 1: return 'bg-red-950 hover:bg-red-900 text-red-300';
    default: return 'bg-wine-900 text-wine-500';
  }
}

function ratingLabel(r: number): string {
  switch (r) {
    case 5: return 'Exceptionell';
    case 4: return 'Mycket bra';
    case 3: return 'Bra';
    case 2: return 'Medioker';
    case 1: return 'Svag';
    default: return '—';
  }
}

function ratingStars(r: number): string {
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

// ─── Popup ────────────────────────────────────────────────────────────────────
interface PopupInfo {
  region: typeof REGIONS[0];
  vintage: VintageYear;
}

function VintagePopup({ info, onClose }: { info: PopupInfo; onClose: () => void }) {
  const { region, vintage } = info;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-wine-950 border border-wine-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-wine-400 text-xs font-mono uppercase tracking-widest mb-1">
              {region.flagga} {region.name}
            </div>
            <div className="text-wine-100 text-3xl font-display font-bold">{vintage.year}</div>
            <div className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-mono ${ratingColor(vintage.rating)}`}>
              {ratingStars(vintage.rating)} {ratingLabel(vintage.rating)}
            </div>
          </div>
          <button onClick={onClose} className="text-wine-500 hover:text-wine-300 text-2xl leading-none">×</button>
        </div>

        {/* Karaktär */}
        <p className="text-wine-200 text-sm leading-relaxed mb-3">{vintage.character}</p>

        {/* Tips */}
        <div className="bg-wine-900/60 rounded-xl p-3 border border-wine-800">
          <div className="text-wine-500 text-[10px] font-mono uppercase tracking-widest mb-1">Tips</div>
          <p className="text-wine-300 text-sm">{vintage.highlights}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Huvud ────────────────────────────────────────────────────────────────────
export default function ArgangerPage() {
  const [selected, setSelected] = useState<PopupInfo | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Hämta alla år (sorterade nyast först)
  const years = vintages['bordeaux'].map((v) => v.year).sort((a, b) => b - a);

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-wine-500 mb-1">
          12 regioner · {years.length} årgångar
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-wine-100 leading-tight mb-2">
          Årgångsguide
        </h1>
        <p className="text-wine-300 text-sm leading-relaxed max-w-xl">
          Färgkodat rutnät över de viktigaste årgångarna per region. Klicka på en ruta för karaktär och köptips.
        </p>
      </div>

      {/* Förklaring + filter */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {[5, 4, 3, 2].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRating(filterRating === r ? null : r)}
            className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
              filterRating === r
                ? ratingColor(r) + ' border-transparent'
                : 'bg-transparent border-wine-800 text-wine-400 hover:border-wine-600'
            }`}
          >
            {'★'.repeat(r)} {ratingLabel(r)}
          </button>
        ))}
        {filterRating && (
          <button
            onClick={() => setFilterRating(null)}
            className="text-xs text-wine-600 hover:text-wine-400 font-mono"
          >
            Rensa filter ×
          </button>
        )}
      </div>

      {/* Rutnät */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full border-collapse" style={{ minWidth: '600px' }}>
          {/* År-header */}
          <thead>
            <tr>
              <th className="text-left pb-2 pr-3 text-wine-500 text-[10px] font-mono uppercase tracking-widest w-36">
                Region
              </th>
              {years.map((y) => (
                <th key={y} className="pb-2 text-center text-[10px] font-mono text-wine-500 px-0.5">
                  {y}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {REGIONS.map((region) => {
              const data = vintages[region.id];
              const yearMap = Object.fromEntries(data.map((v) => [v.year, v]));

              return (
                <tr key={region.id} className="group">
                  {/* Region-label */}
                  <td className="pr-3 py-1">
                    <div className="text-wine-200 text-xs font-medium whitespace-nowrap">
                      {region.flagga} {region.name}
                    </div>
                    <div className="text-wine-600 text-[9px] font-mono">{region.druvor}</div>
                  </td>

                  {/* Celler */}
                  {years.map((y) => {
                    const v = yearMap[y];
                    if (!v) return <td key={y} className="px-0.5 py-1"><div className="w-8 h-8 rounded bg-wine-900/30" /></td>;

                    const dimmed = filterRating !== null && v.rating !== filterRating;

                    return (
                      <td key={y} className="px-0.5 py-1">
                        <button
                          onClick={() => setSelected({ region, vintage: v })}
                          className={`
                            w-8 h-8 rounded text-[10px] font-mono font-bold
                            transition-all duration-100 active:scale-90
                            ${ratingColor(v.rating)}
                            ${dimmed ? 'opacity-15' : 'opacity-100'}
                          `}
                          title={`${region.name} ${y} — ${ratingLabel(v.rating)}`}
                        >
                          {v.rating}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Färgförklaring */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[5, 4, 3, 2, 1].map((r) => (
          <div key={r} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono ${ratingColor(r)}`}>
            <span className="font-bold">{r}</span>
            <span>{ratingLabel(r)}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-wine-700 font-mono mt-6 border-t border-wine-900 pt-4">
        Betyg baseras på generell konsensus. Enskilda producenter kan avvika kraftigt. Klicka en ruta för detaljer.
      </p>

      {/* Popup */}
      {selected && <VintagePopup info={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
