'use client';

import Link from 'next/link';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';

const allGrapes = grapes as Grape[];

// ─── Typkonfiguration (text, subtext, dot behålls) ───────────────────────────
const TYPE_CONFIG: Record<string, {
  label: string;
  symbol: string;
  text: string;
  subtext: string;
  dot: string;
  borderBase: string;
  // Bakgrundsfärger per body 1–5 (ljus → mörk inom typen)
  bgColors: string[];
  borderColors: string[];
}> = {
  white: {
    label: 'Vita druvor',
    symbol: 'V',
    text: 'text-amber-100',
    subtext: 'text-amber-400',
    dot: 'bg-amber-400',
    borderBase: 'border-amber-700/50',
    bgColors: [
      '#3d2e0a', // body 1 — ljusast
      '#4a3810',
      '#5a4415',
      '#6b521a',
      '#7d611f', // body 5 — mörkast
    ],
    borderColors: [
      '#92620033',
      '#a07a0055',
      '#b08a0077',
      '#c09a0099',
      '#d4aa00bb',
    ],
  },
  red: {
    label: 'Röda druvor',
    symbol: 'R',
    text: 'text-rose-100',
    subtext: 'text-rose-400',
    dot: 'bg-rose-400',
    borderBase: 'border-wine-600/50',
    bgColors: [
      '#2d0a0a', // body 1 — ljusast
      '#3d1010',
      '#501515',
      '#661a1a',
      '#7d1f1f', // body 5 — mörkast
    ],
    borderColors: [
      '#99000033',
      '#aa000055',
      '#bb000077',
      '#cc000099',
      '#dd1111bb',
    ],
  },
  rosé: {
    label: 'Rosé',
    symbol: 'Ro',
    text: 'text-pink-100',
    subtext: 'text-pink-400',
    dot: 'bg-pink-400',
    borderBase: 'border-pink-700/50',
    bgColors: [
      '#2d0a18',
      '#3d1022',
      '#501530',
      '#661a3d',
      '#7d1f4a',
    ],
    borderColors: [
      '#cc005533',
      '#cc006655',
      '#dd007777',
      '#dd008899',
      '#ee0099bb',
    ],
  },
  sparkling: {
    label: 'Mousserande',
    symbol: 'M',
    text: 'text-teal-100',
    subtext: 'text-teal-400',
    dot: 'bg-teal-400',
    borderBase: 'border-teal-700/50',
    bgColors: [
      '#041f1e',
      '#082d2b',
      '#0d3d3a',
      '#124e4a',
      '#175f5a',
    ],
    borderColors: [
      '#00887733',
      '#00998855',
      '#00aa9977',
      '#00bbaa99',
      '#00ccbbbb',
    ],
  },
  sweet: {
    label: 'Söta & förstärkta',
    symbol: 'S',
    text: 'text-yellow-100',
    subtext: 'text-yellow-500',
    dot: 'bg-yellow-400',
    borderBase: 'border-yellow-700/50',
    bgColors: [
      '#1f1700',
      '#2d2200',
      '#3d2e00',
      '#4e3b00',
      '#604800',
    ],
    borderColors: [
      '#88660033',
      '#99770055',
      '#aa880077',
      '#bb990099',
      '#ccaa00bb',
    ],
  },
};

const TYPE_ORDER = ['white', 'red', 'rosé', 'sparkling', 'sweet'];

const BODY_LABELS: Record<number, string> = {
  1: 'Lätt',
  2: 'Lätt–medel',
  3: 'Medel',
  4: 'Medel–fyllig',
  5: 'Fyllig',
};

const ABBREV: Record<string, string> = {
  'Melon de Bourgogne': 'Melon de Bourg.',
  'Sauvignon Blanc': 'Sauv. Blanc',
  'Grüner Veltliner': 'Gr. Veltliner',
  'Gewürztraminer': 'Gewürz.',
  'Cabernet Franc': 'Cab. Franc',
  'Cabernet Sauvignon': 'Cab. Sauv.',
  'Blaufränkisch': 'Blaufränk.',
  'Touriga Nacional': 'Touriga Nac.',
  'Pinot Meunier': 'P. Meunier',
  'Müller-Thurgau': 'Müller-T.',
  'Carignan / Cariñena': 'Carignan',
  'Mazuelo / Carignan': 'Mazuelo',
  'Viura / Macabeo': 'Viura',
  'Muscat / Moscato': 'Muscat',
};

function shortName(name: string): string {
  const base = name.split(' / ')[0].split(' (')[0];
  return ABBREV[name] ?? ABBREV[base] ?? base;
}

// ─── Druvecell ────────────────────────────────────────────────────────────────
function GrapeCell({ grape, index }: { grape: Grape; index: number }) {
  const cfg = TYPE_CONFIG[grape.type] ?? TYPE_CONFIG.white;
  const body = Math.max(1, Math.min(5, grape.structure?.body ?? 1));
  const acidity = grape.structure?.acidity ?? 0;
  const displayName = shortName(grape.name);

  const bgColor = cfg.bgColors[body - 1];
  const borderColor = cfg.borderColors[body - 1];

  return (
    <Link
      href={`/druvor/${grape.id}`}
      className="relative flex flex-col justify-between rounded-lg p-1.5 transition-all duration-150 active:scale-95 border"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
      title={grape.name}
    >
      {/* Serienummer */}
      <div className={`text-[9px] font-mono leading-none ${cfg.subtext}`}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Typ-symbol */}
      <div className={`absolute top-1 right-1.5 text-[8px] font-bold font-mono ${cfg.subtext} opacity-70`}>
        {cfg.symbol}
      </div>

      {/* Namn */}
      <div className={`font-display font-bold leading-tight text-xs ${cfg.text} mt-0.5`}>
        {displayName}
      </div>

      {/* Kropp-prickar */}
      <div className="flex gap-[2px] mt-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-[3px] h-[3px] rounded-full ${i <= body ? cfg.dot : 'bg-white/10'}`}
          />
        ))}
      </div>

      {/* Syra */}
      <div className={`text-[7px] font-mono ${cfg.subtext} mt-0.5`}>
        sy {acidity}/5
      </div>
    </Link>
  );
}

// ─── Typ-rad ──────────────────────────────────────────────────────────────────
function TypeRow({ type }: { type: string }) {
  const cfg = TYPE_CONFIG[type];
  const rowGrapes = allGrapes
    .filter((g) => g.type === type)
    .sort((a, b) => {
      const bodyDiff = (a.structure?.body ?? 0) - (b.structure?.body ?? 0);
      if (bodyDiff !== 0) return bodyDiff;
      return (b.structure?.acidity ?? 0) - (a.structure?.acidity ?? 0);
    });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        <span className={`text-xs font-mono uppercase tracking-widest ${cfg.subtext}`}>
          {cfg.label}
        </span>
        <span className={`text-xs font-mono ${cfg.subtext} opacity-50`}>
          — {rowGrapes.length} sorter
        </span>
      </div>

      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))' }}
      >
        {rowGrapes.map((grape, i) => (
          <GrapeCell key={grape.id} grape={grape} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="mb-8 p-4 rounded-xl bg-wine-900/50 border border-wine-800 text-xs text-wine-400">
      <div className="font-mono uppercase tracking-widest text-wine-500 mb-3 text-[10px]">Läs av en cell</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><div className="font-mono text-wine-300 mb-1">00</div><div>Löpnummer inom kategorin</div></div>
        <div><div className="font-mono text-wine-300 mb-1">•••••</div><div>Kropp (1 lätt → 5 fyllig)</div></div>
        <div><div className="font-mono text-wine-300 mb-1">sy 0/5</div><div>Syranivå</div></div>
        <div><div className="font-mono text-wine-300 mb-1">Ljus → Mörk</div><div>Lätt → Fyllig kropp</div></div>
      </div>
      <div className="mt-3 pt-3 border-t border-wine-800">
        Cellerna sorteras lätt → fyllig inom varje kategori. Mörkare cell = fylligare druva. Klicka för druvprofilen.
      </div>
    </div>
  );
}

// ─── Kropp-skala ──────────────────────────────────────────────────────────────
function BodyScale() {
  return (
    <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
      {[1, 2, 3, 4, 5].map((b) => (
        <div key={b} className="flex-1 min-w-[60px] text-center">
          <div className="h-1 rounded-full bg-gradient-to-r from-wine-800 to-wine-600 mb-1" />
          <div className="text-[9px] font-mono text-wine-500 uppercase tracking-wide">
            {BODY_LABELS[b]}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Sida ─────────────────────────────────────────────────────────────────────
export default function PeriodiskPage() {
  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-wine-500 mb-1">
          Alla {allGrapes.length} sorter
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-wine-100 leading-tight mb-2">
          Periodiska systemet
        </h1>
        <p className="text-wine-300 text-sm leading-relaxed max-w-xl">
          Alla druvor ordnade efter kategori och kropp. Ljusare cell = lättare druva, mörkare = fylligare.
          Klicka för att öppna profilen.
        </p>
      </div>

      <Legend />
      <BodyScale />

      {TYPE_ORDER.map((type) => (
        <TypeRow key={type} type={type} />
      ))}

      <p className="text-[10px] text-wine-700 font-mono mt-8 border-t border-wine-900 pt-4">
        Kropp och syranivå är relativa och stilberoende. Samma druva kan variera kraftigt
        beroende på klimat, vinifikation och årgång.
      </p>
    </div>
  );
}
