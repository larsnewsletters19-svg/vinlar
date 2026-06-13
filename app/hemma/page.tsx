'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Steg-data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'kopa',
    emoji: '🛒',
    title: 'Välj & köp vinet',
    color: 'from-indigo-900 to-wine-950',
    border: 'border-indigo-700',
    accent: 'text-indigo-300',
    timer: null,
    intro: 'Rätt val i butiken är halva jobbet. Tänk på mat, sällskap och tillfälle.',
    items: [
      { icon: '🍽️', heading: 'Matanpassning', text: 'Tänk på vad du ska äta. Fisk → vitt, kött → rött, skaldjur → mousserande eller lätt vitt. En tumregel: vin från samma region passar maten därifrån.' },
      { icon: '💰', heading: 'Priszon', text: 'I Sverige ger 120–180 kr på Systembolaget god kvalitet. Undvik extrem lågpris och var skeptisk till ovanligt billiga viner i "premiumstil".' },
      { icon: '📅', heading: 'Årgång', text: 'Kontrollera årgången. Enkla viner: drick så unga som möjligt. Kvalitetsviner: se årgångsguiden i appen för att veta om det är ett bra år.' },
      { icon: '🌡️', heading: 'Transport hem', text: 'Undvik att låta vinet stå i het bil. Värme förstör vin snabbt — max 30 min i sommarhettan.' },
    ],
  },
  {
    id: 'temperera',
    emoji: '🌡️',
    title: 'Temperera vinet',
    color: 'from-sky-900 to-wine-950',
    border: 'border-sky-700',
    accent: 'text-sky-300',
    timer: null,
    intro: 'Rätt temperatur är avgörande. De flesta dricker vitt för varmt och rött för kallt.',
    items: [
      { icon: '🥂', heading: 'Lätt vitt & Mousserande', text: '6–9°C — direkt från kylen. Kyl gärna 2–3 timmar i förväg.' },
      { icon: '🍾', heading: 'Fylligt vitt & Rosé', text: '10–13°C — ta fram ur kylen 10 min före servering.' },
      { icon: '🍓', heading: 'Lätt rött', text: '13–15°C — 20 min i kylen om det är rumstemperatur. Gamay och Pinot Noir mår bra av lite kyla.' },
      { icon: '🍷', heading: 'Fylligt rött', text: '16–18°C — servera i normal rumstemperatur på vintern. Sommartid: 15 min i kylen.' },
    ],
  },
  {
    id: 'dekantera',
    emoji: '🫗',
    title: 'Dekantera vid behov',
    color: 'from-amber-900 to-wine-950',
    border: 'border-amber-700',
    accent: 'text-amber-300',
    timer: 30,
    timerLabel: 'Dekanterings-timer',
    intro: 'Inte alla viner behöver dekantering — men rätt vin med luft öppnar sig dramatiskt.',
    items: [
      { icon: '✅', heading: 'Dekantera alltid', text: 'Unga, tanninrika röda (Barolo, Cab. Sauv., Syrah under 8 år). Häll i karaff 30–90 min före servering.' },
      { icon: '⚠️', heading: 'Dekantera varsamt', text: 'Gamla viner (10+ år) med sediment. Håll flaskan mot ljuset, häll långsamt och stoppa när grumligheten når flaskhalsen.' },
      { icon: '🚫', heading: 'Dekantera inte', text: 'Mousserande vin (tappar bubblor), lätta röda (Beaujolais), färska vita. De mår bra direkt i glaset.' },
      { icon: '💡', heading: 'Snabbtips', text: 'Om du inte har karaff: häll upp i glaset och sväng kraftigt i 30 sekunder. Ger snabb luftning.' },
    ],
  },
  {
    id: 'halla',
    emoji: '🍷',
    title: 'Häll upp & titta',
    color: 'from-rose-900 to-wine-950',
    border: 'border-rose-700',
    accent: 'text-rose-300',
    timer: null,
    intro: 'Häll rätt mängd i rätt glas. Det ser ut som lite — men det är rätt.',
    items: [
      { icon: '🥛', heading: 'Fyll glaset max en tredjedel', text: 'Vinet behöver utrymme att andas och du ska kunna svänga utan att spilla. Aldrig mer än halvfullt.' },
      { icon: '🔍', heading: 'Titta mot ljuset', text: 'Färg: klart gult = ungt vitt, guldgult = moget/ekat, rubinrött = ungt rött, tegelrött = moget rött. Grumligt = naturvin eller fel.' },
      { icon: '💧', heading: 'Tårar längs glaset', text: 'Tjocka, långsamma tårar = hög alkohol och/eller glycerol. Ger ingen info om kvalitet — bara alkohol och sötma.' },
      { icon: '🫧', heading: 'Bubblor i mousserande', text: 'Fina, jämna bubblor = traditionell metod (Champagne, Cava). Stora, snabba = tank-metod (Prosecco).' },
    ],
  },
  {
    id: 'dofta',
    emoji: '👃',
    title: 'Dofta — det viktigaste steget',
    color: 'from-violet-900 to-wine-950',
    border: 'border-violet-700',
    accent: 'text-violet-300',
    timer: null,
    intro: '80% av smakupplevelsen är egentligen doft. Ta dig tid här.',
    items: [
      { icon: '1️⃣', heading: 'Första doft — stilla glas', text: 'Håll glaset stilla och dofta varsamt. De lättflyktiga aromerna hittas nu — blommor, frisk frukt.' },
      { icon: '2️⃣', heading: 'Sväng och dofta igen', text: 'Sväng glaset kraftigt 5–10 sekunder. Dofta direkt. Nu frigörs de tyngre aromerna — ek, jord, kryddor.' },
      { icon: '🌸', heading: 'Vad känner du?', text: 'Tänk i familjer: frukt (citrus, bär, tropiskt), blommor, örtigt, ekfat, jord, mognad. Öppna aromhjulet i appen för hjälp.' },
      { icon: '🚫', heading: 'Korksmak', text: 'Luktar vinet av fuktig källare eller kartong? Det är korksmak (TCA). Vinet är förstört — returnera det.' },
    ],
  },
  {
    id: 'smaka',
    emoji: '👅',
    title: 'Smaka metodiskt',
    color: 'from-emerald-900 to-wine-950',
    border: 'border-emerald-700',
    accent: 'text-emerald-300',
    timer: null,
    intro: 'Ta en ordentlig klunk och låt vinet täcka hela munnen.',
    items: [
      { icon: '💧', heading: 'Syra', text: 'Vattnas munnen längs sidorna? Hög syra = friskt, pirrigt. Låg syra = mjukt, rundat. Syra ger lagringskapacitet.' },
      { icon: '🫙', heading: 'Tannin', text: 'Känns munnen torr och sträv, som svart te? Det är tannin. Högt tannin = klarar lagring och starkt kött.' },
      { icon: '⚖️', heading: 'Kropp', text: 'Hur tungt känns vinet? Lätt = som vatten, fylligt = som mjölk. Bestäms av alkohol och extrakt.' },
      { icon: '⏱️', heading: 'Finish', text: 'Hur länge sitter smaken kvar efter att du svalt? Under 5 sek = kort. 20+ sek = lång, kvalitetsvin.' },
    ],
  },
  {
    id: 'utvärdera',
    emoji: '📝',
    title: 'Utvärdera & lär dig',
    color: 'from-teal-900 to-wine-950',
    border: 'border-teal-700',
    accent: 'text-teal-300',
    timer: null,
    intro: 'Sätt ord på upplevelsen. Du lär dig mer av ett medvetet vin än tio ouppmärksamma.',
    items: [
      { icon: '🎯', heading: 'Gissa druvan', text: 'Försök identifiera druvan innan du kollar etiketten. Använd Förväxlingar och Blindtest i appen för att träna.' },
      { icon: '📊', heading: 'Betygsätt strukturen', text: 'Syra, tannin, kropp, finish — ge varje del 1–5. Öppna Jämför i appen och matcha mot en druvprofil.' },
      { icon: '🗒️', heading: 'Anteckna', text: 'Skriv ned druva, producent, årgång och dina intryck. Minnet av vin är kort — anteckningar byggs till ett mönster över tid.' },
      { icon: '🔁', heading: 'Testa igen om en timme', text: 'Samma vin kan smaka helt annorlunda efter en timme i glaset. Luftning förändrar vinet — följ med i processen.' },
    ],
  },
];

// ─── Timer-komponent ──────────────────────────────────────────────────────────
function Timer({ minutes }: { minutes: number }) {
  const totalSeconds = minutes * 60;
  const [seconds, setSeconds] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setRunning(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds]);

  const pct = ((totalSeconds - seconds) / totalSeconds) * 100;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="mt-4 p-4 bg-wine-900/80 border border-amber-800 rounded-xl">
      <div className="text-[10px] font-mono uppercase tracking-widest text-amber-600 mb-2">
        ⏱ Dekanterings-timer
      </div>
      <div className="text-4xl font-mono text-amber-300 font-bold mb-3">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <div className="h-2 bg-wine-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-amber-600 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setRunning(!running)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            running
              ? 'bg-wine-700 text-wine-300 hover:bg-wine-600'
              : 'bg-amber-700 text-amber-100 hover:bg-amber-600'
          }`}
        >
          {running ? 'Pausa' : seconds === totalSeconds ? 'Starta' : 'Fortsätt'}
        </button>
        <button
          onClick={() => { setSeconds(totalSeconds); setRunning(false); }}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-wine-800 text-wine-400 hover:bg-wine-700 transition-all"
        >
          Återställ
        </button>
        {[15, 30, 60, 90].map((m) => (
          <button
            key={m}
            onClick={() => { setSeconds(m * 60); setRunning(false); }}
            className={`px-2 py-1.5 rounded-lg text-xs font-mono transition-all ${
              minutes === m ? 'bg-amber-800 text-amber-300' : 'bg-wine-800 text-wine-500 hover:bg-wine-700'
            }`}
          >
            {m}m
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Steg-kort ────────────────────────────────────────────────────────────────
function StepCard({ step, index, isActive, onToggle }: {
  step: typeof STEPS[0];
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${step.border} ${isActive ? 'shadow-lg' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-full text-left p-4 bg-gradient-to-r ${step.color} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-sm font-mono font-bold text-white">
              {index + 1}
            </div>
            <span className="text-2xl">{step.emoji}</span>
            <span className="font-display text-lg text-wine-50">{step.title}</span>
          </div>
          <span className="text-wine-300 text-xl">{isActive ? '↑' : '↓'}</span>
        </div>
      </button>

      {isActive && (
        <div className="bg-wine-900/80 p-4 space-y-4">
          <p className={`text-sm leading-relaxed ${step.accent}`}>{step.intro}</p>

          <div className="space-y-3">
            {step.items.map((item) => (
              <div key={item.heading} className="flex gap-3">
                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-wine-200 text-sm font-medium mb-0.5">{item.heading}</div>
                  <div className="text-wine-400 text-sm leading-relaxed">{item.text}</div>
                </div>
              </div>
            ))}
          </div>

          {step.timer && <Timer minutes={step.timer} />}
        </div>
      )}
    </div>
  );
}

// ─── Sida ─────────────────────────────────────────────────────────────────────
export default function HemmaPage() {
  const [activeStep, setActiveStep] = useState<number | null>(0);

  const toggleStep = (i: number) => setActiveStep(activeStep === i ? null : i);

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-wine-500 mb-1">
          {STEPS.length} steg
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-wine-100 leading-tight mb-2">
          Prova hemma
        </h1>
        <p className="text-wine-300 text-sm leading-relaxed max-w-xl">
          En komplett guide från inköp till utvärdering. Klicka på ett steg för att expandera.
          Dekanterings-timern i steg 3 hjälper dig tajma luftningen.
        </p>
      </div>

      {/* Snabbnavigering */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setActiveStep(i); setTimeout(() => document.getElementById(`step-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
            className={`px-2 py-1 rounded-lg text-xs font-mono border transition-all ${
              activeStep === i
                ? 'bg-wine-600 border-wine-500 text-white'
                : 'bg-wine-900 border-wine-800 text-wine-500 hover:border-wine-600'
            }`}
          >
            {s.emoji} {i + 1}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {STEPS.map((step, i) => (
          <div id={`step-${i}`} key={step.id}>
            <StepCard
              step={step}
              index={i}
              isActive={activeStep === i}
              onToggle={() => toggleStep(i)}
            />
          </div>
        ))}
      </div>

      <p className="text-[10px] text-wine-700 font-mono mt-8 border-t border-wine-900 pt-4">
        Tips: öppna Aromhjulet, Jämför och Periodiska systemet i separata flikar medan du provar.
      </p>
    </div>
  );
}
