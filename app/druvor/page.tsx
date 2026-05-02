'use client';

import { useState } from 'react';
import Link from 'next/link';
import grapes from '@/data/grapes.json';
import { Grape } from '@/types';

const allGrapes = grapes as Grape[];

const tabs = [
  { id: 'white', label: 'Vita', emoji: '🥂' },
  { id: 'red', label: 'Röda', emoji: '🍷' },
  { id: 'sparkling', label: 'Mousserande', emoji: '🍾' },
  { id: 'sweet', label: 'Söta & förstärkta', emoji: '🍯' },
];

export default function DruvorPage() {
  const [activeTab, setActiveTab] = useState<'white' | 'red' | 'sparkling' | 'sweet'>('white');
  const filtered = allGrapes.filter((g) => g.type === activeTab);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Druvor</h1>
      <p className="text-wine-300 mb-6 leading-relaxed">
        Välj en druva för att se dess typiska aromer, smakstruktur och blindprovningstips.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-wine-900 p-1 rounded-xl border border-wine-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-wine-600 text-white'
                : 'text-wine-400 hover:text-wine-200'
            }`}
          >
            <span className="mr-1">{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filtered.map((grape) => (
          <GrapeCard key={grape.id} grape={grape} />
        ))}
      </ul>
    </div>
  );
}

function GrapeCard({ grape }: { grape: Grape }) {
  const icon = grape.type === 'white' ? '🥂'
    : grape.type === 'sparkling' ? '🍾'
    : grape.type === 'sweet' ? '🍯'
    : '🍷';

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