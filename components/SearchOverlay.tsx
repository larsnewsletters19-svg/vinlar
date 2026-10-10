'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { runSearch, type SearchResult } from '@/lib/searchIndex';
import regions from '@/data/regions.json';
import { findMapTarget, searchMapTargets, type MapTarget } from '@/lib/mapLookup';

const SECTION_ORDER = ['Sidor', 'Druvor', 'Ordlista', 'Regioner', 'Mat & Vin', 'Servering'];

// Länk som öppnar regionsidan med kartan inzoomad på platsen.
// "t" gör länken unik så att kartan reagerar även vid upprepad sökning.
function mapHref(target: MapTarget) {
  const params = new URLSearchParams({ map: target.regionId, t: String(Date.now()) });
  if (target.pointName) params.set('point', target.pointName);
  return `/regioner?${params.toString()}`;
}

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = runSearch(query);
  const grouped = SECTION_ORDER
    .map((section) => ({ section, items: results.filter((r) => r.section === section) }))
    .filter((g) => g.items.length > 0);

  // Platser på kartan som inte redan finns bland regionträffarna (t.ex. Pauillac)
  const regionTitles = new Set(
    results.filter((r) => r.section === 'Regioner').map((r) => r.title.toLowerCase()),
  );
  const mapOnly = searchMapTargets(query, regions)
    .filter((t) => !regionTitles.has(t.label.toLowerCase()))
    .slice(0, 8);

  const hasAnything = results.length > 0 || mapOnly.length > 0;

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
              ) : !hasAnything ? (
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
                        <ResultRow
                          key={item.id}
                          item={item}
                          mapTarget={item.section === 'Regioner' ? findMapTarget(item.title, regions) : null}
                          onNavigate={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  ))}

                  {mapOnly.length > 0 && (
                    <div className="mb-2 last:mb-0">
                      <div className="px-4 py-1 text-[10px] uppercase tracking-widest text-wine-600 font-mono">
                        På kartan
                      </div>
                      {mapOnly.map((t) => (
                        <Link
                          key={`${t.regionId}-${t.label}`}
                          href={mapHref(t)}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-wine-900 transition-colors"
                        >
                          <span className="text-xl shrink-0">📍</span>
                          <div className="min-w-0">
                            <div className="text-wine-100 text-sm font-medium truncate">{t.label}</div>
                            <div className="text-wine-500 text-xs truncate">{t.sublabel} · visa på kartan</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ResultRow({
  item,
  mapTarget,
  onNavigate,
}: {
  item: SearchResult;
  mapTarget: MapTarget | null;
  onNavigate: () => void;
}) {
  return (
    <div className="flex items-center hover:bg-wine-900 transition-colors">
      <Link href={item.href} onClick={onNavigate} className="flex flex-1 min-w-0 items-center gap-3 px-4 py-2.5">
        <span className="text-xl shrink-0">{item.emoji}</span>
        <div className="min-w-0">
          <div className="text-wine-100 text-sm font-medium truncate">{item.title}</div>
          <div className="text-wine-500 text-xs truncate">{item.subtitle}</div>
        </div>
      </Link>
      {mapTarget && (
        <Link
          href={mapHref(mapTarget)}
          onClick={onNavigate}
          aria-label={`Visa ${item.title} på kartan`}
          className="shrink-0 mr-3 px-2.5 py-1 rounded-full text-xs bg-wine-900 border border-wine-700 text-wine-300 hover:border-wine-500 hover:text-wine-100"
        >
          📍 Karta
        </Link>
      )}
    </div>
  );
}
