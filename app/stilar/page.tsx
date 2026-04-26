'use client';

import { useState } from 'react';
import comparisons from '@/data/comparisons.json';
import { Comparison, StyleVsStyleComparison } from '@/types';

const allComparisons = comparisons as Comparison[];
const styleComparisons = allComparisons.filter((c) => c.type === 'style_vs_style') as StyleVsStyleComparison[];

const categories = [
  { id: 'white', label: '🥂 Vita', grapes: ['sauvignon_blanc', 'chardonnay', 'riesling', 'chenin_blanc', 'viognier', 'albarino', 'gruner_veltliner', 'semillon', 'pinot_gris', 'gewurztraminer'] },
  { id: 'red', label: '🍷 Röda', grapes: ['pinot_noir', 'syrah', 'cabernet_sauvignon', 'nebbiolo', 'sangiovese', 'tempranillo', 'grenache', 'merlot', 'malbec', 'gamay'] },
  { id: 'sparkling', label: '🍾 Mousserande', grapes: ['champagne'] },
];

export default function StilarPage() {
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = activeCategory === 'all'
    ? styleComparisons
    : styleComparisons.filter((c) => {
        const cat = categories.find((cat) => cat.id === activeCategory);
        return cat?.grapes.includes(c.grape);
      });

  const activeComp = activeStyle ? styleComparisons.find((c) => c.id === activeStyle) : null;

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Stilar & regioner</h1>
      <p className="text-wine-300 mb-6 leading-relaxed">
        Samma druva kan smaka helt olika beroende på var den odlas och hur vinet görs. Utforska skillnaderna.
      </p>

      {!activeComp ? (
        <>
          {/* Category filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === 'all'
                  ? 'bg-wine-600 border-wine-600 text-white'
                  : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
              }`}
            >
              Alla
            </button>
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
                {cat.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-wine-900 rounded-2xl p-8 border border-wine-800 text-center text-wine-400">
              Inga jämförelser i den här kategorin ännu — kommer snart!
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveStyle(c.id)}
                    className="w-full text-left p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                  >
                    <div className="font-display text-lg text-wine-100 mb-1">{c.title}</div>
                    <div className="text-xs text-wine-500">{c.styleA.region} vs {c.styleB.region}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div>
          <button onClick={() => setActiveStyle(null)} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
            ← Alla stilar
          </button>
          <h2 className="font-display text-3xl text-wine-50 mb-6">{activeComp.title}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <div className="text-xs text-wine-500 uppercase tracking-wide mb-1">{activeComp.styleA.region}</div>
              <h3 className="font-display text-xl text-amber-300 mb-4">{activeComp.styleA.name}</h3>
              <ul className="space-y-2">
                {activeComp.styleACharacter.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
                    <span className="text-amber-400 mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <div className="text-xs text-wine-500 uppercase tracking-wide mb-1">{activeComp.styleB.region}</div>
              <h3 className="font-display text-xl text-sky-300 mb-4">{activeComp.styleB.name}</h3>
              <ul className="space-y-2">
                {activeComp.styleBCharacter.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
                    <span className="text-sky-400 mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-700/40">
            <h3 className="font-display text-lg text-amber-300 mb-2">🔍 Blindprovningstips</h3>
            <p className="text-wine-200 text-sm leading-relaxed">{activeComp.blindTastingTip}</p>
          </div>
        </div>
      )}
    </div>
  );
}