'use client';

import { useState } from 'react';
import Link from 'next/link';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';

const allGrapes = grapes as Grape[];
const redGrapes = allGrapes.filter(g => g.type === 'red');
const whiteGrapes = allGrapes.filter(g => g.type === 'white');

type Mode = 'scratch' | 'refine' | null;

const blendSuggestions = [
  {
    id: 'gsm',
    name: 'GSM — Grenache, Syrah, Mourvèdre',
    grapes: [
      { id: 'grenache', pct: 70 },
      { id: 'syrah', pct: 20 },
      { id: 'mourvedre', pct: 10 },
    ],
    profile: { acidity: 2, body: 4, tannin: 2, sweetness: 1 },
    description: 'Röda bär, kryddor och lakrits. Hög alkohol och mjukt tannin.',
    example: 'Châteauneuf-du-Pape, Gigondas',
    foodPairing: 'Lamm, grillat, provensalsk mat',
  },
  {
    id: 'bordeaux_left',
    name: 'Bordeaux Vänster Bank',
    grapes: [
      { id: 'cabernet_sauvignon', pct: 70 },
      { id: 'merlot', pct: 20 },
      { id: 'cabernet_franc', pct: 10 },
    ],
    profile: { acidity: 3, body: 5, tannin: 5, sweetness: 1 },
    description: 'Svarta vinbär, ceder och tobak. Kraftfullt och lagringsvärt.',
    example: 'Pauillac, Margaux, Saint-Julien',
    foodPairing: 'Biff, lammracks, hårdost',
  },
  {
    id: 'bordeaux_right',
    name: 'Bordeaux Höger Bank',
    grapes: [
      { id: 'merlot', pct: 75 },
      { id: 'cabernet_franc', pct: 25 },
    ],
    profile: { acidity: 2, body: 4, tannin: 3, sweetness: 1 },
    description: 'Plommon, choklad och blommighet. Mjukare och mer tillgänglig.',
    example: 'Pomerol, Saint-Émilion',
    foodPairing: 'Ankbröst, tryffel, pasta med köttsås',
  },
  {
    id: 'rhone_blanc',
    name: 'Vit Rhône — Viognier & Chardonnay',
    grapes: [
      { id: 'chardonnay', pct: 60 },
      { id: 'viognier', pct: 40 },
    ],
    profile: { acidity: 2, body: 4, tannin: 0, sweetness: 1 },
    description: 'Persika, honung och blommighet. Fyllig och aromatisk.',
    example: 'Hermitage Blanc, Saint-Joseph Blanc',
    foodPairing: 'Hummer, kyckling i gräddsås, foie gras',
  },
  {
    id: 'alsace_blend',
    name: 'Aromatisk vit blend',
    grapes: [
      { id: 'riesling', pct: 50 },
      { id: 'gewurztraminer', pct: 30 },
      { id: 'pinot_gris', pct: 20 },
    ],
    profile: { acidity: 4, body: 3, tannin: 0, sweetness: 2 },
    description: 'Citrus, lychee och honung. Aromatisk och komplex.',
    example: 'Alsace Gentil, Edelzwicker',
    foodPairing: 'Asiatisk mat, kryddig mat, foie gras',
  },
  {
    id: 'super_tuscan',
    name: 'Super Tuscan',
    grapes: [
      { id: 'sangiovese', pct: 50 },
      { id: 'cabernet_sauvignon', pct: 30 },
      { id: 'merlot', pct: 20 },
    ],
    profile: { acidity: 4, body: 4, tannin: 4, sweetness: 1 },
    description: 'Körsbär, svarta vinbär och örter. Elegant och kraftfullt.',
    example: 'Sassicaia, Tignanello',
    foodPairing: 'Bistecca fiorentina, vilt, pecorino',
  },
];

const refineSuggestions: Record<string, { problem: string; solution: string; addGrape: string; proportion: string; result: string }[]> = {
  cabernet_sauvignon: [
    { problem: 'För mycket tannin', solution: 'Blanda in Merlot', addGrape: 'merlot', proportion: '20-30%', result: 'Mjukare tannin, mer plommon och choklad.' },
    { problem: 'Saknar blommighet', solution: 'Blanda in Cabernet Franc', addGrape: 'cabernet_franc', proportion: '15-20%', result: 'Mer viol och elegans, lite paprika.' },
    { problem: 'För tung och mörk', solution: 'Blanda in Pinot Noir', addGrape: 'pinot_noir', proportion: '20%', result: 'Lättare kropp, mer röda bär och friskhet.' },
  ],
  merlot: [
    { problem: 'För mjuk och platt', solution: 'Blanda in Cabernet Sauvignon', addGrape: 'cabernet_sauvignon', proportion: '20-30%', result: 'Mer struktur, tannin och lagringskapacitet.' },
    { problem: 'Saknar komplexitet', solution: 'Blanda in Cabernet Franc', addGrape: 'cabernet_franc', proportion: '15%', result: 'Mer blommighet och örtigthet.' },
    { problem: 'För chokladig', solution: 'Blanda in Malbec', addGrape: 'malbec', proportion: '15%', result: 'Mer viol och mörk frukt.' },
  ],
  syrah: [
    { problem: 'För kraftig och pepprig', solution: 'Blanda in Grenache', addGrape: 'grenache', proportion: '30-40%', result: 'Mjukare, mer röda bär och lägre tannin.' },
    { problem: 'Saknar friskhet', solution: 'Blanda in Viognier', addGrape: 'viognier', proportion: '5-10%', result: 'Mer blommighet och friskhet — klassisk Côte-Rôtie.' },
    { problem: 'För jordigt', solution: 'Blanda in Merlot', addGrape: 'merlot', proportion: '20%', result: 'Mjukare och mer fruktig stil.' },
  ],
  grenache: [
    { problem: 'För fruktig och enkel', solution: 'Blanda in Syrah', addGrape: 'syrah', proportion: '15-20%', result: 'Mer peppar, struktur och komplexitet.' },
    { problem: 'För hög alkohol', solution: 'Blanda in Mourvèdre', addGrape: 'mourvedre', proportion: '10-15%', result: 'Mer jordighet och tanninstruktur.' },
    { problem: 'Saknar djup', solution: 'Blanda in Malbec', addGrape: 'malbec', proportion: '15%', result: 'Mer mörk frukt och viol.' },
  ],
  pinot_noir: [
    { problem: 'För lätt och tunn', solution: 'Blanda in Syrah', addGrape: 'syrah', proportion: '10-15%', result: 'Mer kropp och peppar utan att förlora elegansen.' },
    { problem: 'Saknar jordighet', solution: 'Blanda in Gamay', addGrape: 'gamay', proportion: '20%', result: 'Mer fruktig och jordigt — klassisk Bourgogne-känsla.' },
    { problem: 'För bärfruktig', solution: 'Blanda in Nebbiolo', addGrape: 'nebbiolo', proportion: '10%', result: 'Mer komplexitet, syra och lagringskapacitet.' },
  ],
  nebbiolo: [
    { problem: 'För strävt och tanninrikt', solution: 'Blanda in Barbera', addGrape: 'merlot', proportion: '15-20%', result: 'Mjukare tannin och mer tillgänglig ung.' },
    { problem: 'Saknar frukt', solution: 'Blanda in Sangiovese', addGrape: 'sangiovese', proportion: '20%', result: 'Mer körsbärsfrukt och örtigthet.' },
  ],
  sangiovese: [
    { problem: 'För syrlig och skarp', solution: 'Blanda in Merlot', addGrape: 'merlot', proportion: '15-20%', result: 'Mjukare syra och mer plommon — klassisk Super Tuscan.' },
    { problem: 'Saknar kropp', solution: 'Blanda in Cabernet Sauvignon', addGrape: 'cabernet_sauvignon', proportion: '20-30%', result: 'Mer struktur och mörk frukt — Tignanello-stil.' },
    { problem: 'För enkel', solution: 'Blanda in Syrah', addGrape: 'syrah', proportion: '15%', result: 'Mer peppar och komplexitet.' },
  ],
  tempranillo: [
    { problem: 'För ekig och tung', solution: 'Blanda in Grenache', addGrape: 'grenache', proportion: '20%', result: 'Mer fruktighet och lättare stil.' },
    { problem: 'Saknar friskhet', solution: 'Blanda in Graciano', addGrape: 'cabernet_franc', proportion: '10%', result: 'Mer syra och elegans.' },
    { problem: 'För enkel', solution: 'Blanda in Malbec', addGrape: 'malbec', proportion: '15%', result: 'Mer mörk frukt och viol.' },
  ],
  malbec: [
    { problem: 'För mjuk och enkel', solution: 'Blanda in Cabernet Sauvignon', addGrape: 'cabernet_sauvignon', proportion: '20%', result: 'Mer struktur och lagringskapacitet.' },
    { problem: 'Saknar friskhet', solution: 'Blanda in Cabernet Franc', addGrape: 'cabernet_franc', proportion: '15%', result: 'Mer syra och blommighet.' },
    { problem: 'För mörk och tung', solution: 'Blanda in Pinot Noir', addGrape: 'pinot_noir', proportion: '20%', result: 'Lättare och mer elegant stil.' },
  ],
  gamay: [
    { problem: 'För lätt och enkel', solution: 'Blanda in Pinot Noir', addGrape: 'pinot_noir', proportion: '20-30%', result: 'Mer komplexitet och jordighet.' },
    { problem: 'Saknar struktur', solution: 'Blanda in Syrah', addGrape: 'syrah', proportion: '10%', result: 'Mer peppar och tanninstruktur.' },
  ],
  cabernet_franc: [
    { problem: 'För örtig och grön', solution: 'Blanda in Merlot', addGrape: 'merlot', proportion: '25-30%', result: 'Mjukare och mer fruktig stil.' },
    { problem: 'Saknar kraft', solution: 'Blanda in Cabernet Sauvignon', addGrape: 'cabernet_sauvignon', proportion: '20%', result: 'Mer tannin och lagringskapacitet.' },
  ],
  mourvedre: [
    { problem: 'För viltigt och jordigt', solution: 'Blanda in Grenache', addGrape: 'grenache', proportion: '30%', result: 'Mer röda bär och fruktig friskhet.' },
    { problem: 'För strävt', solution: 'Blanda in Syrah', addGrape: 'syrah', proportion: '20%', result: 'Mer peppar och blommighet.' },
  ],
  zinfandel: [
    { problem: 'För hög alkohol', solution: 'Blanda in Grenache', addGrape: 'grenache', proportion: '20%', result: 'Mer balans och lägre alkohol.' },
    { problem: 'För söt och russinig', solution: 'Blanda in Cabernet Sauvignon', addGrape: 'cabernet_sauvignon', proportion: '20%', result: 'Mer struktur och torrare stil.' },
  ],
  chardonnay: [
    { problem: 'För ekig och smörig', solution: 'Blanda in Sauvignon Blanc', addGrape: 'sauvignon_blanc', proportion: '20-30%', result: 'Mer friskhet, citrus och grönare toner.' },
    { problem: 'För neutral', solution: 'Blanda in Viognier', addGrape: 'viognier', proportion: '15-20%', result: 'Mer blommighet och aromatisk intensitet.' },
    { problem: 'För tung', solution: 'Blanda in Riesling', addGrape: 'riesling', proportion: '20%', result: 'Mer syra och mineralitet.' },
  ],
  sauvignon_blanc: [
    { problem: 'För grön och örtig', solution: 'Blanda in Semillon', addGrape: 'semillon', proportion: '20-30%', result: 'Mer rundhet, vaxig textur och honung.' },
    { problem: 'Saknar kropp', solution: 'Blanda in Chardonnay', addGrape: 'chardonnay', proportion: '25%', result: 'Mer kropp och en rundare stil.' },
    { problem: 'För syrlig', solution: 'Blanda in Viognier', addGrape: 'viognier', proportion: '15%', result: 'Mer blommighet och lägre syra.' },
  ],
  riesling: [
    { problem: 'För syrlig', solution: 'Blanda in Pinot Gris', addGrape: 'pinot_gris', proportion: '20-30%', result: 'Lägre syra, mer kropp och honung.' },
    { problem: 'Saknar aromatik', solution: 'Blanda in Gewürztraminer', addGrape: 'gewurztraminer', proportion: '15-20%', result: 'Mer lychee, ros och exotisk blommighet.' },
    { problem: 'För lätt', solution: 'Blanda in Chardonnay', addGrape: 'chardonnay', proportion: '20%', result: 'Mer kropp och rundhet.' },
  ],
  viognier: [
    { problem: 'För blommig och tung', solution: 'Blanda in Riesling', addGrape: 'riesling', proportion: '20%', result: 'Mer friskhet och syra.' },
    { problem: 'Saknar mineralitet', solution: 'Blanda in Sauvignon Blanc', addGrape: 'sauvignon_blanc', proportion: '20%', result: 'Mer friskhet och gröna toner.' },
  ],
  gewurztraminer: [
    { problem: 'För aromatisk och tung', solution: 'Blanda in Riesling', addGrape: 'riesling', proportion: '30%', result: 'Mer friskhet och syra — klassisk Alsace-stil.' },
    { problem: 'För söt', solution: 'Blanda in Pinot Gris', addGrape: 'pinot_gris', proportion: '25%', result: 'Mer balans och torrare stil.' },
  ],
  pinot_gris: [
    { problem: 'För neutral och tunn', solution: 'Blanda in Gewürztraminer', addGrape: 'gewurztraminer', proportion: '20%', result: 'Mer aromatik och blommighet.' },
    { problem: 'Saknar friskhet', solution: 'Blanda in Riesling', addGrape: 'riesling', proportion: '25%', result: 'Mer syra och mineralitet.' },
  ],
  chenin_blanc: [
    { problem: 'För syrlig', solution: 'Blanda in Viognier', addGrape: 'viognier', proportion: '15-20%', result: 'Mer blommighet och lägre syra.' },
    { problem: 'Saknar komplexitet', solution: 'Blanda in Chardonnay', addGrape: 'chardonnay', proportion: '20%', result: 'Mer kropp och rundhet.' },
  ],
  semillon: [
    { problem: 'För vaxig och tung', solution: 'Blanda in Sauvignon Blanc', addGrape: 'sauvignon_blanc', proportion: '30-40%', result: 'Mer friskhet och gröna toner — klassisk Bordeaux Blanc.' },
    { problem: 'Saknar aromatik', solution: 'Blanda in Viognier', addGrape: 'viognier', proportion: '15%', result: 'Mer blommighet och persikaton.' },
  ],
  albarino: [
    { problem: 'För salt och mineral', solution: 'Blanda in Sauvignon Blanc', addGrape: 'sauvignon_blanc', proportion: '20%', result: 'Mer fruktighet och grönare toner.' },
    { problem: 'Saknar kropp', solution: 'Blanda in Chardonnay', addGrape: 'chardonnay', proportion: '20%', result: 'Mer kropp och rundhet.' },
  ],
};

export default function BlandaPage() {
  const [mode, setMode] = useState<Mode>(null);
  const [selectedGrape, setSelectedGrape] = useState<string>('');
  const [activeType, setActiveType] = useState<'red' | 'white'>('red');
  const [profile, setProfile] = useState({ acidity: 3, body: 3, tannin: 2, sweetness: 1 });

  const filteredGrapes = activeType === 'red' ? redGrapes : whiteGrapes;
  const suggestions = selectedGrape ? (refineSuggestions[selectedGrape] ?? []) : [];

  const matchedBlend = blendSuggestions
    .filter(b => activeType === 'red'
      ? b.grapes.every(g => allGrapes.find(ag => ag.id === g.id)?.type !== 'white')
      : b.grapes.some(g => allGrapes.find(ag => ag.id === g.id)?.type === 'white'))
    .sort((a, b) => {
      const scoreA = Math.abs(a.profile.acidity - profile.acidity) + Math.abs(a.profile.body - profile.body) + Math.abs(a.profile.tannin - profile.tannin);
      const scoreB = Math.abs(b.profile.acidity - profile.acidity) + Math.abs(b.profile.body - profile.body) + Math.abs(b.profile.tannin - profile.tannin);
      return scoreA - scoreB;
    })
    .slice(0, 2);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Blanda ditt vin</h1>
      <p className="text-wine-300 mb-8 leading-relaxed">
        Utforska hur vinmakare skapar blendar — eller få förslag på hur du kan förfina en druva du redan gillar.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => setMode('scratch')}
          className={`p-5 rounded-2xl border text-left transition-all ${mode === 'scratch' ? 'bg-wine-800 border-wine-600' : 'bg-wine-900 border-wine-800 hover:border-wine-600'}`}
        >
          <div className="text-2xl mb-2">🎨</div>
          <div className="font-display text-lg text-wine-50 mb-1">Bygg en blend</div>
          <div className="text-wine-400 text-xs">Välj smakprofil och få förslag på klassiska blendar</div>
        </button>
        <button
          onClick={() => setMode('refine')}
          className={`p-5 rounded-2xl border text-left transition-all ${mode === 'refine' ? 'bg-wine-800 border-wine-600' : 'bg-wine-900 border-wine-800 hover:border-wine-600'}`}
        >
          <div className="text-2xl mb-2">🔧</div>
          <div className="font-display text-lg text-wine-50 mb-1">Förfina en druva</div>
          <div className="text-wine-400 text-xs">Välj en druva och se hur du kan förbättra den</div>
        </button>
      </div>

      {mode === 'scratch' && (
        <div className="space-y-6">
          <div className="flex gap-2 mb-2">
            {(['red', 'white'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeType === t ? 'bg-wine-600 text-white' : 'bg-wine-900 border border-wine-700 text-wine-400'}`}
              >
                {t === 'red' ? '🍷 Röda' : '🥂 Vita'}
              </button>
            ))}
          </div>

          <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800 space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-wine-500">Din smakprofil</h3>
            {[
              { key: 'acidity', label: 'Syra', low: 'Låg', high: 'Hög' },
              { key: 'body', label: 'Kropp', low: 'Lätt', high: 'Fyllig' },
              ...(activeType === 'red' ? [{ key: 'tannin', label: 'Tannin', low: 'Lågt', high: 'Högt' }] : []),
            ].map(({ key, label, low, high }) => (
              <div key={key}>
                <div className="flex justify-between text-xs text-wine-500 mb-1">
                  <span>{label}</span>
                  <span>{profile[key as keyof typeof profile]}/5</span>
                </div>
                <input
                  type="range" min={1} max={5}
                  value={profile[key as keyof typeof profile]}
                  onChange={e => setProfile(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-xs text-wine-600 mt-0.5">
                  <span>{low}</span><span>{high}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-wine-500">Föreslagna blendar</h3>
            {matchedBlend.map(blend => (
              <div key={blend.id} className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                <h4 className="font-display text-lg text-wine-50 mb-3">{blend.name}</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {blend.grapes.map(g => {
                    const grape = allGrapes.find(ag => ag.id === g.id);
                    return (
                      <Link key={g.id} href={`/druvor/${g.id}`} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-200 hover:border-amber-400 transition-colors">
                        {grape?.name} {g.pct}%
                      </Link>
                    );
                  })}
                </div>
                <p className="text-wine-300 text-sm mb-2">{blend.description}</p>
                <p className="text-amber-400 text-xs mb-1">📍 {blend.example}</p>
                <p className="text-emerald-400 text-xs">🍽️ {blend.foodPairing}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'refine' && (
        <div className="space-y-6">
          <div className="flex gap-2 mb-2">
            {(['red', 'white'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setActiveType(t); setSelectedGrape(''); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeType === t ? 'bg-wine-600 text-white' : 'bg-wine-900 border border-wine-700 text-wine-400'}`}
              >
                {t === 'red' ? '🍷 Röda' : '🥂 Vita'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filteredGrapes.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGrape(g.id)}
                className={`p-3 rounded-xl text-sm text-left border transition-all ${selectedGrape === g.id ? 'bg-wine-700 border-wine-500 text-wine-50' : 'bg-wine-900 border-wine-800 text-wine-300 hover:border-wine-600'}`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {selectedGrape && suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-wine-500">Förslag för {allGrapes.find(g => g.id === selectedGrape)?.name}</h3>
              {suggestions.map((s, i) => (
                <div key={i} className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                  <div className="text-rose-300 text-sm font-medium mb-2">⚠️ {s.problem}</div>
                  <div className="text-wine-100 font-medium mb-1">{s.solution}</div>
                  <div className="text-amber-400 text-xs mb-2">Proportion: {s.proportion}</div>
                  <p className="text-wine-300 text-sm">{s.result}</p>
                  <Link href={`/druvor/${s.addGrape}`} className="inline-block mt-3 px-3 py-1 rounded-full text-xs bg-wine-800 border border-wine-700 text-wine-300 hover:border-amber-400 transition-colors">
                    Läs mer om {allGrapes.find(g => g.id === s.addGrape)?.name} →
                  </Link>
                </div>
              ))}
            </div>
          )}

          {selectedGrape && suggestions.length === 0 && (
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800 text-wine-500 text-sm text-center">
              Inga blandningsförslag finns för denna druva ännu.
            </div>
          )}
        </div>
      )}
    </div>
  );
}