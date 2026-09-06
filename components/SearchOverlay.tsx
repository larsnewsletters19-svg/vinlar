'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { runSearch, type SearchResult } from '@/lib/searchIndex';

const SECTION_ORDER = ['Sidor', 'Druvor', 'Ordlista', 'Regioner', 'Mat & Vin', 'Servering'];

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = runSearch(query);
  const grouped = SECTION_ORDER
    .map((section) => ({ section, items: results.filter((r) => r.section === section) }))
    .filter((g) => g.items.length > 0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Flytande sökknapp */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Sök"
        className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-white border border-[#f4a9b9] text-[#791d38] rounded-full px-4 py-2.5 shadow-lg hover:border-[#ab2144] hover:text-[#420d1d] transition-all md:top-6 md:right-6"
      >
        <span className="text-base">🔍</span>
        <span className="hidden sm:inline text-sm font-medium">Sök</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center px-4 pt-16 sm:pt-24"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-wine-950 border border-wine-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-wine-800">
              <span className="text-wine-500 text-lg">🔍</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök druvor, termer, regioner, mat..."
                className="flex-1 bg-transparent outline-none text-wine-100 placeholder:text-wine-600 text-base"
              />
              <button
                onClick={() => setOpen(false)}
                className="text-wine-500 hover:text-wine-200 text-sm font-mono px-2 py-1 rounded border border-wine-800"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === '' ? (
                <div className="px-4 py-8 text-center text-wine-500 text-sm">
                  Börja skriva för att söka i hela appen.
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-8 text-center text-wine-500 text-sm">
                  Inga träffar på &quot;{query}&quot;.
                </div>
              ) : (
                <div className="py-2">
                  {grouped.map((group) => (
                    <div key={group.section} className="mb-2 last:mb-0">
                      <div className="px-4 py-1 text-[10px] uppercase tracking-widest text-wine-600 font-mono">
                        {group.section}
                      </div>
                      {group.items.map((item) => (
                        <ResultRow key={item.id} item={item} onNavigate={() => setOpen(false)} />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ResultRow({ item, onNavigate }: { item: SearchResult; onNavigate: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-wine-900 transition-colors"
    >
      <span className="text-xl shrink-0">{item.emoji}</span>
      <div className="min-w-0">
        <div className="text-wine-100 text-sm font-medium truncate">{item.title}</div>
        <div className="text-wine-500 text-xs truncate">{item.subtitle}</div>
      </div>
    </Link>
  );
}
