'use client';

import { useState } from 'react';
import comparisons from '@/data/comparisons.json';
import grapes from '@/data/grapes.json';
import { Comparison, StyleVsStyleComparison, Grape } from '@/types';

const allComparisons = comparisons as Comparison[];
const allGrapes = grapes as Grape[];
const typeOrder = ['white', 'red', 'rosé', 'sparkling', 'sweet'];

const sortedGrapes = [...allGrapes].sort((a, b) => {
  const typeA = typeOrder.indexOf(a.type);
  const typeB = typeOrder.indexOf(b.type);
  if (typeA !== typeB) return typeA - typeB;
  return a.name.localeCompare(b.name, 'sv');
});
const styleComparisons = allComparisons.filter((c) => c.type === 'style_vs_style') as StyleVsStyleComparison[];

const structureLabels: Record<string, string[]> = {
  acidity: ['Mycket låg', 'Låg', 'Medel', 'Hög', 'Mycket hög'],
  body: ['Mycket lätt', 'Lätt', 'Medel', 'Fyllig', 'Mycket fyllig'],
  alcohol: ['Mycket låg', 'Låg', 'Medel', 'Hög', 'Mycket hög'],
  tannin: ['Ingen', 'Lågt', 'Medel', 'Högt', 'Mycket högt'],
  sweetness: ['Torrt', 'Halvtorrt', 'Halvsött', 'Sött', 'Mycket sött'],
  oak: ['Minimal', 'Lite', 'Subtil', 'Tydlig', 'Dominant'],
};

const structureKeys = [
  { key: 'acidity' as const, label: 'Syra' },
  { key: 'body' as const, label: 'Kropp' },
  { key: 'alcohol' as const, label: 'Alkohol' },
  { key: 'tannin' as const, label: 'Tannin' },
  { key: 'sweetness' as const, label: 'Sötma' },
  { key: 'oak' as const, label: 'Ek' },
];

const COLOR_A = '#f59e0b';
const COLOR_B = '#38bdf8';

function getSharedAromas(a: Grape, b: Grape) {
  return Object.keys(a.aromaScores).filter(
    (id) => (a.aromaScores[id] ?? 0) >= 3 && (b.aromaScores[id] ?? 0) >= 3
  );
}

function getUniqueAromas(grape: Grape, other: Grape) {
  return Object.entries(grape.aromaScores)
    .filter(([id, score]) => score >= 3 && (other.aromaScores[id] ?? 0) < 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id);
}

const aromaNames: Record<string, { name: string; emoji: string }> = {
  lemon: { name: 'Citron', emoji: '🍋' }, lime: { name: 'Lime', emoji: '🟢' },
  grapefruit: { name: 'Grapefrukt', emoji: '🍊' }, green_apple: { name: 'Grönt äpple', emoji: '🍏' },
  pear: { name: 'Päron', emoji: '🍐' }, peach: { name: 'Persika', emoji: '🍑' },
  apricot: { name: 'Aprikos', emoji: '🟠' }, passion_fruit: { name: 'Passionsfrukt', emoji: '🌺' },
  raspberry: { name: 'Hallon', emoji: '🫐' }, strawberry: { name: 'Jordgubbe', emoji: '🍓' },
  cherry: { name: 'Körsbär', emoji: '🍒' }, cranberry: { name: 'Tranbär', emoji: '🔴' },
  blackcurrant: { name: 'Svarta vinbär', emoji: '🫐' }, blackberry: { name: 'Björnbär', emoji: '🫐' },
  blueberry: { name: 'Blåbär', emoji: '🫐' }, plum: { name: 'Plommon', emoji: '🟣' },
  white_flowers: { name: 'Vita blommor', emoji: '🌼' }, rose: { name: 'Ros', emoji: '🌹' },
  violet: { name: 'Viol', emoji: '💜' }, grass: { name: 'Gräs', emoji: '🌿' },
  nettles: { name: 'Nässlor', emoji: '🌱' }, bell_pepper: { name: 'Paprika', emoji: '🫑' },
  blackcurrant_leaf: { name: 'Svartvinbärsblad', emoji: '🍃' }, mint: { name: 'Mynta', emoji: '🌿' },
  eucalyptus: { name: 'Eukalyptus', emoji: '🌿' }, black_pepper: { name: 'Svartpeppar', emoji: '🌶️' },
  white_pepper: { name: 'Vitpeppar', emoji: '⚪' }, liquorice: { name: 'Lakrits', emoji: '🖤' },
  flint: { name: 'Flinta', emoji: '🪨' }, chalk: { name: 'Krita', emoji: '⬜' },
  slate: { name: 'Skiffer', emoji: '🪨' }, wet_earth: { name: 'Våt jord', emoji: '🌍' },
  mushroom: { name: 'Svamp', emoji: '🍄' }, truffle: { name: 'Tryffel', emoji: '🍄' },
  vanilla: { name: 'Vanilj', emoji: '🤍' }, butter: { name: 'Smör', emoji: '🧈' },
  toast: { name: 'Rostat bröd', emoji: '🍞' }, nuts: { name: 'Nötter', emoji: '🥜' },
  coffee: { name: 'Kaffe', emoji: '☕' }, chocolate: { name: 'Choklad', emoji: '🍫' },
  petrol: { name: 'Petroleum', emoji: '⛽' }, honey: { name: 'Honung', emoji: '🍯' },
  dried_fruit: { name: 'Torkad frukt', emoji: '🫘' }, tobacco: { name: 'Tobak', emoji: '🍂' },
  leather: { name: 'Läder', emoji: '🟤' }, lychee: { name: 'Litchi', emoji: '🌸' },
  mango: { name: 'Mango', emoji: '🥭' }, pineapple: { name: 'Ananas', emoji: '🍍' },
  coconut: { name: 'Kokos', emoji: '🥥' }, orange_peel: { name: 'Apelsinskal', emoji: '🍊' },
  nectarine: { name: 'Nektarin', emoji: '🍑' },
};

function StructureRow({ val, color, label }: { val: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-24 text-right truncate" style={{ color }}>{label}</span>
      <div className="flex-1 h-2.5 bg-wine-950 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: val === 0 ? '0%' : `${(val / 5) * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function JamforPage() {
  const [grapeAId, setGrapeAId] = useState<string>('riesling');
  const [grapeBId, setGrapeBId] = useState<string>('sauvignon_blanc');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const [activeTypeA, setActiveTypeA] = useState<string>('white');
  const [activeTypeB, setActiveTypeB] = useState<string>('white');

  const grapeA = allGrapes.find((g) => g.id === grapeAId)!;
  const grapeB = allGrapes.find((g) => g.id === grapeBId)!;
  const isSame = grapeAId === grapeBId;

  const shared = getSharedAromas(grapeA, grapeB);
  const uniqueA = getUniqueAromas(grapeA, grapeB);
  const uniqueB = getUniqueAromas(grapeB, grapeA);
  const activeStyle = selectedStyle
    ? (allComparisons.find((c) => c.id === selectedStyle) as StyleVsStyleComparison)
    : null;
  const relevantStyles = styleComparisons.filter((c) => 
    c.grape === grapeAId || c.grape === grapeBId
  );

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Jämför</h1>
      <p className="text-wine-300 mb-8 leading-relaxed">
        Välj två druvor och se vad som skiljer dem åt — eller utforska samma druva i olika stilar.
      </p>

      <section className="mb-10">
        <h2 className="font-display text-2xl text-wine-200 mb-4">Druva mot druva</h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="flex items-center gap-1.5 text-xs text-wine-400 uppercase tracking-wide mb-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_A }} />
              Druva A
            </label>
            <div className="flex gap-1 mb-2 flex-wrap">
              {typeOrder.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setActiveTypeA(type);
                    const current = allGrapes.find(g => g.id === grapeAId);
                    if (!current || current.type !== type) {
                      const first = sortedGrapes.find(g => g.type === type);
                      if (first) setGrapeAId(first.id);
                    }
                    setSelectedStyle(null);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${activeTypeA === type ? 'bg-wine-600 text-white' : 'bg-wine-900 text-wine-400 border border-wine-700'}`}
                >
                  <span className="flex flex-col items-center gap-0.5">
  <span>{type === 'white' ? '🥂' : type === 'red' ? '🍷' : type === 'rosé' ? '🌸' : type === 'sparkling' ? '🍾' : '🍯'}</span>
  <span className="text-[9px]">{type === 'white' ? 'Vita' : type === 'red' ? 'Röda' : type === 'rosé' ? 'Rosé' : type === 'sparkling' ? 'Mous.' : 'Söta'}</span>
</span>
                </button>
              ))}
            </div>
            <select
              value={grapeAId}
              onChange={(e) => { const g = allGrapes.find(x => x.id === e.target.value); setGrapeAId(e.target.value); if (g) setActiveTypeA(g.type); setSelectedStyle(null); }}
              className="w-full bg-wine-900 border border-wine-700 text-wine-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
            >
              {sortedGrapes.filter(g => g.type === activeTypeA).map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs text-wine-400 uppercase tracking-wide mb-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_B }} />
              Druva B
            </label>
            <div className="flex gap-1 mb-2 flex-wrap">
              {typeOrder.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setActiveTypeB(type);
                    const current = allGrapes.find(g => g.id === grapeBId);
                    if (!current || current.type !== type) {
                      const first = sortedGrapes.find(g => g.type === type);
                      if (first) setGrapeBId(first.id);
                    }
                    setSelectedStyle(null);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${activeTypeB === type ? 'bg-sky-700 text-white' : 'bg-wine-900 text-wine-400 border border-wine-700'}`}
                >
                  <span className="flex flex-col items-center gap-0.5">
  <span>{type === 'white' ? '🥂' : type === 'red' ? '🍷' : type === 'rosé' ? '🌸' : type === 'sparkling' ? '🍾' : '🍯'}</span>
  <span className="text-[9px]">{type === 'white' ? 'Vita' : type === 'red' ? 'Röda' : type === 'rosé' ? 'Rosé' : type === 'sparkling' ? 'Mous.' : 'Söta'}</span>
</span>
                </button>
              ))}
            </div>
            <select
              value={grapeBId}
              onChange={(e) => { const g = allGrapes.find(x => x.id === e.target.value); setGrapeBId(e.target.value); if (g) setActiveTypeB(g.type); setSelectedStyle(null); }}
              className="w-full bg-wine-900 border border-wine-700 text-wine-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
            >
              {sortedGrapes.filter(g => g.type === activeTypeB).map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        {isSame ? (
          <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800 text-wine-400 text-sm text-center">
            Välj två olika druvor för att se jämförelsen.
          </div>
        ) : (
          <>
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800 mb-4">
              <h3 className="font-display text-lg text-wine-200 mb-5">Smakstruktur</h3>
              <div className="space-y-5">
                {structureKeys.map(({ key, label }) => {
                  const valA = grapeA.structure[key];
                  const valB = grapeB.structure[key];
                  const labelA = valA === 0 ? 'Ingen' : structureLabels[key][valA - 1];
const labelB = valB === 0 ? 'Ingen' : structureLabels[key][valB - 1];
                  return (
                    <div key={key}>
                      <div className="text-xs text-wine-500 uppercase tracking-wide mb-2">{label}</div>
                      <div className="space-y-2">
                        <StructureRow val={valA} color={COLOR_A} label={labelA} />
                        <StructureRow val={valB} color={COLOR_B} label={labelB} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-6 mt-5 pt-4 border-t border-wine-800">
                <div className="flex items-center gap-2 text-xs text-wine-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_A }} />
                  {grapeA.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-wine-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_B }} />
                  {grapeB.name}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
              {shared.length > 0 && (
                <div className="bg-wine-900 rounded-2xl p-4 border border-wine-800">
                  <h3 className="text-xs uppercase tracking-wide text-green-400 mb-3">✓ Gemensamt</h3>
                  <div className="space-y-1.5">
                    {shared.map((id) => (
                      <div key={id} className="text-sm text-wine-300 flex items-center gap-1.5">
                        <span>{aromaNames[id]?.emoji}</span>
                        <span>{aromaNames[id]?.name ?? id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-wine-900 rounded-2xl p-4 border border-wine-800">
                <h3 className="text-xs uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_A }} />
                  <span style={{ color: COLOR_A }}>{grapeA.name}</span>
                </h3>
                <div className="space-y-1.5">
                  {uniqueA.map((id) => (
                    <div key={id} className="text-sm text-wine-300 flex items-center gap-1.5">
                      <span>{aromaNames[id]?.emoji}</span>
                      <span>{aromaNames[id]?.name ?? id}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-wine-900 rounded-2xl p-4 border border-wine-800">
                <h3 className="text-xs uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_B }} />
                  <span style={{ color: COLOR_B }}>{grapeB.name}</span>
                </h3>
                <div className="space-y-1.5">
                  {uniqueB.map((id) => (
                    <div key={id} className="text-sm text-wine-300 flex items-center gap-1.5">
                      <span>{aromaNames[id]?.emoji}</span>
                      <span>{aromaNames[id]?.name ?? id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-900/20 rounded-2xl p-5 border border-amber-800/40">
              <h3 className="font-display text-lg text-amber-300 mb-3">🔍 Blindprovningstips</h3>
              <div className="space-y-2 text-sm text-wine-200">
                {grapeA.blindTastingClues.slice(0, 2).map((clue) => (
                  <p key={clue}>
                    <span className="font-medium" style={{ color: COLOR_A }}>{grapeA.name}:</span> {clue}
                  </p>
                ))}
                {grapeB.blindTastingClues.slice(0, 2).map((clue) => (
                  <p key={clue}>
                    <span className="font-medium" style={{ color: COLOR_B }}>{grapeB.name}:</span> {clue}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl text-wine-200 mb-4">Stil & region</h2>
        <p className="text-wine-400 text-sm mb-4">Samma druva, helt olika uttryck beroende på var den odlas.</p>

        {!activeStyle ? (
          relevantStyles.length === 0 ? (
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800 text-wine-500 text-sm text-center">
              Inga stilarjämförelser finns för dessa druvor. Utforska <a href="/stilar" className="text-amber-400 hover:underline">Stilar & regioner</a> för fler jämförelser.
            </div>
          ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {relevantStyles.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelectedStyle(c.id)}
                  className="w-full text-left p-4 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                >
                  <div className="font-display text-wine-100">{c.title}</div>
                  <div className="text-xs text-wine-500 mt-1">{c.styleA.region} vs {c.styleB.region}</div>
                </button>
              </li>
            ))}
          </ul>
          )
        ) : (
          <div>
            <button onClick={() => setSelectedStyle(null)} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
              ← Alla stilar
            </button>
            <h3 className="font-display text-2xl text-wine-50 mb-6">{activeStyle.title}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                <div className="text-xs text-wine-500 uppercase tracking-wide mb-1">{activeStyle.styleA.region}</div>
                <h4 className="font-display text-lg text-amber-300 mb-3">{activeStyle.styleA.name}</h4>
                <ul className="space-y-1.5">
                  {activeStyle.styleACharacter.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
                      <span className="text-amber-400 mt-0.5">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                <div className="text-xs text-wine-500 uppercase tracking-wide mb-1">{activeStyle.styleB.region}</div>
                <h4 className="font-display text-lg text-sky-300 mb-3">{activeStyle.styleB.name}</h4>
                <ul className="space-y-1.5">
                  {activeStyle.styleBCharacter.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-wine-300 text-sm">
                      <span className="text-sky-400 mt-0.5">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-amber-900/30 rounded-2xl p-5 border border-amber-700/40">
              <h4 className="font-display text-lg text-amber-300 mb-2">🔍 Blindprovningstips</h4>
              <p className="text-wine-200 text-sm leading-relaxed">{activeStyle.blindTastingTip}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}