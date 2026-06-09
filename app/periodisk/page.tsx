'use client';

import Link from 'next/link';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';

const allGrapes = grapes as Grape[];

// ─── Typkonfiguration ────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, {
  label: string;
  symbol: string;
  bg: string;
  border: string;
  text: string;
  subtext: string;
  dot: string;
}> = {
  white: {
    label: 'Vita druvor',
    symbol: 'V',
    bg: 'bg-amber-950/40 hover:bg-amber-900/60',
    border: 'border-amber-700/50 hover:border-amber-500',
    text: 'text-amber-200',
    subtext: 'text-amber-500',
    dot: 'bg-amber-400',
  },
  red: {
    label: 'Röda druvor',
    symbol: 'R',
    bg: 'bg-wine-900/60 hover:bg-wine-800/80',
    border: 'border-wine-600/50 hover:border-wine-400',
    text: 'text-wine-100',
    subtext: 'text-wine-400',
    dot: 'bg-wine-400',
  },
  rosé: {
    label: 'Rosé',
    symbol: 'Ro',
    bg: 'bg-pink-950/40 hover:bg-pink-900/60',
    border: 'border-pink-700/50 hover:border-pink-500',
    text: 'text-pink-200',
    subtext: 'text-pink-500',
    dot: 'bg-pink-400',
  },
  sparkling: {
    label: 'Mousserande',
    symbol: 'M',
    bg: 'bg-teal-950/40 hover:bg-teal-900/60',
    border: 'border-teal-700/50 hover:border-teal-500',
    text: 'text-teal-200',
    subtext: 'text-teal-500',
    dot: 'bg-teal-400',
  },
  sweet: {
    label: 'Söta & förstärkta',
    symbol: 'S',
    bg: 'bg-yellow-950/40 hover:bg-yellow-900/60',
    border: 'border-yellow-700/50 hover:border-yellow-500',
    text: 'text-yellow-200',
    subtext: 'text-yellow-600',
    dot: 'bg-yellow-400',
  },
};

const TYPE_ORDER = ['white', 'red', 'rosé', 'sparkling', 'sweet'];

// ─── Kropp-etiketter ──────────────────────────────────────────────────────────
const BODY_LABELS: Record<number, string> = {
  1: 'Lätt',
  2: 'Lätt–medel',
  3: 'Medel',
  4: 'Medel–fyllig',
  5: 'Fyllig',
};

// ─── Förkortningstabell ───────────────────────────────────────────────────────
const ABBREV: Record<string, string> = {
  'Melon de Bourgogne': 'Melon de Bourg.',
  'Sauvignon Blanc': 'Sauv. Blanc',
  'Grüner Veltliner': 'Gr. Veltliner',
  'Gewürztraminer': 'Gewürz.',
  'Cabernet Franc': 'Cab. Franc',
  'Cabernet Sauvignon': 'Cab. Sauv.',
  'Blaufränkisch': 'Blaufränk.',
  'Touriga Nacional': 'Touriga Nac.',
};

function shortName(name: string): string {
  const base = name.split(' / ')[0].split(' (')[0];
  return ABBREV[base] ?? base;
}

// ─── Komponent: en druvecell ──────────────────────────────────────────────────
function GrapeCell({ grape, index }: { grape: Grape; index: number }) {
  const cfg = TYPE_CONFIG[grape.type] ?? TYPE_CONFIG.white;
  const body = grape.structure?.body ?? 0;
  const acidity = grape.structure?.acidity ?? 0;
  const displayName = shortName(grape.name);

  return (
    <Link
      href={`/druvor/${grape.id}`}
      className={`
        relative flex flex-col justify-between
        rounded-lg border p-1.5
        transition-all duration-150 active:scale-95
        
        ${cfg.bg} ${cfg.border}
      `}
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

      {/* Druvans namn — skalad text */}
      <div
        className={`font-display font-bold leading-tight text-xs ${cfg.text} mt-0.5`}
        
      >
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

// ─── Komponent: en typ-rad ────────────────────────────────────────────────────
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
        <div><div className="font-mono text-wine-300 mb-1">V / R / M…</div><div>Kategorisymbol</div></div>
      </div>
      <div className="mt-3 pt-3 border-t border-wine-800">
        Cellerna sorteras lätt → fyllig inom varje kategori. Klicka för att öppna druvprofilen.
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

// ─── Huvudsida ────────────────────────────────────────────────────────────────
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
          Alla druvor, appellationer och stilar i appen — ordnade efter kategori och kropp.
          Klicka på en cell för att öppna profilen.
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
