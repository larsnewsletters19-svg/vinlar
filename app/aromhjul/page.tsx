'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import grapes from '@/data/grapes.json';
import aromas from '@/data/aromas.json';
import { Grape, Aroma } from '@/types';

const allGrapes = grapes as Grape[];
const allAromas = aromas as Aroma[];

const aromaFamilies = [
  { id: 'citrus', label: 'Citrus', color: '#f59e0b', ids: ['lemon', 'lime', 'grapefruit', 'orange_peel'] },
  { id: 'green_fruit', label: 'Grön frukt', color: '#84cc16', ids: ['green_apple', 'pear'] },
  { id: 'stone_fruit', label: 'Stenfrukt', color: '#f97316', ids: ['peach', 'apricot', 'nectarine'] },
  { id: 'tropical', label: 'Tropisk', color: '#eab308', ids: ['passion_fruit', 'pineapple', 'mango', 'lychee'] },
  { id: 'red_berries', label: 'Röda bär', color: '#f43f5e', ids: ['raspberry', 'strawberry', 'cherry', 'cranberry'] },
  { id: 'dark_berries', label: 'Mörka bär', color: '#7c3aed', ids: ['blackcurrant', 'blackberry', 'blueberry', 'plum'] },
  { id: 'floral', label: 'Blommigt', color: '#ec4899', ids: ['white_flowers', 'rose', 'violet'] },
  { id: 'green', label: 'Grönt/örtigt', color: '#22c55e', ids: ['grass', 'nettles', 'bell_pepper', 'blackcurrant_leaf', 'mint', 'eucalyptus'] },
  { id: 'spicy', label: 'Kryddigt', color: '#ef4444', ids: ['black_pepper', 'white_pepper', 'liquorice'] },
  { id: 'earthy', label: 'Jordigt/min.', color: '#78716c', ids: ['flint', 'chalk', 'slate', 'wet_earth', 'mushroom', 'truffle'] },
  { id: 'oak', label: 'Fat/ek', color: '#a16207', ids: ['vanilla', 'butter', 'toast', 'coconut', 'nuts', 'coffee', 'chocolate'] },
  { id: 'development', label: 'Mognad', color: '#6b7280', ids: ['petrol', 'honey', 'dried_fruit', 'tobacco', 'leather'] },
];

const MAX_GRAPES = 3;
const grapeColors = ['#f59e0b', '#38bdf8', '#a78bfa'];

const grapeGroups = [
  { id: 'white', label: '🥂 Vita', type: 'white' as const },
  { id: 'red', label: '🍷 Röda', type: 'red' as const },
  { id: 'sparkling', label: '🍾 Mousserande', type: 'sparkling' as const },
  { id: 'sweet', label: '🍯 Söta', type: 'sweet' as const },
];

function AromhjulContent() {
  const searchParams = useSearchParams();
  const initialGrape = searchParams.get('druva') ?? 'riesling';
  const [selectedGrapes, setSelectedGrapes] = useState<string[]>([initialGrape]);
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const initialGrapeData = allGrapes.find((g) => g.id === initialGrape);
  const initialGroup = (initialGrapeData?.type === 'red' ? 'red' : initialGrapeData?.type === 'sparkling' ? 'sparkling' : 'white') as 'white' | 'red' | 'sparkling';
  const [activeGroup, setActiveGroup] = useState<'white' | 'red' | 'sparkling'>(initialGroup);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleGrape = (id: string) => {
    setSelectedGrapes((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= MAX_GRAPES) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  useEffect(() => {
    drawWheel();
  }, [selectedGrapes, activeFamily]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.46;
    const innerR = size * 0.13;
    const numFamilies = aromaFamilies.length;
    const slice = (Math.PI * 2) / numFamilies;

    ctx.clearRect(0, 0, size, size);

    aromaFamilies.forEach((family, fi) => {
      const startAngle = fi * slice - Math.PI / 2;
      const endAngle = startAngle + slice;
      const midAngle = (startAngle + endAngle) / 2;

      const maxScore = selectedGrapes.reduce((max, gid) => {
        const grape = allGrapes.find((g) => g.id === gid);
        if (!grape) return max;
        const familyMax = family.ids.reduce((m, aid) => Math.max(m, grape.aromaScores[aid] ?? 0), 0);
        return Math.max(max, familyMax);
      }, 0);

      const intensity = maxScore / 5;
      const r = innerR + (outerR - innerR) * (0.1 + intensity * 0.9);
      const isActive = activeFamily === family.id;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(startAngle) * innerR, cy + Math.sin(startAngle) * innerR);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = intensity > 0
        ? family.color + (isActive ? 'ee' : '88')
        : isActive ? '#3f1020' : '#1f0d15';
      ctx.fill();
      ctx.strokeStyle = '#420d1d';
      ctx.lineWidth = 2;
      ctx.stroke();

      const labelR = innerR + (outerR - innerR) * 0.6;
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.fillStyle = isActive ? '#fff' : '#fce7eb';
      ctx.font = `${isActive ? 'bold ' : ''}${size * 0.028}px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(family.label, 0, 0);
      ctx.restore();
    });

    selectedGrapes.forEach((gid, gi) => {
      const grape = allGrapes.find((g) => g.id === gid);
      if (!grape) return;
      aromaFamilies.forEach((family, fi) => {
        const startAngle = fi * slice - Math.PI / 2;
        const endAngle = startAngle + slice;
        const familyMax = family.ids.reduce((m, aid) => Math.max(m, grape.aromaScores[aid] ?? 0), 0);
        if (familyMax === 0) return;
        const r = innerR + (outerR - innerR) * (0.1 + (familyMax / 5) * 0.9);
        const midAngle = (startAngle + endAngle) / 2;
        const offset = (gi - (selectedGrapes.length - 1) / 2) * 8;
        const perpAngle = midAngle + Math.PI / 2;
        const dx = cx + Math.cos(midAngle) * (r - 10) + Math.cos(perpAngle) * offset;
        const dy = cy + Math.sin(midAngle) * (r - 10) + Math.sin(perpAngle) * offset;
        ctx.beginPath();
        ctx.arc(dx, dy, 5, 0, Math.PI * 2);
        ctx.fillStyle = grapeColors[gi];
        ctx.fill();
      });
    });

    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#420d1d';
    ctx.fill();
    ctx.font = `${size * 0.05}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍇', cx, cy);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const outerR = size * 0.46;
    const innerR = size * 0.13;
    if (dist < innerR || dist > outerR) { setActiveFamily(null); return; }
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    const fi = Math.floor(angle / (Math.PI * 2 / aromaFamilies.length));
    const family = aromaFamilies[fi];
    setActiveFamily(family?.id === activeFamily ? null : family?.id ?? null);
  };

  const activeFamilyData = aromaFamilies.find((f) => f.id === activeFamily);
  const groupedGrapes = allGrapes.filter((g) => g.type === activeGroup);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Aromhjul</h1>
      <p className="text-wine-300 mb-6 text-sm leading-relaxed">
        Välj upp till {MAX_GRAPES} druvor. Tryck på ett segment för att se aromerna i detalj.
      </p>

      <div className="flex gap-2 mb-3 border-b border-wine-800 pb-3">
        {grapeGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.type)}
            className={`px-4 py-2 rounded-lg text-sm font-display transition-all ${
              activeGroup === group.type
                ? 'bg-amber-400 text-wine-950 font-semibold'
                : 'text-wine-400 hover:text-wine-200'
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {groupedGrapes.map((grape) => {
          const idx = selectedGrapes.indexOf(grape.id);
          const isSelected = idx !== -1;
          return (
            <button
              key={grape.id}
              onClick={() => toggleGrape(grape.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                isSelected
                  ? 'border-transparent text-wine-950 font-semibold'
                  : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500 hover:text-wine-200'
              }`}
              style={isSelected ? { backgroundColor: grapeColors[idx], borderColor: grapeColors[idx] } : undefined}
            >
              {grape.name}
            </button>
          );
        })}
      </div>

      {selectedGrapes.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {selectedGrapes.map((gid, gi) => {
            const grape = allGrapes.find((g) => g.id === gid);
            return (
              <div key={gid} className="flex items-center gap-1.5 text-sm text-wine-300">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grapeColors[gi] }} />
                {grape?.name}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full max-w-md cursor-pointer rounded-2xl"
          onClick={handleCanvasClick}
        />
      </div>

      {activeFamilyData ? (
        <div className="bg-wine-900 rounded-2xl p-5 border-2 border-wine-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeFamilyData.color }} />
            <h3 className="font-display text-2xl" style={{ color: activeFamilyData.color }}>
              {activeFamilyData.label}
            </h3>
          </div>
          <div className="space-y-4">
            {selectedGrapes.map((gid, gi) => {
              const grape = allGrapes.find((g) => g.id === gid);
              if (!grape) return null;
              const aromasInFamily = activeFamilyData.ids
                .map((aid) => ({ id: aid, score: grape.aromaScores[aid] ?? 0, aroma: allAromas.find((a) => a.id === aid) }))
                .filter((a) => a.score >= 2)
                .sort((a, b) => b.score - a.score);

              return (
                <div key={gid} className="rounded-xl p-4 bg-wine-950" style={{ borderLeft: `3px solid ${grapeColors[gi]}` }}>
                  <div className="font-medium text-wine-100 mb-3 text-lg">{grape.name}</div>
                  {aromasInFamily.length === 0 ? (
                    <p className="text-wine-500 text-sm italic">Inte typiskt för denna druva</p>
                  ) : (
                    <div className="space-y-2">
                      {aromasInFamily.map(({ id, score, aroma }) => (
                        <div key={id} className="flex items-start gap-3">
                          <span className="text-xl">{aroma?.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-wine-100 font-medium">{aroma?.name}</span>
                              <span className="text-amber-400 text-xs">{'★'.repeat(score - 1)}</span>
                            </div>
                            <p className="text-wine-400 text-xs leading-relaxed">{aroma?.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => setActiveFamily(null)} className="mt-4 text-wine-500 text-sm hover:text-wine-300">
            Stäng ✕
          </button>
        </div>
      ) : (
        <p className="text-center text-wine-600 text-sm">Tryck på ett segment i hjulet för att se detaljer</p>
      )}
    </div>
  );
}

export default function AromhjulPage() {
  return (
    <Suspense fallback={<div className="px-4 py-8 text-wine-400">Laddar...</div>}>
      <AromhjulContent />
    </Suspense>
  );
}