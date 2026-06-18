'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import grapes from '@/data/grapes.json';
import aromas from '@/data/aromas.json';
import foodPairings from '@/data/foodPairings.json';
import { Grape, Aroma } from '@/types';
import StructureBar from '@/components/StructureBar';

const allGrapes = grapes as Grape[];
const allAromas = aromas as Aroma[];
const allFood = foodPairings as Record<string, { pairings: string[]; tip: string }>;

const structureKeys: Array<{ key: keyof Grape['structure']; label: string; color: string }> = [
  { key: 'acidity', label: 'Syra', color: 'bg-sky-500' },
  { key: 'body', label: 'Kropp', color: 'bg-amber-500' },
  { key: 'alcohol', label: 'Alkohol', color: 'bg-orange-500' },
  { key: 'tannin', label: 'Tannin', color: 'bg-wine-600' },
  { key: 'sweetness', label: 'Sötma', color: 'bg-pink-400' },
  { key: 'oak', label: 'Ek', color: 'bg-stone-500' },
];

export default function GrapePage() {
  const params = useParams();
  const id = params?.id as string;
  const grape = allGrapes.find((g) => g.id === id);

  const [logCount, setLogCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vinlar_logg');
      if (!raw) { setLogCount(0); return; }
      const logs: { grapeId: string }[] = JSON.parse(raw);
      setLogCount(logs.filter(l => l.grapeId === id).length);
    } catch { setLogCount(0); }
  }, [id]);

  if (!grape) return notFound();

  const isWhite = grape.type === 'white';
  const isSparkling = grape.type === 'sparkling';
  const icon = isSparkling ? '🍾' : isWhite ? '🥂' : '🍷';

  const topAromas = Object.entries(grape.aromaScores)
    .filter(([, score]) => score >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const aromaMap = Object.fromEntries(allAromas.map((a) => [a.id, a]));
  const food = allFood[id];

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
     <div className="flex items-center justify-between mb-6">
        <Link href="/druvor" className="text-wine-400 text-sm hover:text-wine-200 flex items-center gap-1">
          ← Alla druvor
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/aromhjul?druva=${grape.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-wine-900 border border-wine-700 text-wine-300 text-sm hover:border-wine-500 hover:text-wine-100 transition-colors"
          >
            🌸 Aromhjul
          </Link>
          <Link
            href={`/prova?druva=${grape.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-wine-600 border border-wine-600 text-white text-sm hover:bg-wine-500 transition-colors"
          >
            🍷 Prova
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{icon}</span>
          <h1 className="font-display text-4xl text-wine-50">{grape.name}</h1>
        </div>
        <p className="text-wine-300 leading-relaxed">{grape.shortDescription}</p>
      </div>

      <section className="mb-8 bg-wine-900 rounded-2xl p-5 border border-wine-800">
        <h2 className="font-display text-xl text-wine-100 mb-4">Smakstruktur</h2>
        <div className="space-y-3">
          {structureKeys.map(({ key, label, color }) =>
            grape.structure[key] > 0 ? (
              <StructureBar key={key} label={label} value={grape.structure[key]} color={color} />
            ) : null
          )}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-xl text-wine-100 mb-4">Typiska aromer</h2>
        <div className="flex flex-wrap gap-2">
          {topAromas.map(([aromaId, score]) => {
            const aroma = aromaMap[aromaId];
            if (!aroma) return null;
            return (
              <div
                key={aromaId}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                  score === 5
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                    : score === 4
                    ? 'bg-wine-700/50 border-wine-600 text-wine-200'
                    : 'bg-wine-900 border-wine-700 text-wine-300'
                }`}
              >
                <span>{aroma.emoji}</span>
                <span>{aroma.name}</span>
                {score === 5 && <span className="text-xs text-amber-400">★</span>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-xl text-wine-100 mb-4">Vanliga regioner & stilar</h2>
        <div className="space-y-3">
          {grape.commonRegionsAndStyles.map((region) => (
            <div key={region.name} className="bg-wine-900 rounded-xl p-4 border border-wine-800">
              <div className="font-medium text-wine-100 mb-1">🗺️ {region.name}</div>
              <div className="text-sm text-wine-400 leading-relaxed">{region.description}</div>
            </div>
          ))}
        </div>
      </section>

      {food && (
        <section className="mb-8">
          <h2 className="font-display text-xl text-wine-100 mb-4">🍽️ Passar till</h2>
          <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
            <div className="flex flex-wrap gap-2 mb-4">
              {food.pairings.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-full text-sm bg-emerald-900/30 border border-emerald-700/50 text-emerald-300"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-wine-400 text-sm leading-relaxed italic">{food.tip}</p>
          </div>
        </section>
      )}

      {/* Vinlogg-badge */}
      {logCount !== null && (
        <div className="mb-8">
          {logCount === 0 ? (
            <Link
              href="/logg"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-600 transition-colors text-sm text-wine-500"
            >
              <span>📓</span>
              <span>Logga ett vin med denna druva</span>
              <span>→</span>
            </Link>
          ) : (
            <Link
              href={`/logg?druva=${grape.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wine-800 border border-wine-600 hover:border-amber-400 transition-colors text-sm text-wine-200"
            >
              <span className="text-amber-400 font-bold">{logCount}×</span>
              <span>Du har loggat denna druva — se dina anteckningar</span>
              <span className="text-wine-500">→</span>
            </Link>
          )}
        </div>
      )}

      <section className="mb-8">
        <h2 className="font-display text-xl text-wine-100 mb-4">🔍 Blindprovningsledtrådar</h2>
        <ul className="space-y-2">
          {grape.blindTastingClues.map((clue) => (
            <li key={clue} className="flex items-start gap-2 text-wine-300 text-sm">
              <span className="text-amber-400 mt-0.5">→</span>
              {clue}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-xl text-wine-100 mb-3">🔗 Relaterade druvor</h2>
        <div className="flex flex-wrap gap-2">
          {grape.commonConfusions.map((name) => {
            const match = allGrapes.find((g) => g.name === name || g.name.includes(name) || name.includes(g.name.split('/')[0].trim()));
            return match ? (
              <Link
                key={name}
                href={`/druvor/${match.id}`}
                className="px-3 py-1.5 rounded-full bg-wine-900 border border-wine-700 text-wine-300 text-sm hover:border-wine-500 hover:text-wine-100 transition-colors"
              >
                {name}
              </Link>
            ) : (
              <span key={name} className="px-3 py-1.5 rounded-full bg-wine-900 border border-wine-700 text-wine-400 text-sm">
                {name}
              </span>
            );
          })}
        </div>
      </section>
    </div>
  );
}
