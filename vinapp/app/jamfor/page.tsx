'use client';

import { useState } from 'react';
import comparisons from '@/data/comparisons.json';
import grapes from '@/data/grapes.json';
import { Comparison, GrapeVsGrapeComparison, StyleVsStyleComparison, Grape } from '@/types';

const allComparisons = comparisons as Comparison[];
const allGrapes = grapes as Grape[];

export default function JamforPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const grapeVsGrape = allComparisons.filter((c) => c.type === 'grape_vs_grape') as GrapeVsGrapeComparison[];
  const styleVsStyle = allComparisons.filter((c) => c.type === 'style_vs_style') as StyleVsStyleComparison[];

  const activeComp = selected ? allComparisons.find((c) => c.id === selected) : null;

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Jämför</h1>
      <p className="text-wine-300 mb-8 leading-relaxed">
        Ställ druvor mot varandra eller jämför samma druva i olika stilar och regioner.
      </p>

      {!activeComp ? (
        <>
          <section className="mb-8">
            <h2 className="font-display text-2xl text-wine-200 mb-4">Druva mot druva</h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {grapeVsGrape.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelected(c.id)}
                    className="w-full text-left p-4 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                  >
                    <div className="font-display text-wine-100">{c.title}</div>
                    <div className="text-xs text-wine-500 mt-1">Druva vs druva</div>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-wine-200 mb-4">Stil & region</h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {styleVsStyle.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelected(c.id)}
                    className="w-full text-left p-4 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                  >
                    <div className="font-display text-wine-100">{c.title}</div>
                    <div className="text-xs text-wine-500 mt-1">Samma druva, olika stil</div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : activeComp.type === 'grape_vs_grape' ? (
        <GrapeVsGrapeView comp={activeComp as GrapeVsGrapeComparison} onBack={() => setSelected(null)} />
      ) : (
        <StyleVsStyleView comp={activeComp as StyleVsStyleComparison} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}

function GrapeVsGrapeView({ comp, onBack }: { comp: GrapeVsGrapeComparison; onBack: () => void }) {
  const grapeA = allGrapes.find((g) => g.id === comp.grapeA);
  const grapeB = allGrapes.find((g) => g.id === comp.grapeB);

  return (
    <div>
      <button onClick={onBack} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
        ← Alla jämförelser
      </button>
      <h2 className="font-display text-3xl text-wine-50 mb-6">{comp.title}</h2>

      <div className="mb-6 bg-wine-900 rounded-2xl p-5 border border-wine-800">
        <h3 className="font-display text-lg text-wine-200 mb-3">Gemensamt</h3>
        <ul className="space-y-1.5">
          {comp.inCommon.map((item) => (
            <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
              <span className="text-green-400 mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
        <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
          <h3 className="font-display text-lg text-amber-300 mb-3">{grapeA?.name ?? comp.grapeA}</h3>
          <ul className="space-y-1.5">
            {comp.grapeAStandsOut.map((item) => (
              <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
                <span className="text-amber-400 mt-0.5">→</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
          <h3 className="font-display text-lg text-sky-300 mb-3">{grapeB?.name ?? comp.grapeB}</h3>
          <ul className="space-y-1.5">
            {comp.grapeBStandsOut.map((item) => (
              <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
                <span className="text-sky-400 mt-0.5">→</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-700/40">
        <h3 className="font-display text-lg text-amber-300 mb-2">🔍 Blindprovningstips</h3>
        <p className="text-wine-200 text-sm leading-relaxed">{comp.blindTastingTip}</p>
      </div>
    </div>
  );
}

function StyleVsStyleView({ comp, onBack }: { comp: StyleVsStyleComparison; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
        ← Alla jämförelser
      </button>
      <h2 className="font-display text-3xl text-wine-50 mb-6">{comp.title}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
        <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
          <div className="text-xs text-wine-500 uppercase tracking-wide mb-1">{comp.styleA.region}</div>
          <h3 className="font-display text-lg text-amber-300 mb-3">{comp.styleA.name}</h3>
          <ul className="space-y-1.5">
            {comp.styleACharacter.map((item) => (
              <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
                <span className="text-amber-400 mt-0.5">→</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
          <div className="text-xs text-wine-500 uppercase tracking-wide mb-1">{comp.styleB.region}</div>
          <h3 className="font-display text-lg text-sky-300 mb-3">{comp.styleB.name}</h3>
          <ul className="space-y-1.5">
            {comp.styleBCharacter.map((item) => (
              <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
                <span className="text-sky-400 mt-0.5">→</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-700/40">
        <h3 className="font-display text-lg text-amber-300 mb-2">🔍 Blindprovningstips</h3>
        <p className="text-wine-200 text-sm leading-relaxed">{comp.blindTastingTip}</p>
      </div>
    </div>
  );
}
