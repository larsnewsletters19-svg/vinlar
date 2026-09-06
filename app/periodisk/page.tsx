'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';

const allGrapes = grapes as Grape[];

// ─── Logg-helpers ─────────────────────────────────────────────────────────────
function loadLogCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('vinlar_logg');
    if (!raw) return {};
    const logs: { grapeId: string }[] = JSON.parse(raw);
    return logs.reduce((acc, l) => {
      acc[l.grapeId] = (acc[l.grapeId] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  } catch { return {}; }
}

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
    text: 'text-amber-800',
    subtext: 'text-amber-600',
    dot: 'bg-amber-500',
    borderBase: 'border-amber-700/50',
    bgColors: [
      '#f5deA0', // body 1 — ljusast
      '#e8c470',
      '#d4a63f',
      '#b8862a',
      '#8a5f1a', // body 5 — mörkast
    ],
    borderColors: [
      '#d4aa0044',
      '#c09a0066',
      '#b08a0088',
      '#a07a00aa',
      '#8f6a00cc',
    ],
  },
  red: {
    label: 'Röda druvor',
    symbol: 'R',
    text: 'text-rose-800',
    subtext: 'text-rose-600',
    dot: 'bg-rose-500',
    borderBase: 'border-wine-600/50',
    bgColors: [
      '#f2b8b8', // body 1 — ljusast
      '#dd8888',
      '#c25555',
      '#9c2f2f',
      '#6b1515', // body 5 — mörkast
    ],
    borderColors: [
      '#cc000033',
      '#cc000055',
      '#bb000077',
      '#99000099',
      '#770000cc',
    ],
  },
  rosé: {
    label: 'Rosé',
    symbol: 'Ro',
    text: 'text-pink-800',
    subtext: 'text-pink-600',
    dot: 'bg-pink-500',
    borderBase: 'border-pink-700/50',
    bgColors: [
      '#f5b8d8',
      '#e585b8',
      '#cc4d92',
      '#a52d70',
      '#74184e',
    ],
    borderColors: [
      '#cc005533',
      '#cc006655',
      '#bb005577',
      '#99004499',
      '#7700339c',
    ],
  },
  sparkling: {
    label: 'Mousserande',
    symbol: 'M',
    text: 'text-teal-800',
    subtext: 'text-teal-600',
    dot: 'bg-teal-500',
    borderBase: 'border-teal-700/50',
    bgColors: [
      '#a8e8e0',
      '#6fd0c4',
      '#3aada0',
      '#1f8378',
      '#0f5850',
    ],
    borderColors: [
      '#00887733',
      '#00998855',
      '#00887777',
      '#00776699',
      '#005550cc',
    ],
  },
  sweet: {
    label: 'Söta & förstärkta',
    symbol: 'S',
    text: 'text-yellow-800',
    subtext: 'text-yellow-600',
    dot: 'bg-yellow-500',
    borderBase: 'border-yellow-700/50',
    bgColors: [
      '#f5e08a',
      '#e0c14a',
      '#c49a28',
      '#a17318',
      '#6e4d0c',
    ],
    borderColors: [
      '#aa880033',
      '#99770055',
      '#88660077',
      '#77550099',
      '#5540009c',
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

// ─── Läsbarhetshjälp: mörk eller ljus text beroende på rutans egen bakgrund ────
function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ─── Druvecell ────────────────────────────────────────────────────────────────
function GrapeCell({ grape, index, logCount }: { grape: Grape; index: number; logCount: number }) {
  const cfg = TYPE_CONFIG[grape.type] ?? TYPE_CONFIG.white;
  const body = Math.max(1, Math.min(5, grape.structure?.body ?? 1));
  const acidity = grape.structure?.acidity ?? 0;
  const displayName = shortName(grape.name);

  const bgColor = cfg.bgColors[body - 1];
  const borderColor = cfg.borderColors[body - 1];

  // Ljusa rutor (body 1–2) får mörk text, mörka rutor (body 4–5) får ljus text —
  // så innehållet alltid går att läsa oavsett var i gradienten rutan hamnar.
  const isLight = relativeLuminance(bgColor) > 0.5;
  const textColor = isLight ? 'rgba(30,14,8,0.85)' : 'rgba(255,248,235,0.92)';
  const mutedColor = isLight ? 'rgba(30,14,8,0.55)' : 'rgba(255,248,235,0.6)';
  const dotOffColor = isLight ? 'rgba(30,14,8,0.15)' : 'rgba(255,255,255,0.15)';

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
      <div className="text-[9px] font-mono leading-none" style={{ color: mutedColor }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Typ-symbol */}
      <div className="absolute top-1 right-1.5 text-[8px] font-bold font-mono opacity-80" style={{ color: mutedColor }}>
        {cfg.symbol}
      </div>

      {/* Namn */}
      <div className="font-display font-bold leading-tight text-xs mt-0.5" style={{ color: textColor }}>
        {displayName}
      </div>

      {/* Kropp-prickar */}
      <div className="flex gap-[2px] mt-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-[3px] h-[3px] rounded-full ${i <= body ? cfg.dot : ''}`}
            style={i > body ? { backgroundColor: dotOffColor } : undefined}
          />
        ))}
      </div>

      {/* Syra */}
      <div className="text-[7px] font-mono mt-0.5" style={{ color: mutedColor }}>
        sy {acidity}/5
      </div>

      {/* Logg-badge */}
      {logCount > 0 && (
        <div
          className="absolute bottom-1 right-1.5 text-[8px] font-mono font-bold rounded px-0.5"
          style={{ color: textColor, backgroundColor: isLight ? 'rgba(30,14,8,0.1)' : 'rgba(255,255,255,0.15)' }}
        >
          {logCount}×
        </div>
      )}
    </Link>
  );
}

// ─── Typ-rad ──────────────────────────────────────────────────────────────────
function TypeRow({ type, sortBy, logCounts }: { type: string; sortBy: 'body' | 'logged'; logCounts: Record<string, number> }) {
  const cfg = TYPE_CONFIG[type];
  const rowGrapes = allGrapes
    .filter((g) => g.type === type)
    .sort((a, b) => {
      if (sortBy === 'logged') {
        const diff = (logCounts[b.id] ?? 0) - (logCounts[a.id] ?? 0);
        if (diff !== 0) return diff;
      }
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
          <GrapeCell key={grape.id} grape={grape} index={i} logCount={logCounts[grape.id] ?? 0} />
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
  const [sortBy, setSortBy] = useState<'body' | 'logged'>('body');
  const [logCounts, setLogCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setLogCounts(loadLogCounts());
  }, []);

  const totalLogged = Object.values(logCounts).reduce((s, n) => s + n, 0);

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

      {/* Sort toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSortBy('body')}
          className={`px-3 py-1.5 rounded-full text-sm font-mono border transition-all ${
            sortBy === 'body'
              ? 'bg-wine-600 border-wine-600 text-white'
              : 'bg-wine-900 border-wine-800 text-wine-500 hover:border-wine-600'
          }`}
        >
          Kropp
        </button>
        <button
          onClick={() => setSortBy('logged')}
          className={`px-3 py-1.5 rounded-full text-sm font-mono border transition-all ${
            sortBy === 'logged'
              ? 'bg-wine-600 border-wine-600 text-white'
              : 'bg-wine-900 border-wine-800 text-wine-500 hover:border-wine-600'
          }`}
        >
          📓 Mest provade {totalLogged > 0 && `(${totalLogged})`}
        </button>
      </div>

      {TYPE_ORDER.map((type) => (
        <TypeRow key={type} type={type} sortBy={sortBy} logCounts={logCounts} />
      ))}

      <p className="text-[10px] text-wine-700 font-mono mt-8 border-t border-wine-900 pt-4">
        Kropp och syranivå är relativa och stilberoende. Samma druva kan variera kraftigt
        beroende på klimat, vinifikation och årgång.
      </p>
    </div>
  );
}
