'use client';

import { useState } from 'react';
import learnData from '@/data/learnToTaste.json';
import { LearnItem } from '@/types';

const items = learnData as LearnItem[];

const sections = [
  {
    id: 'mouth',
    label: 'Känna i munnen',
    emoji: '👅',
    description: 'Syra, tannin, kropp och hur du känner igen dem.',
  },
  {
    id: 'winemaking',
    label: 'Vinmakning',
    emoji: '🍷',
    description: 'Terroir, ek, macerering och vad de gör med vinet.',
  },
  {
    id: 'technique',
    label: 'Provningsteknik',
    emoji: '🎓',
    description: 'Hur du provar, serverar och lagrar vin.',
  },
];

export default function LarDigPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('mouth');

  const activeItem = selected ? items.find((i) => i.id === selected) : null;
  const filteredItems = items.filter((i) => i.section === activeSection);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Lär dig känna</h1>
      <p className="text-wine-300 mb-6 leading-relaxed">
        Förstå hur vinets egenskaper faktiskt känns — inte bara i teorin.
      </p>

      {!activeItem ? (
        <>
          {/* Section tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => { setActiveSection(section.id); setSelected(null); }}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  activeSection === section.id
                    ? 'bg-wine-600 border-wine-600 text-white'
                    : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
                }`}
              >
                {section.emoji} {section.label}
              </button>
            ))}
          </div>

          <p className="text-wine-500 text-sm mb-6">
            {sections.find((s) => s.id === activeSection)?.description}
          </p>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => { setSelected(item.id); window.scrollTo(0, 0); }}
                  className="w-full text-left p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-display text-xl text-wine-100 mb-1">{item.name}</div>
                  <div className="text-sm text-wine-400 leading-snug">{item.shortDescription}</div>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <LearnDetail item={activeItem} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}

function LearnDetail({ item, onBack }: { item: LearnItem; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
        ← Tillbaka
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{item.icon}</span>
        <h2 className="font-display text-4xl text-wine-50">{item.name}</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
          <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-2">Vad är det?</h3>
          <p className="text-wine-200 text-sm leading-relaxed">{item.whatItIs}</p>
        </div>

        <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
          <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-2">Hur känns det?</h3>
          <p className="text-wine-200 text-sm leading-relaxed">{item.howItFeels}</p>
        </div>

        <div className="bg-amber-900/20 rounded-2xl p-5 border border-amber-800/40">
          <h3 className="text-xs uppercase tracking-widest text-amber-500 mb-2">🧪 Testa själv</h3>
          <p className="text-wine-200 text-sm leading-relaxed">{item.tryItYourself}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
            <h3 className="text-xs uppercase tracking-widest text-green-500 mb-3">Mycket av detta</h3>
            <ul className="space-y-1.5">
              {item.highExamples.map((ex) => (
                <li key={ex} className="flex items-center gap-2 text-sm text-wine-300">
                  <span className="text-green-500">▲</span> {ex}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
            <h3 className="text-xs uppercase tracking-widest text-sky-500 mb-3">Lite av detta</h3>
            <ul className="space-y-1.5">
              {item.lowExamples.map((ex) => (
                <li key={ex} className="flex items-center gap-2 text-sm text-wine-300">
                  <span className="text-sky-500">▼</span> {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
          <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-2">💡 Vanliga missförstånd</h3>
          <p className="text-wine-200 text-sm leading-relaxed">{item.commonMisconceptions}</p>
        </div>
      </div>
    </div>
  );
}