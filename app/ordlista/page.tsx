'use client';

import { useState } from 'react';
import glossary from '@/data/glossary.json';

const allTerms = glossary;

const categories = [
  { id: 'all',                      label: 'Alla',                  emoji: '📚' },
  { id: 'Smak & struktur',          label: 'Smak & struktur',       emoji: '👅' },
  { id: 'Vinmakning',               label: 'Vinmakning',            emoji: '🍷' },
  { id: 'Odling & geografi',        label: 'Odling',                emoji: '🌍' },
  { id: 'Servering',                label: 'Servering',             emoji: '🫗' },
  { id: 'Sötma & stil',             label: 'Sötma & stil',          emoji: '🍯' },
  { id: 'Klassificering',           label: 'Klassificering',        emoji: '🏆' },
  { id: 'Provning & terminologi',   label: 'Provning',              emoji: '🔍' },
  { id: 'Druvstilar & tekniker',    label: 'Druvstilar',            emoji: '⚗️' },
];

export default function OrdlistaPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = allTerms.filter((term) => {
    const matchCat = category === 'all' || term.category === category;
    const matchSearch =
      term.term.toLowerCase().includes(search.toLowerCase()) ||
      term.short.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = categories
    .filter((c) => c.id !== 'all')
    .map((c) => ({
      ...c,
      terms: filtered.filter((t) => t.category === c.id),
    }))
    .filter((c) => c.terms.length > 0);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-wine-500 mb-1">
          {allTerms.length} begrepp
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-wine-100 leading-tight mb-2">Ordlista</h1>
        <p className="text-wine-300 text-sm leading-relaxed">
          Förklaringar av vanliga vinbegrepp — från syra och tannin till terroir och degorjering.
        </p>
      </div>

      {/* Sök */}
      <input
        type="text"
        placeholder="Sök begrepp..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCategory('all'); }}
        className="w-full bg-wine-900 border border-wine-700 text-wine-100 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:border-amber-400 placeholder-wine-600"
      />

      {/* Kategorifilter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategory(cat.id); setSearch(''); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              category === cat.id
                ? 'bg-wine-600 border-wine-600 text-white'
                : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Termer */}
      {category === 'all' && !search ? (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.id}>
              <h2 className="font-display text-xl text-wine-200 mb-3 flex items-center gap-2">
                <span>{group.emoji}</span> {group.label}
                <span className="text-wine-600 text-sm font-sans font-normal">— {group.terms.length} begrepp</span>
              </h2>
              <div className="space-y-2">
                {group.terms.map((term) => (
                  <TermCard
                    key={term.id}
                    term={term}
                    expanded={expanded === term.id}
                    onToggle={() => setExpanded(expanded === term.id ? null : term.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.length > 0 && (
            <div className="text-wine-500 text-xs font-mono mb-3">{filtered.length} träffar</div>
          )}
          {filtered.map((term) => (
            <TermCard
              key={term.id}
              term={term}
              expanded={expanded === term.id}
              onToggle={() => setExpanded(expanded === term.id ? null : term.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-wine-500 py-8">Inga begrepp matchar sökningen.</div>
          )}
        </div>
      )}
    </div>
  );
}

function TermCard({
  term,
  expanded,
  onToggle,
}: {
  term: typeof glossary[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left bg-wine-900 rounded-xl border border-wine-800 hover:border-wine-600 transition-all overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <span className="font-display text-wine-100 text-lg">{term.term}</span>
          {!expanded && (
            <span className="text-wine-500 text-sm ml-3">{term.short}</span>
          )}
        </div>
        <span className="text-wine-500 text-lg ml-2">{expanded ? '↑' : '↓'}</span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-wine-800 pt-3">
          <p className="text-wine-300 text-sm leading-relaxed mb-2">{term.short}</p>
          <p className="text-wine-400 text-sm leading-relaxed">{term.full}</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-wine-800 text-wine-500">
            {term.category}
          </span>
        </div>
      )}
    </button>
  );
}
