'use client';

import { useState } from 'react';
import foodAndWine from '@/data/foodAndWine.json';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';
const allGrapes = grapes as Grape[];

const { interactions, tricks, foodCategories } = foodAndWine;

const sections = [
  { id: 'interactions', label: 'Mat påverkar vinet', emoji: '⚗️' },
  { id: 'tricks', label: 'Smarta knep', emoji: '💡' },
  { id: 'food', label: 'Välj maträtt', emoji: '🍽️' },
];

export default function MatOchVinPage() {
  const [activeSection, setActiveSection] = useState('interactions');
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTrick, setSelectedTrick] = useState<string | null>(null);

  const activeInteraction = selectedInteraction ? interactions.find((i) => i.id === selectedInteraction) : null;
  const activeCategory = selectedCategory ? foodCategories.find((c) => c.id === selectedCategory) : null;
  const activeTrick = selectedTrick ? tricks.find((t) => t.id === selectedTrick) : null;

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Mat & Vin</h1>
      <p className="text-wine-300 mb-6 leading-relaxed">
        Hur mat påverkar vinet — och smarta knep för att få dem att passa ihop.
      </p>

      {/* Section tabs */}
      <div className="flex gap-1 mb-8 bg-wine-900 p-1 rounded-xl border border-wine-800">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id);
              setSelectedInteraction(null);
              setSelectedCategory(null);
              setSelectedTrick(null);
            }}
            className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-wine-600 text-white'
                : 'text-wine-400 hover:text-wine-200'
            }`}
          >
            <span className="mr-1">{section.emoji}</span>
            <span className="hidden sm:inline">{section.label}</span>
            <span className="sm:hidden">{section.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Mat påverkar vinet */}
      {activeSection === 'interactions' && (
        <>
          {!activeInteraction ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {interactions.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setSelectedInteraction(item.id)}
                    className="w-full text-left p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="font-display text-lg text-wine-100 mb-1">{item.name}</div>
                    <div className="text-sm text-wine-400 leading-snug">{item.effect}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <button onClick={() => setSelectedInteraction(null)} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
                ← Tillbaka
              </button>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{activeInteraction.emoji}</span>
                <h2 className="font-display text-3xl text-wine-50">{activeInteraction.name}</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                  <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-2">Vad händer?</h3>
                  <p className="text-wine-200 text-sm leading-relaxed">{activeInteraction.whatHappens}</p>
                </div>
                <div className="bg-amber-900/20 rounded-2xl p-5 border border-amber-800/40">
                  <h3 className="text-xs uppercase tracking-widest text-amber-500 mb-2">💡 Tips</h3>
                  <p className="text-wine-200 text-sm leading-relaxed">{activeInteraction.tip}</p>
                </div>
                <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                  <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-2">🍷 Exempel</h3>
                  <p className="text-wine-300 text-sm leading-relaxed italic">{activeInteraction.example}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="bg-wine-900 rounded-2xl p-4 border border-wine-800">
                    <h3 className="text-xs uppercase tracking-widest text-green-500 mb-3">✓ Passar bra med</h3>
                    <ul className="space-y-1">
                      {activeInteraction.goodFor.map((item) => (
                        <li key={item} className="text-sm text-wine-300 flex items-center gap-2">
                          <span className="text-green-500">▲</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-wine-900 rounded-2xl p-4 border border-wine-800">
                    <h3 className="text-xs uppercase tracking-widest text-red-500 mb-3">✗ Undvik med</h3>
                    <ul className="space-y-1">
                      {activeInteraction.badFor.map((item) => (
                        <li key={item} className="text-sm text-wine-300 flex items-center gap-2">
                          <span className="text-red-500">▼</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Smarta knep */}
      {activeSection === 'tricks' && (
        <>
          {!activeTrick ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tricks.map((trick) => (
                <li key={trick.id}>
                  <button
                    onClick={() => setSelectedTrick(trick.id)}
                    className="w-full text-left p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                  >
                    <div className="text-3xl mb-2">{trick.emoji}</div>
                    <div className="font-display text-lg text-wine-100 mb-1">{trick.name}</div>
                    <div className="text-sm text-wine-400 leading-snug">{trick.description}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <button onClick={() => setSelectedTrick(null)} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
                ← Tillbaka
              </button>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{activeTrick.emoji}</span>
                <h2 className="font-display text-3xl text-wine-50">{activeTrick.name}</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                  <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-2">Hur gör man?</h3>
                  <p className="text-wine-200 text-sm leading-relaxed">{activeTrick.howTo}</p>
                </div>
                <div className="bg-amber-900/20 rounded-2xl p-5 border border-amber-800/40">
                  <h3 className="text-xs uppercase tracking-widest text-amber-500 mb-2">🍷 Fungerar för</h3>
                  <p className="text-wine-200 text-sm leading-relaxed">{activeTrick.worksFor}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Välj maträtt */}
      {activeSection === 'food' && (
        <>
          {!activeCategory ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {foodCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className="w-full text-left p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                  >
                    <div className="text-3xl mb-2">{cat.emoji}</div>
                    <div className="font-display text-lg text-wine-100 mb-1">{cat.name}</div>
                    <div className="text-sm text-wine-400 leading-snug">{cat.description}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <button onClick={() => setSelectedCategory(null)} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
                ← Tillbaka
              </button>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{activeCategory.emoji}</span>
                <h2 className="font-display text-3xl text-wine-50">{activeCategory.name}</h2>
              </div>
              <p className="text-wine-300 mb-6 text-sm">{activeCategory.description}</p>
              <div className="space-y-3">
                {activeCategory.recommendations.map((rec) => (
                  <div key={rec.food} className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                    <div className="font-display text-lg text-wine-100 mb-3">{rec.food}</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {rec.wines.map((wine) => {
                        const match = allGrapes.find((g) =>
                          g.name === wine ||
                          g.name.includes(wine) ||
                          wine.includes(g.name.split('/')[0].trim()) ||
                          g.aliases?.some((a) => a.toLowerCase() === wine.toLowerCase())
                        );
                        return match ? (
                          <a key={wine} href={`/druvor/${match.id}`} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-200 hover:border-wine-500 hover:text-wine-50 transition-colors">
                            {wine}
                          </a>
                        ) : (
                          <span key={wine} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-400">
                            {wine}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-wine-500 text-xs italic">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}