'use client';

import { useState } from 'react';
import servingData from '@/data/serving.json';

type ServingItem = typeof servingData[0];

const categories = [
  { id: 'all',      label: 'Alla',      emoji: '🍾' },
  { id: 'Vitt vin', label: 'Vitt',      emoji: '🥂' },
  { id: 'Rött vin', label: 'Rött',      emoji: '🍷' },
  { id: 'Rosé',     label: 'Rosé',      emoji: '🌹' },
  { id: 'Mousserande', label: 'Mousserande', emoji: '✨' },
  { id: 'Söta & förstärkta', label: 'Söta & förstärkta', emoji: '🍯' },
];

// ─── Termometer-visualisering ─────────────────────────────────────────────────
function TempBar({ min, max, ideal }: { min: number; max: number; ideal: number }) {
  const scale = { min: 5, max: 20 };
  const range = scale.max - scale.min;
  const leftPct  = ((min - scale.min) / range) * 100;
  const widthPct = ((max - min) / range) * 100;
  const idealPct = ((ideal - scale.min) / range) * 100;

  return (
    <div className="mt-3 mb-1">
      <div className="flex justify-between text-[9px] font-mono text-wine-600 mb-1">
        <span>{scale.min}°C</span>
        <span>{scale.max}°C</span>
      </div>
      <div className="relative h-3 bg-wine-900 rounded-full overflow-visible">
        {/* Zonen */}
        <div
          className="absolute top-0 h-full rounded-full bg-gradient-to-r from-sky-700 to-amber-700 opacity-60"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        {/* Ideal-markör */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-amber-400 shadow"
          style={{ left: `calc(${idealPct}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] font-mono text-wine-400">
        <span>{min}°C</span>
        <span className="text-amber-400 font-bold">Ideal: {ideal}°C</span>
        <span>{max}°C</span>
      </div>
    </div>
  );
}

// ─── Kort per stil ────────────────────────────────────────────────────────────
function ServingCard({ item }: { item: ServingItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-wine-900 border border-wine-800 rounded-2xl overflow-hidden transition-all"
    >
      {/* Header — alltid synlig */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 hover:bg-wine-800/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-0.5">
                {item.category}
              </div>
              <div className="font-display text-lg text-wine-100">{item.style}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-mono text-sm font-bold">{item.temperature.ideal}°C</div>
            <div className="text-wine-600 text-[10px] font-mono">{item.temperature.min}–{item.temperature.max}°C</div>
          </div>
        </div>

        {/* Exempel-chips */}
        <div className="flex flex-wrap gap-1 mt-2">
          {item.examples.map((ex) => (
            <span key={ex} className="text-[10px] px-2 py-0.5 rounded-full bg-wine-800 text-wine-400 font-mono">
              {ex}
            </span>
          ))}
        </div>
      </button>

      {/* Expanderat innehåll */}
      {open && (
        <div className="px-4 pb-4 border-t border-wine-800 pt-3 space-y-4">

          {/* Temperatur */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-1">Temperatur</div>
            <TempBar {...item.temperature} />
          </div>

          {/* Glas */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-1">Glasform</div>
            <div className="text-wine-200 text-sm font-medium">🍷 {item.glass}</div>
            <div className="text-wine-400 text-sm mt-0.5">{item.glassDesc}</div>
          </div>

          {/* Dekantring */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-1">Dekantring</div>
            {item.decant && item.decantTime ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">🫗</span>
                <div>
                  <div className="text-wine-200 text-sm font-medium">{item.decantTime} minuter</div>
                  <div className="text-wine-400 text-xs">Häll i karaff och låt andas</div>
                </div>
              </div>
            ) : (
              <div className="text-wine-400 text-sm">Ingen dekantring behövs</div>
            )}
          </div>

          {/* Lagring */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-1">Lagringstid</div>
            <div className="text-wine-300 text-sm">⏳ {item.storage}</div>
          </div>

          {/* Tips */}
          <div className="bg-wine-800/60 rounded-xl p-3 border border-wine-700">
            <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-1">💡 Tips</div>
            <p className="text-wine-300 text-sm leading-relaxed">{item.tips}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sida ─────────────────────────────────────────────────────────────────────
export default function ServeringPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = servingData.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-wine-500 mb-1">
          {servingData.length} stilar
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-wine-100 leading-tight mb-2">
          Servering & temperatur
        </h1>
        <p className="text-wine-300 text-sm leading-relaxed max-w-xl">
          Rätt temperatur, glasform och dekantring för varje vintyp. Klicka på en stil för detaljer.
        </p>
      </div>

      {/* Kategorifilter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeCategory === cat.id
                ? 'bg-wine-600 border-wine-600 text-white'
                : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Kort */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <ServingCard key={item.id} item={item} />
        ))}
      </div>

      <p className="text-[10px] text-wine-700 font-mono mt-8 border-t border-wine-900 pt-4">
        Temperaturer är riktlinjer. Rumstemperatur varierar — justera alltid efter faktisk omgivning.
      </p>
    </div>
  );
}
