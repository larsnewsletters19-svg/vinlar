'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GrapeLogBadge({ grapeId }: { grapeId: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vinlar_logg');
      if (!raw) {
        setCount(0);
        return;
      }
      const logs: { grapeId: string }[] = JSON.parse(raw);
      setCount(logs.filter(l => l.grapeId === grapeId).length);
    } catch {
      setCount(0);
    }
  }, [grapeId]);

  // Inte laddat än
  if (count === null) return null;

  // Aldrig loggat — visa uppmaning
  if (count === 0) {
    return (
      <Link
        href={`/logg`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-600 transition-colors text-sm text-wine-500"
      >
        <span>📓</span>
        <span>Logga ett vin med denna druva</span>
        <span>→</span>
      </Link>
    );
  }

  // Har loggar
  return (
    <Link
      href={`/logg?druva=${grapeId}`}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wine-800 border border-wine-600 hover:border-amber-400 transition-colors text-sm text-wine-200"
    >
      <span className="text-amber-400 font-bold">{count}×</span>
      <span>Du har loggat denna druva — se dina anteckningar</span>
      <span className="text-wine-500">→</span>
    </Link>
  );
}
