import Link from 'next/link';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';

const allGrapes = grapes as Grape[];

export default function DruvorPage() {
  const white = allGrapes.filter((g) => g.type === 'white');
  const red = allGrapes.filter((g) => g.type === 'red');
  const sparkling = allGrapes.filter((g) => g.type === 'sparkling');

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Druvor</h1>
      <p className="text-wine-300 mb-8 leading-relaxed">
        Välj en druva för att se dess typiska aromer, smakstruktur och blindprovningstips.
      </p>

      <section className="mb-10">
        <h2 className="font-display text-2xl text-wine-200 mb-4 flex items-center gap-2">
          <span>🥂</span> Vita druvor
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {white.map((grape) => <GrapeCard key={grape.id} grape={grape} />)}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-2xl text-wine-200 mb-4 flex items-center gap-2">
          <span>🍷</span> Röda druvor
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {red.map((grape) => <GrapeCard key={grape.id} grape={grape} />)}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-wine-200 mb-4 flex items-center gap-2">
          <span>🍾</span> Mousserande
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sparkling.map((grape) => <GrapeCard key={grape.id} grape={grape} />)}
        </ul>
      </section>
    </div>
  );
}

function GrapeCard({ grape }: { grape: Grape }) {
  const icon = grape.type === 'white' ? '🥂' : grape.type === 'sparkling' ? '🍾' : '🍷';
  return (
    <li>
      <Link
        href={`/druvor/${grape.id}`}
        className="flex items-start gap-3 p-4 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all active:scale-[0.99] block"
      >
        <span className="text-2xl mt-0.5">{icon}</span>
        <div>
          <div className="font-display text-lg text-wine-50">{grape.name}</div>
          <div className="text-xs text-wine-400 mt-0.5 line-clamp-2 leading-snug">
            {grape.shortDescription}
          </div>
        </div>
      </Link>
    </li>
  );
}