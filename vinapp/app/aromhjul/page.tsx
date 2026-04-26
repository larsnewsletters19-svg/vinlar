'use client';

import { useState, useRef, useEffect } from 'react';
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

export default function AromhjulPage() {
  const [selectedGrapes, setSelectedGrapes] = useState<string[]>(['riesling']);
  const [hoveredFamily, setHoveredFamily] = useState<string | null>(null);
  const [hoveredAroma, setHoveredAroma] = useState<Aroma | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleGrape = (id: string) => {
    setSelectedGrapes((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= MAX_GRAPES) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const grapeColors = ['#f59e0b', '#38bdf8', '#a78bfa'];

  useEffect(() => {
    drawWheel();
  }, [selectedGrapes, hoveredFamily]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.46;
    const innerR = size * 0.12;
    const numFamilies = aromaFamilies.length;
    const slice = (Math.PI * 2) / numFamilies;

    ctx.clearRect(0, 0, size, size);

    aromaFamilies.forEach((family, fi) => {
      const startAngle = fi * slice - Math.PI / 2;
      const endAngle = startAngle + slice;
      const midAngle = (startAngle + endAngle) / 2;

      // Get max score across selected grapes for this family
      const maxScore = selectedGrapes.reduce((max, gid) => {
        const grape = allGrapes.find((g) => g.id === gid);
        if (!grape) return max;
        const familyMax = family.ids.reduce((m, aid) => Math.max(m, grape.aromaScores[aid] ?? 0), 0);
        return Math.max(max, familyMax);
      }, 0);

      const intensity = maxScore / 5;
      const r = innerR + (outerR - innerR) * (0.1 + intensity * 0.9);
      const isHovered = hoveredFamily === family.id;

      // Draw arc
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(startAngle) * innerR, cy + Math.sin(startAngle) * innerR);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();

      const baseColor = family.color;
      ctx.fillStyle = intensity > 0 ? baseColor + (isHovered ? 'dd' : '99') : '#1f0d15';
      ctx.fill();
      ctx.strokeStyle = '#420d1d';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      if (r > innerR + 12) {
        const labelR = innerR + (r - innerR) * 0.55;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(midAngle + Math.PI / 2);
        ctx.fillStyle = '#fce7eb';
        ctx.font = `${size * 0.022}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(family.label, 0, 0);
        ctx.restore();
      }
    });

    // Per-grape rings
    selectedGrapes.forEach((gid, gi) => {
      const grape = allGrapes.find((g) => g.id === gid);
      if (!grape) return;
      const color = grapeColors[gi];

      aromaFamilies.forEach((family, fi) => {
        const startAngle = fi * slice - Math.PI / 2;
        const endAngle = startAngle + slice;
        const familyMax = family.ids.reduce((m, aid) => Math.max(m, grape.aromaScores[aid] ?? 0), 0);
        if (familyMax === 0) return;

        const r = innerR + (outerR - innerR) * (0.1 + (familyMax / 5) * 0.9);
        const midAngle = (startAngle + endAngle) / 2;
        const dotR = r - 8;
        const dx = cx + Math.cos(midAngle) * dotR;
        const dy = cy + Math.sin(midAngle) * dotR;

        ctx.beginPath();
        ctx.arc(dx, dy, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    });

    // Center label
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#420d1d';
    ctx.fill();
    ctx.fillStyle = '#fce7eb';
    ctx.font = `bold ${size * 0.04}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍇', cx, cy);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const outerR = size * 0.46;
    const innerR = size * 0.12;
    if (dist < innerR || dist > outerR) { setHoveredFamily(null); return; }
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    const fi = Math.floor(angle / (Math.PI * 2 / aromaFamilies.length));
    const family = aromaFamilies[fi];
    setHoveredFamily(family?.id === hoveredFamily ? null : family?.id ?? null);
  };

  const hoveredFamilyData = aromaFamilies.find((f) => f.id === hoveredFamily);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl text-wine-100 mb-2">Aromhjul</h1>
      <p className="text-wine-300 mb-6 text-sm leading-relaxed">
        Välj upp till {MAX_GRAPES} druvor och se deras aromprofil i hjulet. Tryck på ett segment för att se detaljer.
      </p>

      {/* Grape selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allGrapes.map((grape, gi) => {
          const idx = selectedGrapes.indexOf(grape.id);
          const isSelected = idx !== -1;
          const color = isSelected ? grapeColors[idx] : undefined;
          return (
            <button
              key={grape.id}
              onClick={() => toggleGrape(grape.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                isSelected
                  ? 'border-transparent text-wine-950'
                  : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500 hover:text-wine-200'
              }`}
              style={isSelected ? { backgroundColor: color, borderColor: color } : undefined}
            >
              {grape.type === 'white' ? '🥂' : '🍷'} {grape.name}
            </button>
          );
        })}
      </div>

      {/* Legend */}
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

      {/* Canvas wheel */}
      <div className="flex justify-center mb-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full max-w-sm cursor-pointer rounded-2xl"
          onClick={handleCanvasClick}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Hovered family detail */}
      {hoveredFamilyData && (
        <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800 animate-fadeIn">
          <h3 className="font-display text-xl mb-3" style={{ color: hoveredFamilyData.color }}>
            {hoveredFamilyData.label}
          </h3>
          <div className="space-y-3">
            {selectedGrapes.map((gid, gi) => {
              const grape = allGrapes.find((g) => g.id === gid);
              if (!grape) return null;
              const aromasInFamily = hoveredFamilyData.ids
                .map((aid) => ({ id: aid, score: grape.aromaScores[aid] ?? 0 }))
                .filter((a) => a.score >= 2)
                .sort((a, b) => b.score - a.score);
              if (aromasInFamily.length === 0) return (
                <div key={gid} className="text-sm text-wine-500" style={{ borderLeft: `2px solid ${grapeColors[gi]}`, paddingLeft: '8px' }}>
                  {grape.name}: Inte typiskt
                </div>
              );
              return (
                <div key={gid} style={{ borderLeft: `2px solid ${grapeColors[gi]}`, paddingLeft: '8px' }}>
                  <div className="text-sm font-medium text-wine-200 mb-1">{grape.name}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {aromasInFamily.map(({ id, score }) => {
                      const aroma = allAromas.find((a) => a.id === id);
                      if (!aroma) return null;
                      return (
                        <span key={id} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-wine-800 text-wine-300">
                          {aroma.emoji} {aroma.name}
                          {'★'.repeat(Math.min(score - 1, 3))}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
