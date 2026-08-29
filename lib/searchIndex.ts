import grapes from '@/data/grapes.json';
import glossary from '@/data/glossary.json';
import regions from '@/data/regions.json';
import foodAndWine from '@/data/foodAndWine.json';
import serving from '@/data/serving.json';

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  section: string;
  emoji: string;
  href: string;
};

const pages: SearchResult[] = [
  { id: 'page-start', title: 'Start', subtitle: 'Hem', section: 'Sidor', emoji: '🏠', href: '/' },
  { id: 'page-druvor', title: 'Druvor', subtitle: 'Alla druvsorter', section: 'Sidor', emoji: '🍇', href: '/druvor' },
  { id: 'page-periodisk', title: 'Periodiska systemet', subtitle: 'Druvor som element', section: 'Sidor', emoji: '⚗️', href: '/periodisk' },
  { id: 'page-logg', title: 'Min vinlogg', subtitle: 'Dina provade viner', section: 'Sidor', emoji: '📓', href: '/logg' },
  { id: 'page-regioner', title: 'Regioner', subtitle: 'Vinregioner i världen', section: 'Sidor', emoji: '🌍', href: '/regioner' },
  { id: 'page-stilar', title: 'Stilar', subtitle: 'Jämför vinstilar', section: 'Sidor', emoji: '🗺️', href: '/stilar' },
  { id: 'page-jamfor', title: 'Jämför', subtitle: 'Jämför två druvor', section: 'Sidor', emoji: '⚖️', href: '/jamfor' },
  { id: 'page-blanda', title: 'Blanda ditt vin', subtitle: 'Testa druvblandningar', section: 'Sidor', emoji: '🧪', href: '/blanda' },
  { id: 'page-arganger', title: 'Årgångsguide', subtitle: 'Bra och dåliga årgångar', section: 'Sidor', emoji: '📅', href: '/arganger' },
  { id: 'page-lardig', title: 'Lär dig känna', subtitle: 'Grunderna i vinprovning', section: 'Sidor', emoji: '🧠', href: '/lar-dig' },
  { id: 'page-ordlista', title: 'Ordlista', subtitle: 'Vintermer förklarade', section: 'Sidor', emoji: '📚', href: '/ordlista' },
  { id: 'page-servering', title: 'Servering & temperatur', subtitle: 'Rätt temperatur och glas', section: 'Sidor', emoji: '🌡️', href: '/servering' },
  { id: 'page-forvaxlingar', title: 'Förväxlingar', subtitle: 'Druvor som liknar varandra', section: 'Sidor', emoji: '🔀', href: '/forvaxlingar' },
  { id: 'page-etikett', title: 'Etikettläsaren', subtitle: 'Läs vinetiketter per land', section: 'Sidor', emoji: '🏷️', href: '/etikett' },
  { id: 'page-matochvin', title: 'Mat & Vin', subtitle: 'Vad passar till vad', section: 'Sidor', emoji: '🍽️', href: '/mat-och-vin' },
  { id: 'page-trana', title: 'Träna', subtitle: 'Quiz och övningar', section: 'Sidor', emoji: '🎯', href: '/trana' },
  { id: 'page-prova', title: 'Prova ett vin', subtitle: 'Guidad provning', section: 'Sidor', emoji: '🍷', href: '/prova' },
  { id: 'page-hemma', title: 'Prova hemma', subtitle: 'Guidad provning hemma', section: 'Sidor', emoji: '🏠', href: '/hemma' },
  { id: 'page-aromhjul', title: 'Aromhjul', subtitle: 'Utforska aromer', section: 'Sidor', emoji: '🌸', href: '/aromhjul' },
];

const grapeResults: SearchResult[] = grapes.map((g) => ({
  id: `grape-${g.id}`,
  title: g.name,
  subtitle: g.shortDescription,
  section: 'Druvor',
  emoji: g.type === 'red' ? '🍷' : g.type === 'white' ? '🥂' : '🍇',
  href: `/druvor/${g.id}`,
}));

const glossaryResults: SearchResult[] = glossary.map((t) => ({
  id: `term-${t.id}`,
  title: t.term,
  subtitle: t.short,
  section: 'Ordlista',
  emoji: '📚',
  href: `/ordlista?q=${t.id}`,
}));

const regionResults: SearchResult[] = regions.map((r) => ({
  id: `region-${r.id}`,
  title: r.name,
  subtitle: r.parentRegionId
    ? `Underregion till ${regions.find((p) => p.id === r.parentRegionId)?.name ?? r.country} — ${r.shortDescription}`
    : `${r.country} — ${r.shortDescription}`,
  section: 'Regioner',
  emoji: r.emoji ?? '🌍',
  href: `/regioner?q=${r.id}`,
}));

function hasProfile(sub: string, parentId: string): boolean {
  const subWords = sub.toLowerCase().split(/\s+/).filter((w) => w !== 'rioja' && w.length > 2);
  return regions.some(
    (r) =>
      r.parentRegionId === parentId &&
      (r.name.toLowerCase() === sub.toLowerCase() || subWords.some((w) => r.name.toLowerCase().includes(w)))
  );
}

const subRegionResults: SearchResult[] = regions.flatMap((r) =>
  (r.subRegions ?? [])
    .filter((sub) => sub.toLowerCase() !== r.name.toLowerCase() && !hasProfile(sub, r.id))
    .map((sub) => ({
      id: `subregion-${r.id}-${sub}`,
      title: sub,
      subtitle: `Del av ${r.name}, ${r.country}`,
      section: 'Regioner',
      emoji: r.emoji ?? '🌍',
      href: `/regioner?q=${r.id}`,
    }))
);

const foodCategoryResults: SearchResult[] = foodAndWine.foodCategories.map((c) => ({
  id: `food-${c.id}`,
  title: c.name,
  subtitle: c.description,
  section: 'Mat & Vin',
  emoji: c.emoji,
  href: `/mat-och-vin?q=${c.id}&type=category`,
}));

const interactionResults: SearchResult[] = foodAndWine.interactions.map((i) => ({
  id: `interaction-${i.id}`,
  title: i.name,
  subtitle: i.effect,
  section: 'Mat & Vin',
  emoji: i.emoji,
  href: `/mat-och-vin?q=${i.id}&type=interaction`,
}));

const trickResults: SearchResult[] = foodAndWine.tricks.map((t) => ({
  id: `trick-${t.id}`,
  title: t.name,
  subtitle: t.description,
  section: 'Mat & Vin',
  emoji: t.emoji,
  href: `/mat-och-vin?q=${t.id}&type=trick`,
}));

const servingResults: SearchResult[] = serving.map((s) => ({
  id: `serving-${s.id}`,
  title: s.style,
  subtitle: `${s.category} — exempel: ${s.examples.slice(0, 2).join(', ')}`,
  section: 'Servering',
  emoji: s.emoji,
  href: `/servering?q=${s.id}`,
}));

export const searchIndex: SearchResult[] = [
  ...pages,
  ...grapeResults,
  ...glossaryResults,
  ...regionResults,
  ...subRegionResults,
  ...foodCategoryResults,
  ...interactionResults,
  ...trickResults,
  ...servingResults,
];

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export function runSearch(query: string, limit = 30): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const direct = searchIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const subtitle = item.subtitle.toLowerCase();
      let score = -1;
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 80;
      else if (title.includes(q)) score = 60;
      else if (subtitle.includes(q)) score = 20;
      return { item, score };
    })
    .filter((r) => r.score > 0);

  if (direct.length > 0) {
    return direct.sort((a, b) => b.score - a.score).slice(0, limit).map((r) => r.item);
  }

  // Ingen direktträff — testa felstavningstolerant sökning mot titlarna.
  if (q.length < 3) return [];
  const maxDistance = q.length <= 5 ? 1 : q.length <= 9 ? 2 : 3;
  const fuzzy = searchIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const words = title.split(/[\s,–-]+/);
      const bestDistance = Math.min(
        levenshtein(q, title.slice(0, q.length + maxDistance)),
        ...words.map((w) => levenshtein(q, w))
      );
      return { item, distance: bestDistance };
    })
    .filter((r) => r.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((r) => r.item);

  return fuzzy;
}
