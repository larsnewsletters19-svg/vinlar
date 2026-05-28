'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import grapes from '@/data/grapes.json';
import aromas from '@/data/aromas.json';
import { Grape, Aroma } from '@/types';

const allGrapes = grapes as Grape[];
const allAromas = aromas as Aroma[];

const steps = [
  { id: 'se', label: 'Se', emoji: '👁️', title: 'Titta på vinet' },
  { id: 'dofta', label: 'Dofta', emoji: '👃', title: 'Dofta på vinet' },
  { id: 'smaka', label: 'Smaka', emoji: '👅', title: 'Smaka på vinet' },
  { id: 'ledtradar', label: 'Ledtrådar', emoji: '🔍', title: 'Blindprovningsledtrådar' },
  { id: 'summering', label: 'Klart', emoji: '🎓', title: 'Sammanfattning' },
];

const colorMap: Record<string, { label: string; color: string }> = {
  white: { label: 'Gult till guldgult', color: 'bg-yellow-200' },
  red: { label: 'Rubinrött till granatäpple', color: 'bg-red-800' },
  rosé: { label: 'Blek lax till djuprosa', color: 'bg-pink-300' },
  sparkling: { label: 'Blekt gult med bubblor', color: 'bg-yellow-100' },
  sweet: { label: 'Guldgult till bärnstensfärgat', color: 'bg-amber-400' },
};

const structureLabels = [
  { key: 'acidity', label: 'Syra', low: 'Låg — munnen vattnas inte', high: 'Hög — munnen vattnas längs sidorna' },
  { key: 'tannin', label: 'Tannin', low: 'Lågt — ingen sträv känsla', high: 'Högt — munnen känns torr och sträv' },
  { key: 'body', label: 'Kropp', low: 'Lätt — som vatten', high: 'Fyllig — som mjölk eller grädde' },
  { key: 'alcohol', label: 'Alkohol', low: 'Låg — ingen värme i halsen', high: 'Hög — värme i halsen och magen' },
  { key: 'sweetness', label: 'Sötma', low: 'Torrt — ingen sötma', high: 'Söt — tydlig sötma direkt' },
];

const aromaFamilies = [
  { id: 'citrus', label: 'Citrus', emoji: '🍋', ids: ['lemon', 'lime', 'grapefruit', 'orange_peel'] },
  { id: 'green_fruit', label: 'Grön frukt', emoji: '🍏', ids: ['green_apple', 'pear'] },
  { id: 'stone_fruit', label: 'Stenfrukt', emoji: '🍑', ids: ['peach', 'apricot', 'nectarine'] },
  { id: 'tropical', label: 'Tropisk', emoji: '🍍', ids: ['passion_fruit', 'pineapple', 'mango', 'lychee'] },
  { id: 'red_berries', label: 'Röda bär', emoji: '🍓', ids: ['raspberry', 'strawberry', 'cherry', 'cranberry'] },
  { id: 'dark_berries', label: 'Mörka bär', emoji: '🫐', ids: ['blackcurrant', 'blackberry', 'blueberry', 'plum'] },
  { id: 'floral', label: 'Blommigt', emoji: '🌸', ids: ['white_flowers', 'rose', 'violet'] },
  { id: 'green', label: 'Grönt/örtigt', emoji: '🌿', ids: ['grass', 'nettles', 'bell_pepper', 'mint'] },
  { id: 'spicy', label: 'Kryddigt', emoji: '🌶️', ids: ['black_pepper', 'white_pepper', 'liquorice'] },
  { id: 'earthy', label: 'Jordigt', emoji: '🪨', ids: ['flint', 'chalk', 'wet_earth', 'mushroom', 'truffle'] },
  { id: 'oak', label: 'Fat/ek', emoji: '🪵', ids: ['vanilla', 'butter', 'toast', 'coffee', 'chocolate'] },
  { id: 'development', label: 'Mognad', emoji: '⏳', ids: ['petrol', 'honey', 'dried_fruit', 'tobacco', 'leather'] },
];

function ProvaContent() {
  const searchParams = useSearchParams();
  const initialGrape = searchParams.get('druva') ?? '';

  const [selectedGrape, setSelectedGrape] = useState<string>(initialGrape);
  const [step, setStep] = useState(initialGrape ? 0 : -1);
  const [activeGroup, setActiveGroup] = useState<string>('white');
  const [showAromas, setShowAromas] = useState(false);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [showStructure, setShowStructure] = useState(false);
  const [structureAnswers, setStructureAnswers] = useState<Record<string, number | null>>({});
  const [structureFeedback, setStructureFeedback] = useState<Record<string, boolean | null>>({});
  const grape = allGrapes.find((g) => g.id === selectedGrape);

  const startGuide = (id: string) => {
    const g = allGrapes.find((g) => g.id === id);
    setSelectedGrape(id);
    setActiveGroup(g?.type ?? 'white');
    setStep(0);
    setShowAromas(false);
    setShowStructure(false);
    setStructureAnswers({});
    setStructureFeedback({});
    setSelectedFamilies([]);
  };

  if (!grape || step === -1) {
    const grapeGroups = [
      { id: 'white', label: '🥂 Vita' },
      { id: 'red', label: '🍷 Röda' },
      { id: 'rosé', label: '🌸 Rosé' },
      { id: 'sparkling', label: '🍾 Mousserande' },
      { id: 'sweet', label: '🍯 Söta' },
    ];

    const filteredGrapes = allGrapes.filter((g) => g.type === activeGroup);

    return (
      <div className="px-4 py-8 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl text-wine-100 mb-2">Prova ett vin</h1>
        <p className="text-wine-300 mb-6 leading-relaxed">
          Häll upp ett glas, välj druvan och låt appen guida dig genom provningen.
        </p>

        <div className="flex gap-2 mb-3 border-b border-wine-800 pb-3">
          {grapeGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`px-3 py-2 rounded-lg text-sm font-display transition-all ${
                activeGroup === group.id
                  ? 'bg-amber-400 text-wine-950 font-semibold'
                  : 'text-wine-400 hover:text-wine-200'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-4">
          {filteredGrapes.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => startGuide(g.id)}
                className="w-full text-left p-4 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
              >
                <div className="font-display text-lg text-wine-50">{g.name}</div>
                <div className="text-xs text-wine-400 mt-0.5 line-clamp-2">{g.shortDescription}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const currentStep = steps[step];
  const topAromas = Object.entries(grape.aromaScores)
    .filter(([, score]) => score >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  const aromaMap = Object.fromEntries(allAromas.map((a) => [a.id, a]));
  const colorInfo = colorMap[grape.type] ?? colorMap['white'];

  const relevantFamilies = aromaFamilies.filter((family) =>
    family.ids.some((id) => (grape.aromaScores[id] ?? 0) >= 3)
  );

  return (
    <div className="px-4 py-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { setStep(-1); setSelectedGrape(''); }}
          className="text-wine-400 text-sm hover:text-wine-200"
        >
          ← Byt druva
        </button>
        <div className="text-wine-400 text-sm">{grape.name}</div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i <= step ? 'bg-amber-400' : 'bg-wine-800'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{currentStep.emoji}</span>
          <div>
            <div className="text-xs uppercase tracking-widest text-wine-500 mb-0.5">
              Steg {step + 1} av {steps.length}
            </div>
            <h2 className="font-display text-3xl text-wine-50">{currentStep.title}</h2>
          </div>
        </div>

        {/* SE */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <p className="text-wine-200 text-sm leading-relaxed mb-4">
                Håll glaset mot ett vitt underlag eller ljuset. Titta på färgen och intensiteten.
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${colorInfo.color} border-2 border-wine-700`} />
                <div>
                  <div className="text-wine-100 font-medium">{grape.name}</div>
                  <div className="text-wine-400 text-sm">{colorInfo.label}</div>
                </div>
              </div>
              <p className="text-wine-400 text-sm leading-relaxed">
                {grape.type === 'white' && 'Vita viner varierar från nästan genomskinliga till djupt guldgula. Mer färg kan indikera eklagring eller ålder.'}
                {grape.type === 'red' && 'Röda viner varierar från ljust rubinrött (Pinot Noir) till djupt granatäpple (Cabernet Sauvignon). Ljusare färg betyder ofta tunnare skal och mer elegant vin.'}
                {grape.type === 'rosé' && 'Roséviner varierar från blekaste lax till djup körsbärsrosa. Provence-stil är alltid mycket blek.'}
                {grape.type === 'sparkling' && 'Mousserande viner är bleka till guldgula. Titta på bubblorna — fina och ihållande bubblor indikerar kvalitet.'}
                {grape.type === 'sweet' && 'Söta viner är ofta djupare guldgula till bärnstensfärgade. Mörkare färg kan indikera botrytis eller oxidativ lagring.'}
              </p>
            </div>
            <div className="bg-amber-900/20 rounded-2xl p-4 border border-amber-800/40">
              <p className="text-amber-300 text-sm">💡 Snurra glaset lite och titta på hur vinet rinner ner längs sidan — tjocka "ben" indikerar hög alkohol eller sötma.</p>
            </div>
          </div>
        )}

        {/* DOFTA */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <p className="text-wine-200 text-sm leading-relaxed mb-4">
                Dofta på vinet utan att snurra glaset först. Vad känner du? Snurra sedan glaset försiktigt och dofta igen — märker du skillnad?
              </p>
              {!showAromas ? (
                <div className="space-y-4">
                  <p className="text-wine-400 text-sm">Vilka aromfamiljer känner du? Välj alla du hittar:</p>
                  <div className="flex flex-wrap gap-2">
                    {aromaFamilies.map((family) => {
                      const isSelected = selectedFamilies.includes(family.id);
                      const isCorrect = relevantFamilies.some(f => f.id === family.id);
                      return (
                        <button
                          key={family.id}
                          onClick={() => setSelectedFamilies(prev =>
                            prev.includes(family.id)
                              ? prev.filter(f => f !== family.id)
                              : [...prev, family.id]
                          )}
                          className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                            isSelected
                              ? 'bg-wine-600 border-wine-500 text-white'
                              : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
                          }`}
                        >
                          {family.emoji} {family.label}
                        </button>
                      );
                    })}
                  </div>
                  {selectedFamilies.length > 0 && (
                    <div className="space-y-2">
                      {selectedFamilies.map(id => {
                        const family = aromaFamilies.find(f => f.id === id);
                        const isCorrect = relevantFamilies.some(f => f.id === id);
                        return (
                          <div key={id} className={`px-3 py-2 rounded-xl text-sm flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                              : 'bg-rose-900/20 border border-rose-700/40 text-rose-300'
                          }`}>
                            {isCorrect ? '✓' : '✗'} {family?.emoji} {family?.label}
                            {!isCorrect && (() => {
  const exampleGrape = allGrapes.find(g =>
    g.id !== grape.id &&
    aromaFamilies.find(f => f.id === id)?.ids.some(aromaId => (g.aromaScores[aromaId] ?? 0) >= 4)
  );
  return (
    <span className="text-wine-500 text-xs ml-1">
      — inte typiskt för {grape.name}{exampleGrape ? `. Prova ${exampleGrape.name} för denna arom.` : '.'}
    </span>
  );
})()}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <button
                    onClick={() => setShowAromas(true)}
                    className="w-full py-3 bg-wine-600 hover:bg-wine-500 text-white font-medium rounded-xl transition-colors text-sm"
                  >
                    Visa alla typiska aromer →
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">Typiska aromer för {grape.name}</h3>
                  <div className="space-y-3">
                    {relevantFamilies.map((family) => {
                      const familyAromas = family.ids
                        .map((id) => ({ id, score: grape.aromaScores[id] ?? 0, aroma: aromaMap[id] }))
                        .filter((a) => a.score >= 3)
                        .sort((a, b) => b.score - a.score);
                      return (
                        <div key={family.id} className="bg-wine-950 rounded-xl p-3">
                          <div className="text-wine-300 font-medium mb-2 text-sm">
                            {family.emoji} {family.label}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {familyAromas.map(({ id, score, aroma }) => (
                              <span key={id} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                score === 5 ? 'bg-amber-400/20 border border-amber-400/50 text-amber-300' : 'bg-wine-800 border border-wine-700 text-wine-300'
                              }`}>
                                {aroma?.emoji} {aroma?.name}
                                {score === 5 && <span className="text-amber-400">★</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="bg-amber-900/20 rounded-2xl p-4 border border-amber-800/40">
              <p className="text-amber-300 text-sm">💡 Dofta i korta sniftar — näsan tröttnar snabbt. Ta en paus och dofta igen.</p>
            </div>
          </div>
        )}

        {/* SMAKA */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <p className="text-wine-200 text-sm leading-relaxed mb-4">
                Ta en liten klunk. Håll vinet i munnen i 5–10 sekunder. Andas in lite luft. Svälj och notera eftersmaken.
              </p>
              {!showStructure ? (
                <div className="space-y-5">
                  {structureLabels
                    .filter(({ key }) => {
                      if (key === 'tannin' && grape.type !== 'red') return false;
                      if (key === 'sweetness' && grape.structure['sweetness' as keyof typeof grape.structure] === 0) return false;
                      return true;
                    })
                    .map(({ key, label, low, high }) => {
                      const correct = grape.structure[key as keyof typeof grape.structure];
                      const answer = structureAnswers[key];
                      const feedback = structureFeedback[key];
                      const tips: Record<string, { low: string; high: string; lowExample: string; highExample: string }> = {
  acidity: {
    low: 'Låg syra känns slapp och rund — munnen vattnas inte.',
    high: 'Hög syra får munnen att vattnas längs sidorna — som att bita i en citron.',
    lowExample: 'Viognier och Gewürztraminer har mycket låg syra.',
    highExample: 'Riesling och Champagne har mycket hög syra.',
  },
  body: {
    low: 'Lätt kropp glider lätt förbi — som vatten i munnen.',
    high: 'Fyllig kropp stannar kvar och känns tung — som mjölk eller grädde.',
    lowExample: 'Riesling och Gamay har mycket lätt kropp.',
    highExample: 'Cabernet Sauvignon och ekad Chardonnay har mycket fyllig kropp.',
  },
  tannin: {
    low: 'Lågt tannin ger ingen sträv känsla — munnen känns mjuk.',
    high: 'Högt tannin torkar ut munnen — som att dricka starkt te.',
    lowExample: 'Pinot Noir och Gamay har mycket lite tannin.',
    highExample: 'Cabernet Sauvignon och Nebbiolo har mycket högt tannin.',
  },
  alcohol: {
    low: 'Låg alkohol ger ingen värme — vinet känns lätt och friskt.',
    high: 'Hög alkohol ger värme i halsen och magen efter att du svalt.',
    lowExample: 'Mosel Riesling och Moscato d\'Asti har mycket låg alkohol.',
    highExample: 'Amarone och Zinfandel har mycket hög alkohol.',
  },
  sweetness: {
    low: 'Torrt vin ger ingen söt känsla — bara frukt och syra.',
    high: 'Sötma känns direkt på tungspetsen och stannar kvar.',
    lowExample: 'Chablis och Sancerre är helt torra viner.',
    highExample: 'Sauternes och Tokaji har intensiv sötma.',
  },
};
                      const levels = [
                        { val: 1, label: low.split(' — ')[0] },
                        { val: 3, label: 'Medel' },
                        { val: 5, label: high.split(' — ')[0] },
                      ];
                      const correctLabel = correct <= 2 ? low.split(' — ')[0] : correct >= 4 ? high.split(' — ')[0] : 'Medel';
                      return (
                        <div key={key}>
                          <div className="text-wine-100 font-medium mb-2 text-sm">{label}</div>
                          {answer === undefined || answer === null ? (
                            <div className="flex gap-2">
                              {levels.map((l) => (
                                <button
                                  key={l.val}
                                  onClick={() => {
                                    const isCorrect = (l.val <= 2 && correct <= 2) || (l.val === 3 && correct === 3) || (l.val >= 4 && correct >= 4);
                                    setStructureAnswers(prev => ({ ...prev, [key]: l.val }));
                                    setStructureFeedback(prev => ({ ...prev, [key]: isCorrect }));
                                  }}
                                  className="flex-1 py-2 px-1 rounded-xl text-xs font-medium bg-wine-800 border border-wine-700 text-wine-300 hover:border-wine-500 hover:text-wine-100 transition-all"
                                >
                                  {l.label}
                                </button>
                              ))}
                            </div>
                          ) : feedback === true ? (
                            <div className="bg-green-900/30 rounded-xl p-3 border border-green-700/50">
                              <p className="text-green-300 text-sm font-medium">✓ Rätt!</p>
                              <p className="text-green-200 text-xs mt-1">{correct >= 4 ? tips[key].high : correct <= 2 ? tips[key].low : 'Medel — varken lågt eller högt.'}</p>
                            </div>
                          ) : feedback === false ? (
                            <div className="bg-rose-900/20 rounded-xl p-3 border border-rose-700/40 space-y-2">
                              <p className="text-rose-300 text-sm font-medium">
  {grape.name} är faktiskt {key === 'sweetness' ? correctLabel.toLowerCase() : `${correctLabel.toLowerCase()} i ${label.toLowerCase()}`}.
</p>
                              <p className="text-wine-300 text-xs">💡 {correct >= 4 ? tips[key].high : tips[key].low}</p>
                              <p className="text-wine-500 text-xs">
                                {(() => {
                                  const answerVal = answer ?? 3;
                                  const exampleGrapes = allGrapes
                                    .filter(g => g.id !== grape.id && g.structure[key as keyof typeof g.structure] === answerVal)
                                    .slice(0, 2)
                                    .map(g => g.name)
                                    .join(' och ');
                                  const exampleGrapesClose = !exampleGrapes ? allGrapes
                                    .filter(g => g.id !== grape.id && Math.abs(g.structure[key as keyof typeof g.structure] - answerVal) <= 1)
                                    .slice(0, 2)
                                    .map(g => g.name)
                                    .join(' och ') : exampleGrapes;
                                  return exampleGrapesClose
                                    ? `Druvor med ${answerVal <= 2 ? 'låg' : answerVal >= 4 ? 'hög' : 'medel'} ${label.toLowerCase()}: ${exampleGrapesClose}`
                                    : '';
                                })()}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  {Object.keys(structureAnswers).length > 0 && (
                    <button
                      onClick={() => setShowStructure(true)}
                      className="w-full py-3 bg-wine-600 hover:bg-wine-500 text-white font-medium rounded-xl transition-colors text-sm"
                    >
                      Visa full smakstruktur →
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">Smakstruktur för {grape.name}</h3>
                  <div className="space-y-3">
                    {structureLabels.map(({ key, label, low, high }) => {
                      const value = grape.structure[key as keyof typeof grape.structure];
                      if (key === 'tannin' && grape.type !== 'red') return null;
                      if (key === 'sweetness' && value === 0) return null;
                      return (
                        <div key={key} className="bg-wine-950 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-wine-100 font-medium text-sm">{label}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <div key={s} className={`w-3 h-3 rounded-full ${s <= value ? 'bg-amber-400' : 'bg-wine-700'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-wine-500 text-xs">{value <= 2 ? low : value >= 4 ? high : `Medel — varken högt eller lågt`}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="bg-amber-900/20 rounded-2xl p-4 border border-amber-800/40">
              <p className="text-amber-300 text-sm">💡 Räkna hur länge du kan känna vinet efter att du svalt — det är finishen. Längre finish = högre kvalitet.</p>
            </div>
          </div>
        )}

        {/* LEDTRÅDAR */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <p className="text-wine-200 text-sm leading-relaxed mb-4">
                Nu när du provt vinet — här är vad du ska minnas till nästa blindprovning av {grape.name}.
              </p>
              <ul className="space-y-3">
                {grape.blindTastingClues.map((clue) => (
                  <li key={clue} className="flex items-start gap-3 bg-wine-950 rounded-xl p-3">
                    <span className="text-amber-400 mt-0.5">→</span>
                    <span className="text-wine-200 text-sm">{clue}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">Förväxlas ofta med</h3>
              <div className="flex flex-wrap gap-2">
                {grape.commonConfusions.map((name) => {
                  const match = allGrapes.find((g) => g.name === name || g.name.includes(name));
                  return match ? (
                    <span key={name} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-300">
                      {name}
                    </span>
                  ) : (
                    <span key={name} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-400">
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUMMERING */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-green-900/20 rounded-2xl p-5 border border-green-800/40 text-center">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="font-display text-2xl text-wine-50 mb-2">Bra jobbat!</h3>
              <p className="text-wine-300 text-sm leading-relaxed">
                Du har nu provt {grape.name} systematiskt. Ju fler gånger du gör det, desto lättare känner du igen druvan i blindprovning.
              </p>
            </div>
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">Kom ihåg</h3>
              <ul className="space-y-2">
                {grape.blindTastingClues.slice(0, 3).map((clue) => (
                  <li key={clue} className="flex items-start gap-2 text-wine-300 text-sm">
                    <span className="text-amber-400">→</span> {clue}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setStep(0); setShowAromas(false); setShowStructure(false); }}
                className="py-3 bg-wine-900 hover:bg-wine-800 border border-wine-700 text-wine-300 font-medium rounded-xl transition-colors text-sm"
              >
                Prova igen
              </button>
              <button
                onClick={() => { setStep(-1); setSelectedGrape(''); }}
                className="py-3 bg-wine-600 hover:bg-wine-500 text-white font-medium rounded-xl transition-colors text-sm"
              >
                Annan druva
              </button>
            </div>
            <Link
              href={`/druvor/${grape.id}`}
              className="block text-center py-3 bg-wine-900 hover:bg-wine-800 border border-wine-700 text-wine-300 text-sm rounded-xl transition-colors"
            >
              📖 Läs mer om {grape.name}
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 bg-wine-900 hover:bg-wine-800 border border-wine-700 text-wine-300 font-medium rounded-xl transition-colors"
            >
              ← Föregående
            </button>
          )}
          <button
            onClick={() => { setStep(step + 1); setShowAromas(false); setShowStructure(false); }}
            className="flex-1 py-3 bg-wine-600 hover:bg-wine-500 text-white font-display text-lg rounded-xl transition-colors"
          >
            {step === 3 ? 'Slutför →' : 'Nästa →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProvaPage() {
  return (
    <Suspense fallback={<div className="px-4 py-8 text-wine-400">Laddar...</div>}>
      <ProvaContent />
    </Suspense>
  );
}