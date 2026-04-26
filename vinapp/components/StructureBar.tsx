interface StructureBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  tooltip?: string;
}

const structureLabels: Record<string, string[]> = {
  acidity: ['Mycket låg', 'Låg', 'Medel', 'Hög', 'Mycket hög'],
  body: ['Mycket lätt', 'Lätt', 'Medel', 'Fyllig', 'Mycket fyllig'],
  alcohol: ['Låg', 'Låg-medel', 'Medel', 'Hög', 'Mycket hög'],
  tannin: ['Ingen', 'Lite', 'Medel', 'Hög', 'Mycket hög'],
  sweetness: ['Torrt', 'Nästan torrt', 'Halvtorrt', 'Halvsött', 'Sött'],
  oak: ['Ingen', 'Knappt', 'Lite', 'Tydlig', 'Mycket'],
};

export default function StructureBar({ label, value, max = 5, color = 'bg-wine-600', tooltip }: StructureBarProps) {
  const pct = (value / max) * 100;
  const key = label.toLowerCase().replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o');
  const labelMap: Record<string, string> = {
    syra: 'acidity', kropp: 'body', alkohol: 'alcohol', tannin: 'tannin', sotma: 'sweetness', ek: 'oak',
  };
  const engKey = labelMap[key] || key;
  const levelLabel = value > 0 && structureLabels[engKey] ? structureLabels[engKey][value - 1] : 'Ingen';

  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-wine-300 uppercase tracking-wide">{label}</span>
        <span className="text-xs text-wine-400">{value === 0 ? 'Ingen' : levelLabel}</span>
      </div>
      <div className="h-2 bg-wine-900 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {tooltip && (
        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 bg-wine-800 text-wine-100 text-xs rounded-lg p-2 max-w-xs shadow-lg">
          {tooltip}
        </div>
      )}
    </div>
  );
}
