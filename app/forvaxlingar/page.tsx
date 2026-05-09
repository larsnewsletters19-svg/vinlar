'use client';

import { useState } from 'react';
import confusions from '@/data/confusions.json';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';

const allConfusions = confusions;
const allGrapes = grapes as Grape[];

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-900/30 border-green-700/50 text-green-400',
  intermediate: 'bg-amber-900/30 border-amber-700/50 text-amber-400',
  advanced: 'bg-red-900/30 border-red-700/50 text-red-400',
};

const difficultyLabels: Record<string, string> = {
  beginner: '🟢 Nybörjare',
  intermediate: '🟡 Medel',
  advanced: '🔴 Avancerad',
};

export default function ForvaxlingarPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? allConfusions
    : allConfusions.filter((c) => c.difficulty === filter);

  const active = selected ? allConfusions.find((c) => c.id === selected) : null;

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Förväxlingsguide</h1>
      <p className="text-wine-300 mb-6 leading-relaxed">
        De vanligaste förväxlingarna i blindprovning — vad de har gemensamt och hur du skiljer dem åt.
      </p>

      {!active ? (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', 'beginner', 'intermediate', 'advanced'].map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  filter === d
                    ? 'bg-wine-600 border-wine-600 text-white'
                    : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
                }`}
              >
                {d === 'all' ? '🎯 Alla' : difficultyLabels[d]}
              </button>
            ))}
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((c) => {
              const grapeA = allGrapes.find((g) => g.id === c.grapeA);
              const grapeB = allGrapes.find((g) => g.id === c.grapeB);
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setSelected(c.id)}
                    className="w-full text-left p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[c.difficulty]}`}>
                        {difficultyLabels[c.difficulty]}
                      </span>
                    </div>
                    <div className="font-display text-lg text-wine-100 mb-1">{c.title}</div>
                    <div className="text-xs text-wine-500">
                      {grapeA?.type === 'white' ? '🥂' : '🍷'} {grapeA?.name} vs {grapeB?.type === 'white' ? '🥂' : '🍷'} {grapeB?.name}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div>
          <button onClick={() => setSelected(null)} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
            ← Alla förväxlingar
          </button>

          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-3xl text-wine-50">{active.title}</h2>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[active.difficulty]} mb-4 inline-block`}>
            {difficultyLabels[active.difficulty]}
          </span>
          <p className="text-wine-300 leading-relaxed mb-6 mt-2">{active.intro}</p>

          <div className="space-y-4">
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-green-500 mb-3">✓ Gemensamt</h3>
              <ul className="space-y-1.5">
                {active.inCommon.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-wine-300">
                    <span className="text-green-500">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                <h3 className="font-display text-lg text-amber-300 mb-3">{allGrapes.find((g) => g.id === active.grapeA)?.name}</h3>
                <ul className="space-y-1.5">
                  {active.grapeAClues.map((clue) => (
                    <li key={clue} className="flex items-start gap-2 text-sm text-wine-300">
                      <span className="text-amber-400 mt-0.5">→</span> {clue}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                <h3 className="font-display text-lg text-sky-300 mb-3">{allGrapes.find((g) => g.id === active.grapeB)?.name}</h3>
                <ul className="space-y-1.5">
                  {active.grapeBClues.map((clue) => (
                    <li key={clue} className="flex items-start gap-2 text-sm text-wine-300">
                      <span className="text-sky-400 mt-0.5">→</span> {clue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-amber-900/20 rounded-2xl p-5 border border-amber-800/40">
              <h3 className="text-xs uppercase tracking-widest text-amber-500 mb-2">⚠️ Vanlig fälla</h3>
              <p className="text-wine-200 text-sm leading-relaxed">{active.commonTrap}</p>
            </div>

            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-2">🔍 Nyckelskillnad</h3>
              <p className="text-wine-200 text-sm leading-relaxed">{active.keyDifference}</p>
            </div>

            <div className="bg-green-900/20 rounded-2xl p-5 border border-green-800/40">
              <h3 className="text-xs uppercase tracking-widest text-green-500 mb-2">💡 Snabbtips</h3>
              <p className="text-wine-100 text-sm leading-relaxed font-medium">{active.tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}