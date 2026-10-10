'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import regions from '@/data/regions.json';
import grapes from '@/data/grapes.json';
import vintages from '@/data/vintages.json';
import { Grape } from '@/types';
import { findSubRegionProfile } from '@/lib/searchIndex';
import dynamic from 'next/dynamic';
const RegionMap = dynamic(() => import('@/components/RegionMap'), { ssr: false });
import TerroirInfo from '@/components/TerroirInfo';
import { findMapTarget, hasMapLocation, type MapFocus, type MapTarget } from '@/lib/mapLookup';

const allRegions = regions;
const allGrapes = grapes as Grape[];
const allVintages = vintages as Record<string, { year: number; rating: number; character: string; highlights: string }[]>;

const countries = [
  { id: 'all',          label: 'Alla',              emoji: '🌍', filter: 'all' },
  { id: 'france',       label: 'Frankrike',         emoji: '🇫🇷', filter: 'countryId' },
  { id: 'italy',        label: 'Italien',           emoji: '🇮🇹', filter: 'countryId' },
  { id: 'spain',        label: 'Spanien',           emoji: '🇪🇸', filter: 'countryId' },
  { id: 'germany',      label: 'Tyskland & Österrike', emoji: '🇩🇪', filter: 'countryId' },
  { id: 'portugal',     label: 'Portugal',          emoji: '🇵🇹', filter: 'countryId' },
  { id: 'hungary',      label: 'Ungern',            emoji: '🇭🇺', filter: 'countryId' },
  { id: 'greece',       label: 'Grekland',          emoji: '🇬🇷', filter: 'countryId' },
  { id: 'georgia',      label: 'Georgien',          emoji: '🇬🇪', filter: 'countryId' },
  // Nya världen — egna landfilter
  { id: 'USA',          label: 'USA',               emoji: '🇺🇸', filter: 'country' },
  { id: 'Argentina',    label: 'Argentina',         emoji: '🇦🇷', filter: 'country' },
  { id: 'Chile',        label: 'Chile',             emoji: '🇨🇱', filter: 'country' },
  { id: 'Australien',   label: 'Australien',        emoji: '🇦🇺', filter: 'country' },
  { id: 'Nya Zeeland',  label: 'Nya Zeeland',       emoji: '🇳🇿', filter: 'country' },
  { id: 'Sydafrika',    label: 'Sydafrika',         emoji: '🇿🇦', filter: 'country' },
  { id: 'Kanada',       label: 'Kanada',            emoji: '🇨🇦', filter: 'country' },
];

// Ny världen-länder som grupp-header
const NEW_WORLD_IDS = ['USA', 'Kanada', 'Argentina', 'Chile', 'Australien', 'Nya Zeeland', 'Sydafrika'];

// Vilket landfilter en region hör till
function countryFilterFor(r: { country: string; countryId: string }) {
  let id = r.countryId;
  if (r.countryId === 'newworld') id = r.country;
  if (r.countryId === 'austria') id = 'germany';
  return countries.some((c) => c.id === id) ? id : 'all';
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-amber-700' : 'text-wine-700'}>★</span>
      ))}
    </div>
  );
}

function RegionerPageInner() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q');
  const mapParam = searchParams.get('map');
  const pointParam = searchParams.get('point');
  const tParam = searchParams.get('t');
  const [activeCountry, setActiveCountry] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [mapFocus, setMapFocus] = useState<MapFocus | null>(null);

  // Visa en region eller underregion på kartan:
  // byt till rätt land, gå till listvyn, zooma in och scrolla till kartan
  const showOnMap = (target: MapTarget) => {
    const region = allRegions.find((r) => r.id === target.regionId);
    if (region) setActiveCountry(countryFilterFor(region));
    setSelected(null);
    setMapFocus({ ...target, key: Date.now() });
    setTimeout(() => document.getElementById('region-map')?.scrollIntoView({ behavior: 'smooth' }), 350);
  };

  useEffect(() => {
    if (qParam && allRegions.some((r) => r.id === qParam)) {
      setSelected(qParam);
    } else if (!qParam) {
      setSelected(null);
    }
  }, [qParam]);

  // Länk från sökningen: /regioner?map=medoc&point=Pauillac
  useEffect(() => {
    if (mapParam && hasMapLocation(mapParam)) {
      showOnMap({ regionId: mapParam, pointName: pointParam ?? undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapParam, pointParam, tParam]);

  const [activeTab, setActiveTab] = useState<'profil' | 'arganger'>('profil');

  const activeDef = countries.find((c) => c.id === activeCountry)!;

  // Alla regioner i valt land, inklusive underregioner (används av kartan)
  const inCountry = useMemo(() => {
    if (activeCountry === 'all') return allRegions;
    if (activeDef.filter === 'country') return allRegions.filter((r) => r.country === activeCountry);
    if (activeCountry === 'germany') return allRegions.filter((r) => r.countryId === 'germany' || r.countryId === 'austria');
    return allRegions.filter((r) => r.countryId === activeCountry);
  }, [activeCountry, activeDef.filter]);

  // Bara huvudregioner (används av korten)
  const filtered = inCountry.filter((r) => !r.parentRegionId);

  const activeRegion = selected ? allRegions.find((r) => r.id === selected) : null;
  const regionVintages = activeRegion ? allVintages[activeRegion.id] : null;

  const chooseCountry = (id: string) => {
    setActiveCountry(id);
    setMapFocus(null);
  };

  return (
    <div className="px-4 py-8 max-w-2xl lg:max-w-5xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Regioner</h1>
      <p className="text-wine-300 mb-6 leading-relaxed">
        Utforska världens viktigaste vinregioner — druvor, stil, mat och blindprovningstips.
      </p>

      {!activeRegion ? (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-2 flex-wrap">
            {countries.filter((c) => !NEW_WORLD_IDS.includes(c.id)).map((country) => (
              <button
                key={country.id}
                onClick={() => chooseCountry(country.id)}
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

          {/* Nya världen-länder som egen rad */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-widest text-wine-600 self-center pr-1">Nya världen:</span>
            {countries.filter((c) => NEW_WORLD_IDS.includes(c.id)).map((country) => (
              <button
                key={country.id}
                onClick={() => chooseCountry(country.id)}
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

          <RegionMap
            regions={inCountry}
            focusRequest={mapFocus}
            onOpenRegion={(id) => { setSelected(id); setActiveTab('profil'); }}
          />

          {/* Regionkort */}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((region) => (
              <li key={region.id}>
                <button
                  onClick={() => { setSelected(region.id); setActiveTab('profil'); }}
                  className="w-full text-left p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 hover:bg-wine-800 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{region.emoji}</span>
                    <div className="font-display text-lg text-wine-100">{region.name}</div>
                  </div>
                  <div className="text-xs text-wine-500 mb-2">{region.country}</div>
                  <div className="text-sm text-wine-400 line-clamp-2 leading-snug">{region.shortDescription}</div>
                  {allVintages[region.id] && (
                    <div className="mt-2 text-xs text-amber-700">📅 Årgångsguide tillgänglig</div>
                  )}
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
          <div className="text-wine-500 text-sm mb-4">
            {activeRegion.country}
            {activeRegion.parentRegionId && (() => {
              const parent = allRegions.find((r) => r.id === activeRegion.parentRegionId);
              return parent ? (
                <>
                  {' · '}
                  <button onClick={() => setSelected(parent.id)} className="text-wine-400 hover:text-amber-800 underline underline-offset-2">
                    Del av {parent.name}
                  </button>
                </>
              ) : null;
            })()}
          </div>
          <TerroirInfo id={activeRegion.id} />

          {hasMapLocation(activeRegion.id) && (
            <button
              onClick={() => showOnMap({ regionId: activeRegion.id })}
              className="mb-6 w-full py-2.5 rounded-xl bg-wine-800 hover:bg-wine-700 border border-wine-700 text-wine-100 text-sm"
            >
              🗺️ Visa {activeRegion.name} på kartan
            </button>
          )}

          <div className="flex gap-1 mb-6 bg-wine-900 p-1 rounded-xl border border-wine-800">
            <button
              onClick={() => setActiveTab('profil')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'profil' ? 'bg-wine-600 text-white' : 'text-wine-400 hover:text-wine-200'}`}
            >
              🗺️ Regionprofil
            </button>
            {regionVintages && (
              <button
                onClick={() => setActiveTab('arganger')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'arganger' ? 'bg-wine-600 text-white' : 'text-wine-400 hover:text-wine-200'}`}
              >
                📅 Årgångar
              </button>
            )}
          </div>

          {activeTab === 'profil' && (
            <>
              <p className="text-wine-300 leading-relaxed mb-6">{activeRegion.shortDescription}</p>
              <div className="space-y-4">
                <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                  <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">🍇 Viktigaste druvor</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeRegion.mainGrapes.map((grape) => {
                      const match = allGrapes.find((g) =>
                        g.name === grape ||
                        g.name.includes(grape) ||
                        grape.includes(g.name.split('/')[0].trim()) ||
                        g.aliases?.some(a => a.toLowerCase() === grape.toLowerCase())
                      );
                      return match ? (
                        <Link key={grape} href={`/druvor/${match.id}`} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-200 hover:border-wine-500 hover:text-wine-50 transition-colors">
                          {grape}
                        </Link>
                      ) : (
                        <span key={grape} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-200">{grape}</span>
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
                      {activeRegion.subRegions.map((sub) => {
                        const profile = findSubRegionProfile(sub, activeRegion.id);
                        const target = findMapTarget(sub, allRegions);
                        return (
                          <span
                            key={sub}
                            className={`inline-flex items-center rounded-full text-sm bg-wine-800 border overflow-hidden ${profile ? 'border-wine-600' : 'border-wine-700'}`}
                          >
                            {profile ? (
                              <button
                                onClick={() => { setSelected(profile.id); setActiveTab('profil'); }}
                                className="px-3 py-1 text-amber-800 hover:bg-wine-700 transition-colors"
                              >
                                {sub} →
                              </button>
                            ) : (
                              <span className="px-3 py-1 text-wine-400">{sub}</span>
                            )}
                            {target && (
                              <button
                                onClick={() => showOnMap(target)}
                                title={`Visa ${sub} på kartan`}
                                aria-label={`Visa ${sub} på kartan`}
                                className="px-2 py-1 border-l border-wine-700 hover:bg-wine-700 transition-colors"
                              >
                                📍
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-xs text-wine-500 mt-3">📍 = visa på kartan</p>
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
                      <span key={food} className="px-3 py-1 rounded-full text-sm bg-emerald-50 border border-emerald-300 text-emerald-800">{food}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-300">
                  <h3 className="text-xs uppercase tracking-widest text-amber-700 mb-3">🔍 Blindprovningstips</h3>
                  <ul className="space-y-2">
                    {activeRegion.blindTastingClues.map((clue) => (
                      <li key={clue} className="flex items-start gap-2 text-wine-200 text-sm">
                        <span className="text-amber-700 mt-0.5">→</span> {clue}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                  <h3 className="text-xs uppercase tracking-widest text-wine-500 mb-3">⭐ Kända producenter</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeRegion.famousProducers.map((producer) => (
                      <span key={producer} className="px-3 py-1 rounded-full text-sm bg-wine-800 border border-wine-700 text-wine-300">{producer}</span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'arganger' && regionVintages && (
            <div className="space-y-3">
              {regionVintages.map((v) => (
                <div key={v.year} className="bg-wine-900 rounded-2xl p-5 border border-wine-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-2xl text-wine-50">{v.year}</span>
                    <RatingStars rating={v.rating} />
                  </div>
                  <p className="text-wine-300 text-sm leading-relaxed mb-2">{v.character}</p>
                  <p className="text-amber-700 text-xs italic">{v.highlights}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RegionerPage() {
  return (
    <Suspense fallback={null}>
      <RegionerPageInner />
    </Suspense>
  );
}
