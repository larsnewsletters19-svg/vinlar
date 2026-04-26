# VinLär 🍷

En pedagogisk vinapp för druvsorter, aromer, blindprovning och smakstruktur.

## Komma igång

### 1. Kopiera filerna

Kopiera alla filer i det här projektet till ditt befintliga Next.js-projekt.

**Viktigt:** Kontrollera att du redan har dessa i ditt projekt (annars lägg till):
- `app/` (App Router-struktur)
- `public/` (bilder etc)

### 2. Installera Google Fonts

I `app/layout.tsx` används `Playfair_Display` och `Source_Serif_4`. De laddas via `next/font/google` automatiskt när du kör projektet.

### 3. Installera beroenden

```bash
npm install
```

### 4. Kör lokalt

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.

### 5. Publicera på Railway

1. Skapa ett nytt projekt på [railway.app](https://railway.app)
2. Koppla till ditt GitHub-repo
3. Railway känner automatiskt igen Next.js och sätter rätt byggkommandon
4. Sätt miljövariabler om det behövs (inga i v1)

## Projektstruktur

```
/app
  layout.tsx          ← Root layout med nav
  page.tsx            ← Startsida
  /druvor
    page.tsx          ← Lista alla druvor
    /[id]
      page.tsx        ← Druvdetaljsida
  /jamfor
    page.tsx          ← Jämförelsesida
  /aromhjul
    page.tsx          ← Interaktivt aromhjul (Canvas)
  /trana
    page.tsx          ← Blindprovningsfrågor
  /lar-dig
    page.tsx          ← Lär dig känna egenskaper

/components
  Nav.tsx             ← Navigation (desktop sidebar + mobil bottenbar)
  StructureBar.tsx    ← Strukturbar-komponent

/data
  grapes.json         ← 10 druvor (5 vita, 5 röda)
  aromas.json         ← ~50 aromer med familj och beskrivning
  comparisons.json    ← 8 jämförelser (druva vs druva + stil vs stil)
  trainingQuestions.json ← 12 träningsfrågor
  learnToTaste.json   ← 8 sensoriska egenskaper

/types
  index.ts            ← TypeScript-typer
```

## Designbeslut

- **Färgpalett:** Djup vinröd (`wine-*`) som bas med amber-accenter
- **Typsnitt:** Playfair Display (rubriker) + Source Serif 4 (brödtext)
- **Layout:** Desktop: fast sidebar (56px bred). Mobil: bottom navigation bar
- **Data:** Ligger i lokala JSON-filer, inga API-calls eller databas i v1

## Lägga till fler druvor

Redigera `data/grapes.json` och lägg till en ny druva med samma struktur som de befintliga. Appen plockar upp den automatiskt.

## Version 1 – Avgränsningar

- Ingen inloggning eller konton
- Ingen databas (JSON-filer)
- Ingen gamification med poäng och streaks
- Inga AI-rekommendationer
- Ingen Systembolaget-integration

## Nästa steg (v2 och framåt)

- Fler druvor (alla 20 i spec)
- Sökning och filtrering
- Möjlighet att spara favoritdruvor
- Supabase för användarkonton och vinlogg
- Mer avancerat aromhjul med regionfilter
