'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import grapes from '@/data/grapes.json';

// ─── Typer ────────────────────────────────────────────────────────────────────
interface WineLog {
  id: string;
  grapeId: string;
  grapeName: string;
  grapeType: string;
  date: string;
  rating: number;
  producer?: string;
  region?: string;
  vintage?: string;
  notes?: string;
  food?: string;
}

// ─── Druvkonfiguration ────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  white: 'Vita druvor',
  red: 'Röda druvor',
  rosé: 'Rosé',
  sparkling: 'Mousserande',
  sweet: 'Söta & förstärkta',
};

const TYPE_ORDER = ['white', 'red', 'rosé', 'sparkling', 'sweet'];

const TYPE_COLOR: Record<string, string> = {
  white: 'bg-amber-900/40 text-amber-200 border-amber-700/50',
  red: 'bg-wine-900/60 text-wine-200 border-wine-600/50',
  rosé: 'bg-pink-900/40 text-pink-200 border-pink-700/50',
  sparkling: 'bg-teal-900/40 text-teal-200 border-teal-700/50',
  sweet: 'bg-yellow-900/40 text-yellow-200 border-yellow-700/50',
};

const allGrapes = grapes as { id: string; name: string; type: string }[];
const grapesByType = TYPE_ORDER.reduce((acc, type) => {
  acc[type] = allGrapes
    .filter(g => g.type === type)
    .sort((a, b) => a.name.localeCompare(b.name));
  return acc;
}, {} as Record<string, typeof allGrapes>);

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = 'vinlar_logg';

function loadLogs(): WineLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLogs(logs: WineLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

// ─── Betyg-komponent ──────────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${star <= value ? 'text-amber-400' : 'text-wine-700 hover:text-amber-600'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Loggkort ─────────────────────────────────────────────────────────────────
function LogCard({ log, onDelete }: { log: WineLog; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = TYPE_COLOR[log.grapeType] ?? TYPE_COLOR.red;

  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/druvor/${log.grapeId}`}
              className="font-display text-lg leading-tight hover:opacity-80 transition-opacity"
            >
              {log.grapeName}
            </Link>
            <span className="text-amber-400 text-sm">{'★'.repeat(log.rating)}{'☆'.repeat(5 - log.rating)}</span>
          </div>
          {log.producer && <div className="text-sm opacity-80 mt-0.5">{log.producer}</div>}
          <div className="text-xs opacity-60 mt-1 flex gap-3 flex-wrap">
            <span>📅 {log.date}</span>
            {log.region && <span>📍 {log.region}</span>}
            {log.vintage && <span>🍷 {log.vintage}</span>}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm opacity-50 hover:opacity-100 shrink-0"
        >
          {expanded ? '↑' : '↓'}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          {log.food && (
            <div className="text-sm">
              <span className="opacity-60">🍽️ Mat: </span>
              <span className="opacity-90">{log.food}</span>
            </div>
          )}
          {log.notes && (
            <div className="text-sm">
              <span className="opacity-60">📝 </span>
              <span className="opacity-90 italic">{log.notes}</span>
            </div>
          )}
          <button
            onClick={onDelete}
            className="text-xs opacity-40 hover:opacity-80 hover:text-red-400 transition-colors mt-1"
          >
            Ta bort
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Formulär ─────────────────────────────────────────────────────────────────
function LogForm({ onSave }: { onSave: (log: WineLog) => void }) {
  const today = new Date().toISOString().split('T')[0];
  const [grapeId, setGrapeId] = useState('');
  const [grapeTypeFilter, setGrapeTypeFilter] = useState('all');
  const [date, setDate] = useState(today);
  const [rating, setRating] = useState(0);
  const [producer, setProducer] = useState('');
  const [region, setRegion] = useState('');
  const [vintage, setVintage] = useState('');
  const [notes, setNotes] = useState('');
  const [food, setFood] = useState('');
  const [error, setError] = useState('');

  const selectedGrape = allGrapes.find(g => g.id === grapeId);

  function handleSubmit() {
    if (!grapeId) { setError('Välj en druva'); return; }
    if (!rating) { setError('Sätt ett betyg'); return; }
    setError('');

    const log: WineLog = {
      id: Date.now().toString(),
      grapeId,
      grapeName: selectedGrape!.name,
      grapeType: selectedGrape!.type,
      date,
      rating,
      ...(producer && { producer }),
      ...(region && { region }),
      ...(vintage && { vintage }),
      ...(notes && { notes }),
      ...(food && { food }),
    };

    onSave(log);

    // Reset
    setGrapeId('');
    setRating(0);
    setProducer('');
    setRegion('');
    setVintage('');
    setNotes('');
    setFood('');
    setDate(today);
  }

  const inputClass = "w-full bg-wine-900 border border-wine-700 text-wine-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 placeholder-wine-600";
  const labelClass = "text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-1 block";

  return (
    <div className="bg-wine-900/60 border border-wine-800 rounded-2xl p-5 mb-8">
      <div className="text-sm font-display text-wine-200 mb-4 text-lg">Logga ett vin</div>

      {/* Druva — obligatorisk */}
      <div className="mb-4">
        <label className={labelClass}>Druva *</label>

        {/* Typfilter */}
        <div className="flex gap-1.5 flex-wrap mb-2">
          {['all', ...TYPE_ORDER].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => { setGrapeTypeFilter(type); setGrapeId(''); }}
              className={`px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${
                grapeTypeFilter === type
                  ? 'bg-wine-600 border-wine-600 text-white'
                  : 'bg-wine-900 border-wine-700 text-wine-500 hover:border-wine-500'
              }`}
            >
              {type === 'all' ? 'Alla' : TYPE_LABELS[type].split(' ')[0]}
            </button>
          ))}
        </div>

        <select
          value={grapeId}
          onChange={e => setGrapeId(e.target.value)}
          className={inputClass}
        >
          <option value="">Välj druva...</option>
          {grapeTypeFilter === 'all'
            ? TYPE_ORDER.map(type => (
                <optgroup key={type} label={TYPE_LABELS[type]}>
                  {grapesByType[type].map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </optgroup>
              ))
            : grapesByType[grapeTypeFilter]?.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))
          }
        </select>
      </div>

      {/* Betyg — obligatoriskt */}
      <div className="mb-4">
        <label className={labelClass}>Betyg *</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Datum */}
      <div className="mb-4">
        <label className={labelClass}>Datum</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Valfria fält */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className={labelClass}>Producent</label>
          <input
            type="text"
            value={producer}
            onChange={e => setProducer(e.target.value)}
            placeholder="t.ex. Gaja"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Årgång</label>
          <input
            type="text"
            value={vintage}
            onChange={e => setVintage(e.target.value)}
            placeholder="t.ex. 2019"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClass}>Region</label>
        <input
          type="text"
          value={region}
          onChange={e => setRegion(e.target.value)}
          placeholder="t.ex. Barolo, Piemonte"
          className={inputClass}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass}>Mat du åt till</label>
        <input
          type="text"
          value={food}
          onChange={e => setFood(e.target.value)}
          placeholder="t.ex. grillad lax"
          className={inputClass}
        />
      </div>

      <div className="mb-5">
        <label className={labelClass}>Anteckningar</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Dina egna ord om vinet..."
          rows={3}
          className={inputClass + ' resize-none'}
        />
      </div>

      {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

      <button
        onClick={handleSubmit}
        className="w-full bg-wine-600 hover:bg-wine-500 text-white rounded-xl py-3 text-sm font-medium transition-colors"
      >
        Logga vinet
      </button>
    </div>
  );
}

// ─── Statistik ────────────────────────────────────────────────────────────────
function Stats({ logs }: { logs: WineLog[] }) {
  if (logs.length === 0) return null;

  const byGrape = logs.reduce((acc, l) => {
    acc[l.grapeName] = (acc[l.grapeName] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topGrape = Object.entries(byGrape).sort((a, b) => b[1] - a[1])[0];
  const avgRating = (logs.reduce((s, l) => s + l.rating, 0) / logs.length).toFixed(1);

  const byType = logs.reduce((acc, l) => {
    acc[l.grapeType] = (acc[l.grapeType] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: 'Viner loggade', value: logs.length },
        { label: 'Snittbetyg', value: `${avgRating} ★` },
        { label: 'Favorittyp', value: TYPE_LABELS[topType[0]]?.split(' ')[0] ?? '—' },
      ].map(s => (
        <div key={s.label} className="bg-wine-900/50 border border-wine-800 rounded-xl p-3 text-center">
          <div className="font-display text-2xl text-wine-100">{s.value}</div>
          <div className="text-[10px] font-mono text-wine-500 uppercase tracking-wide mt-1">{s.label}</div>
        </div>
      ))}
      {topGrape && (
        <div className="col-span-3 bg-wine-900/50 border border-wine-800 rounded-xl p-3 text-center">
          <div className="text-[10px] font-mono text-wine-500 uppercase tracking-wide mb-1">Mest loggad druva</div>
          <div className="font-display text-wine-100">{topGrape[0]} — {topGrape[1]} gånger</div>
        </div>
      )}
    </div>
  );
}

// ─── Huvudsida ────────────────────────────────────────────────────────────────
function LoggPageInner() {
  const searchParams = useSearchParams();
  const druvaParam = searchParams.get('druva');
  const [logs, setLogs] = useState<WineLog[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [grapeFilter, setGrapeFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(!druvaParam);

  useEffect(() => {
    setLogs(loadLogs());
    if (druvaParam) setGrapeFilter(druvaParam);
  }, [druvaParam]);

  function handleSave(log: WineLog) {
    const updated = [log, ...logs];
    setLogs(updated);
    saveLogs(updated);
    setShowForm(false);
  }

  function handleDelete(id: string) {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    saveLogs(updated);
  }

  const filtered = logs
    .filter(l => filter === 'all' || l.grapeType === filter)
    .filter(l => !grapeFilter || l.grapeId === grapeFilter);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-wine-500 mb-1">
          {logs.length} viner loggade
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-wine-100 leading-tight mb-2">
          Min vinlogg
        </h1>
        <p className="text-wine-300 text-sm leading-relaxed max-w-xl">
          Din personliga vinbok. Logga vad du dricker — appen minns åt dig.
        </p>
      </div>

      {/* Formulär toggle */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full mb-4 py-3 rounded-xl border border-wine-700 text-wine-300 hover:border-wine-500 hover:text-wine-100 transition-all text-sm font-medium"
      >
        {showForm ? '↑ Dölj formulär' : '+ Logga ett nytt vin'}
      </button>

      {showForm && <LogForm onSave={handleSave} />}

      <Stats logs={logs} />

      {/* Filter */}
      {logs.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {['all', ...TYPE_ORDER].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                filter === type
                  ? 'bg-wine-600 border-wine-600 text-white'
                  : 'bg-wine-900 border-wine-800 text-wine-500 hover:border-wine-600'
              }`}
            >
              {type === 'all' ? 'Alla' : TYPE_LABELS[type].split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Aktiv druvafilter */}
      {grapeFilter && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-wine-800 border border-wine-700 text-sm">
          <span className="text-wine-400">Visar loggar för:</span>
          <span className="text-wine-100 font-medium">{allGrapes.find(g => g.id === grapeFilter)?.name}</span>
          <button onClick={() => setGrapeFilter(null)} className="ml-auto text-wine-600 hover:text-wine-300">× Rensa</button>
        </div>
      )}

      {/* Loggar */}
      <div className="space-y-3">
        {filtered.map(log => (
          <LogCard
            key={log.id}
            log={log}
            onDelete={() => handleDelete(log.id)}
          />
        ))}
        {filtered.length === 0 && logs.length === 0 && (
          <div className="text-center text-wine-600 py-12 font-mono text-sm">
            Inga viner loggade ännu.<br />Logga ditt första vin ovan.
          </div>
        )}
      </div>

      <p className="text-[10px] text-wine-700 font-mono mt-8 border-t border-wine-900 pt-4">
        Loggen sparas lokalt i din webbläsare. Rensa inte webbläsardata om du vill behålla din historik.
      </p>
    </div>
  );
}

export default function LoggPage() {
  return (
    <Suspense fallback={<div className="px-4 py-8 text-wine-500">Laddar...</div>}>
      <LoggPageInner />
    </Suspense>
  );
}
