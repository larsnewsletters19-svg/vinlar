'use client';

import { useState } from 'react';
import regions from '@/data/regions.json';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';
const allGrapes = grapes as Grape[];

const allRegions = regions;

const countries = [
  { id: 'all', label: 'Alla', emoji: '🌍' },
  { id: 'france', label: 'Frankrike', emoji: '🇫🇷' },
  { id: 'italy', label: 'Italien', emoji: '🇮🇹' },
  { id: 'spain', label: 'Spanien', emoji: '🇪🇸' },
  { id: 'germany', label: 'Tyskland & Österrike', emoji: '🇩🇪' },
  { id: 'portugal', label: 'Portugal', emoji: '🇵🇹' },
  { id: 'newworld', label: 'Nya världen', emoji: '🌏' },
];

export default function RegionerPage() {
  const [activeCountry, setActiveCountry] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = activeCountry === 'all'
    ? allRegions
    : allRegions.filter((r) => r.countryId === activeCountry);

  const activeRegion = selected ? allRegions.find((r) => r.id === selected) : null;

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Regioner</h1>
      <p className="text-wine-300 mb-6 leading-relaxed">
        Utforska världens viktigaste vinregioner — druvor, stil, mat och blindprovningstips.
      </p>

      {!activeRegion ? (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => setActiveCountry(country.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeCountry === country.id
                    ? 'bg-wine-600 border-wine-600 text-white'
                    : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
                }`}
              >
                {country.emoji} {country.label}
              </button>
            ))}
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((region) => (
              <li key={region.id}>
                <button
                  onClick={() => setSelected(region.id)}
                  className="w-full text-left p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{region.emoji}</span>
                    <div className="font-display text-lg text-wine-100">{region.name}</div>
                  </div>
                  <div className="text-xs text-wine-500 mb-2">{region.country}</div>
                  <div className="text-sm text-wine-400 line-clamp-2 leading-snug">{region.shortDescription}</div>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <button onClick={() => setSelected(null)} className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1 mb-6">
            ← Alla regioner
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{activeRegion.emoji}</span>
            <h2 className="font-display text-3xl text-wine-50">{activeRegion.name}</h2>
          </div>
          <div className="text-wine-500 text-sm mb-4">{activeRegion.country}</div>
          <p className="text-wine-300 leading-relaxed mb-6">{activeRegion.shortDescription}</p>

          <div className="space-y-4">
            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">🍇 Viktigaste druvor</h3>
              <div className="flex flex-wrap gap-2">
                {activeRegion.mainGrapes.map((grape) => {
                  const match = allGrapes.find((g) => g.name === grape || g.name.includes(grape) || grape.includes(g.name.split('/')[0].trim()));
                  return match ? (
                    <a key={grape} href={`/druvor/${match.id}`} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-200 hover:border-wine-500 hover:text-wine-50 transition-colors">
                      {grape}
                    </a>
                  ) : (
                    <span key={grape} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-200">
                      {grape}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">🍷 Typisk stil</h3>
              <p className="text-wine-200 text-sm leading-relaxed">{activeRegion.typicalStyle}</p>
            </div>

            {activeRegion.subRegions.length > 0 && (
              <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">🗺️ Delregioner</h3>
                <div className="flex flex-wrap gap-2">
                  {activeRegion.subRegions.map((sub) => (
                    <span key={sub} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-400">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">🌡️ Klimat & jord</h3>
              <p className="text-wine-300 text-sm mb-2"><span className="text-wine-500">Klimat:</span> {activeRegion.climate}</p>
              <p className="text-wine-300 text-sm"><span className="text-wine-500">Jord:</span> {activeRegion.soil}</p>
            </div>

            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">🍽️ Passar till</h3>
              <div className="flex flex-wrap gap-2">
                {activeRegion.foodPairings.map((food) => (
                  <span key={food} className="px-3 py-1 rounded-full text-sm bg-emerald-900/30 border border-emerald-700/50 text-emerald-300">
                    {food}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-amber-900/20 rounded-2xl p-5 border border-amber-800/40">
              <h3 className="text-xs uppercase tracking-widest text-amber-500 mb-3">🔍 Blindprovningstips</h3>
              <ul className="space-y-2">
                {activeRegion.blindTastingClues.map((clue) => (
                  <li key={clue} className="flex items-start gap-2 text-wine-200 text-sm">
                    <span className="text-amber-400 mt-0.5">→</span> {clue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
              <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">⭐ Kända producenter</h3>
              <div className="flex flex-wrap gap-2">
                {activeRegion.famousProducers.map((producer) => (
                  <span key={producer} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-300">
                    {producer}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}