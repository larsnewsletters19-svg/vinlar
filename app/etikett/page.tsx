'use client';

import { useState } from 'react';

// ─── Data per land ─────────────────────────────────────────────────────────────
const COUNTRIES = [
  {
    id: 'france',
    name: 'Frankrike',
    emoji: '🇫🇷',
    color: 'from-blue-900 to-wine-950',
    border: 'border-blue-700',
    accent: 'text-blue-300',
    tagColor: 'bg-blue-900/40 border-blue-700/50 text-blue-300',
    intro: 'Franska etiketter namnger efter region, inte druva. "Chablis" är en plats — inte en druva. Du måste känna till regionerna för att förstå vad du köper.',
    labelMock: {
      lines: [
        { text: 'CHÂTEAU MARGAUX', size: 'text-sm font-bold', color: 'text-stone-800' },
        { text: 'MARGAUX', size: 'text-xs font-bold tracking-widest', color: 'text-stone-700' },
        { text: 'PREMIER GRAND CRU CLASSÉ', size: 'text-[9px] tracking-wider', color: 'text-stone-600' },
        { text: '2019', size: 'text-lg font-bold', color: 'text-stone-800' },
        { text: 'APPELLATION MARGAUX CONTRÔLÉE', size: 'text-[8px] tracking-wide', color: 'text-stone-600' },
        { text: 'MIS EN BOUTEILLE AU CHÂTEAU', size: 'text-[8px]', color: 'text-stone-500' },
      ]
    },
    elements: [
      { icon: '🏰', term: 'Château / Domaine', desc: 'Producenten. Château = borgsliknande gård (Bordeaux). Domaine = vingård (Bourgogne). Maison = négociant som köper druvor.' },
      { icon: '📍', term: 'Appellation (AOC/AOP)', desc: 'Det viktigaste fältet. Anger ursprungsregionen: Bordeaux → Médoc → Pauillac. Ju mer specifik, desto striktare regler och ofta högre kvalitet.' },
      { icon: '🏆', term: 'Klassificering', desc: 'Premier Grand Cru Classé (Bordeaux 1855), Grand Cru (Bourgogne), Cru Bourgeois. Inte obligatoriskt men anger qualitetsnivå.' },
      { icon: '📅', term: 'Årgång (Millésime)', desc: 'Det år druvorna skördades. Viktigt i Frankrike — årgångar varierar kraftigt. Champagne NV = blandning av flera år.' },
      { icon: '🍾', term: 'Mis en bouteille', desc: '"Mis en bouteille au château/domaine" = buteljerat hos producenten. Högt anseende. "Mis en bouteille dans nos caves" = buteljerat av négociant.' },
      { icon: '🌿', term: 'Cru', desc: 'Betyder "tillväxt" — syftar på en specifik vingård. Premier Cru och Grand Cru är de högsta nivåerna i Bourgogne.' },
    ],
    tips: [
      'Lär dig de stora regionnamnen: Bordeaux, Bourgogne, Rhône, Loire, Alsace, Champagne',
      'I Alsace namnges efter druva — undantaget bland franska viner',
      'AOC/AOP-logot (EU-ekobladet) garanterar ursprung men inte kvalitet',
      '"Négociant" köper druvor/vin och butelj under eget namn — kan vara utmärkt eller mediokert',
    ]
  },
  {
    id: 'italy',
    name: 'Italien',
    emoji: '🇮🇹',
    color: 'from-green-900 to-wine-950',
    border: 'border-green-700',
    accent: 'text-green-300',
    tagColor: 'bg-green-900/40 border-green-700/50 text-green-300',
    intro: 'Italienska etiketter är varierade — ibland region, ibland druva, ibland fantasinamn (Super Tuscans). Kvalitetssystemet DOCG/DOC/IGT är nyckeln.',
    labelMock: {
      lines: [
        { text: 'ANTINORI', size: 'text-sm font-bold', color: 'text-stone-800' },
        { text: 'TIGNANELLO', size: 'text-base font-bold italic', color: 'text-stone-800' },
        { text: 'TOSCANA IGT', size: 'text-[9px] tracking-wider', color: 'text-stone-600' },
        { text: '2020', size: 'text-lg font-bold', color: 'text-stone-800' },
        { text: 'CABERNET SAUVIGNON · SANGIOVESE', size: 'text-[8px]', color: 'text-stone-600' },
        { text: '75 cl · 14,5% vol', size: 'text-[8px]', color: 'text-stone-500' },
      ]
    },
    elements: [
      { icon: '🏅', term: 'DOCG', desc: 'Denominazione di Origine Controllata e Garantita — högsta nivån. 77 st, bl.a. Barolo, Brunello, Amarone, Chianti Classico. Garanterar ursprung och produktionskrav.' },
      { icon: '📋', term: 'DOC', desc: 'Denominazione di Origine Controllata — nästa nivå. Över 340 st. Reglerar druvor, avkastning och vinmakning per region.' },
      { icon: '🗺️', term: 'IGT', desc: 'Indicazione Geografica Tipica — flexiblare regler. Hemvist för Super Tuscans (Sassicaia, Tignanello) som använder icke-traditionella druvor.' },
      { icon: '🍇', term: 'Druva på etiketten', desc: 'Ibland anges druvan (Barolo = Nebbiolo, men det står sällan). IGT-viner anger ofta druva: "Toscana IGT Sangiovese".' },
      { icon: '⏳', term: 'Riserva', desc: 'Längre lagring än standard — krav varierar per appellation. Barolo Riserva: 5 år (varav 2 på fat). Brunello Riserva: 6 år.' },
      { icon: '🏰', term: 'Castello / Fattoria / Podere', desc: 'Castello = slott, Fattoria = bondgård, Podere = liten vingård. Ger lokal karaktär men påverkar inte kvalitetsnivån.' },
    ],
    tips: [
      'Barolo och Barbaresco: Nebbiolo-druvan, men det står sällan på etiketten',
      'Chianti Classico (svart tupp-logot) är bättre än vanlig Chianti',
      'IGT kan vara billigt skräp eller Italiens bästa vin — kolla producenten',
      'Annata = årgångsvin. Superiore = högre alkohol eller längre lagring',
    ]
  },
  {
    id: 'spain',
    name: 'Spanien',
    emoji: '🇪🇸',
    color: 'from-amber-900 to-wine-950',
    border: 'border-amber-700',
    accent: 'text-amber-300',
    tagColor: 'bg-amber-900/40 border-amber-700/50 text-amber-300',
    intro: 'Spanska etiketter fokuserar på lagringstid — Crianza, Reserva, Gran Reserva berättar hur länge vinet lagrats. Regionen (DO) är också viktig.',
    labelMock: {
      lines: [
        { text: 'MARQUÉS DE RISCAL', size: 'text-sm font-bold', color: 'text-stone-800' },
        { text: 'RIOJA', size: 'text-base font-bold tracking-widest', color: 'text-stone-800' },
        { text: 'DENOMINACIÓN DE ORIGEN CALIFICADA', size: 'text-[8px] tracking-wide', color: 'text-stone-600' },
        { text: 'RESERVA', size: 'text-sm font-bold', color: 'text-stone-700' },
        { text: '2018', size: 'text-lg font-bold', color: 'text-stone-800' },
        { text: 'TEMPRANILLO · GRACIANO · MAZUELO', size: 'text-[8px]', color: 'text-stone-600' },
      ]
    },
    elements: [
      { icon: '📍', term: 'DO / DOCa', desc: 'Denominación de Origen. DOCa (Calificada) är högst — bara Rioja och Priorat. DO täcker resten: Ribera del Duero, Rías Baixas, Penedès m.fl.' },
      { icon: '🪵', term: 'Crianza', desc: 'Minst 2 år lagring, varav 6 mån på ekfat (rött). Vitt Crianza: 18 mån varav 6 på fat. Lättare och mer omedelbar stil.' },
      { icon: '⭐', term: 'Reserva', desc: 'Minst 3 år (rött), varav 12 mån på fat. Mer komplex och strukturerad. Bra kvalitet/pris i Rioja.' },
      { icon: '👑', term: 'Gran Reserva', desc: 'Minst 5 år (rött), varav 18 mån på fat. Bara de bästa årgångarna. Komplex, elegant och lagringsvärd.' },
      { icon: '🆓', term: 'Joven / Sin Crianza', desc: 'Ungt vin utan obligatorisk fatlagring. Fruktig och direkt stil. Inte sämre — bara annorlunda.' },
      { icon: '🍇', term: 'Druvor', desc: 'Ofta angivet: Tempranillo, Garnacha, Albariño. Rioja anger sällan druva — men Tempranillo dominerar alltid.' },
    ],
    tips: [
      'Crianza/Reserva/Gran Reserva är det viktigaste att läsa — berättar om stil och lagringspotential',
      'Rioja DOCa garanterar kvalitet — men Ribera del Duero är ofta lika bra eller bättre',
      'Albariño på etiketten = Rías Baixas, friskt och syrligt vitt',
      'Cava = spanskt mousserande med traditionell metod, ofta prisvärt',
    ]
  },
  {
    id: 'germany',
    name: 'Tyskland',
    emoji: '🇩🇪',
    color: 'from-yellow-900 to-wine-950',
    border: 'border-yellow-700',
    accent: 'text-yellow-300',
    tagColor: 'bg-yellow-900/40 border-yellow-700/50 text-yellow-300',
    intro: 'Tyska etiketter är världens mest informationsrika — och mest förvirrande. Mognadsnivå (Prädikat) och VDP-klassificering är nycklarna.',
    labelMock: {
      lines: [
        { text: 'WEINGUT DR. LOOSEN', size: 'text-sm font-bold', color: 'text-stone-800' },
        { text: 'ÜRZIGER WÜRZGARTEN', size: 'text-xs font-bold', color: 'text-stone-800' },
        { text: 'RIESLING SPÄTLESE', size: 'text-sm font-bold', color: 'text-stone-700' },
        { text: 'MOSEL', size: 'text-[9px] tracking-widest', color: 'text-stone-600' },
        { text: '2021', size: 'text-lg font-bold', color: 'text-stone-800' },
        { text: 'QUALITÄTSWEIN MIT PRÄDIKAT', size: 'text-[8px]', color: 'text-stone-600' },
      ]
    },
    elements: [
      { icon: '🍇', term: 'Druva + Region', desc: 'Tyskland anger ofta druva (Riesling, Grauburgunder) och region (Mosel, Rheingau, Pfalz). Riesling dominerar — men Spätburgunder (Pinot Noir) växer.' },
      { icon: '📊', term: 'Prädikatsystem', desc: 'Baserat på druvmognad vid skörd: Kabinett (lättast/torrast) → Spätlese → Auslese → Beerenauslese → Trockenbeerenauslese → Eiswein (sötast). Inte alltid sötmare!' },
      { icon: '🔵', term: 'Trocken / Halbtrocken', desc: 'Trocken = torrt (under 9 g/l RS). Halbtrocken = halvtorrt. Utan märkning kan vinet vara sött — kolla RS eller fråga. Trocken är nu dominerande stil.' },
      { icon: '🏅', term: 'VDP-klassificering', desc: 'Qualitätsverband: Gutswein → Ortswein → Erste Lage (1er Cru) → Grosse Lage (Grand Cru). Grosse Gewächs (GG) = torrt toppvin från Grosse Lage.' },
      { icon: '📍', term: 'Vingårdsnamn', desc: 'Format: by + vingård + druva. "Ürziger Würzgarten Riesling" = Ürzig (by) + Würzgarten (vingård) + Riesling (druva). Förvirrande men logiskt.' },
      { icon: '🟡', term: 'Capsule / Etikettkrage', desc: 'Röd krage = Auslese eller högre (söt). Grön = Kabinett. Vit/rosa = Spätlese. Gäller för Mosel-viner i traditionell butelj.' },
    ],
    tips: [
      'Lågt alkohol (7–9%) = sannolikt halvtorrt till sött. Högt (12–13%) = troligen Trocken',
      'Mosel i smal grön butelj, Rheingau i brun butelj — traditionella former',
      'Spätlese kan vara torrt (Trocken) eller halvtorrt — kolla alltid',
      'Pfalz och Rheinhessen gör bra prisvärd Trocken Riesling',
    ]
  },
  {
    id: 'newworld',
    name: 'Nya världen',
    emoji: '🌏',
    color: 'from-teal-900 to-wine-950',
    border: 'border-teal-700',
    accent: 'text-teal-300',
    tagColor: 'bg-teal-900/40 border-teal-700/50 text-teal-300',
    intro: 'USA, Australien, Nya Zeeland, Sydafrika, Argentina och Chile namnger efter druva — inte region. Enklare att läsa men med egna nyanser.',
    labelMock: {
      lines: [
        { text: 'RIDGE', size: 'text-sm font-bold', color: 'text-stone-800' },
        { text: 'MONTE BELLO', size: 'text-base font-bold', color: 'text-stone-800' },
        { text: 'SANTA CRUZ MOUNTAINS', size: 'text-[9px] tracking-widest', color: 'text-stone-600' },
        { text: 'CABERNET SAUVIGNON', size: 'text-xs font-bold', color: 'text-stone-700' },
        { text: '2019', size: 'text-lg font-bold', color: 'text-stone-800' },
        { text: 'ESTATE GROWN · 13,9% ALC/VOL', size: 'text-[8px]', color: 'text-stone-600' },
      ]
    },
    elements: [
      { icon: '🍇', term: 'Druva i centrum', desc: 'Druvan dominerar etiketten. Cabernet Sauvignon, Chardonnay, Sauvignon Blanc — du vet vad du köper. USA: 75%+ av en druva för att ange den.' },
      { icon: '📍', term: 'AVA / GI / Region', desc: 'USA: AVA (American Viticultural Area) — Napa Valley, Sonoma, Willamette Valley. Australien: GI (Geographic Indication) — Barossa Valley, Margaret River. Specifika = bättre.' },
      { icon: '🏡', term: 'Estate Grown / Reserve', desc: '"Estate Grown" = producenten odlade druvorna själv. "Reserve" är inte reglerat i USA/Australien — kan betyda vad som helst. Kolla producenten.' },
      { icon: '🌡️', term: 'Alkohol på etiketten', desc: 'USA-lag kräver alkoholhalt. Hög alkohol (14–16%) = varmt klimat, Californien/Australien. Lägre (12–13%) = svalare klimat, Oregon/Nya Zeeland.' },
      { icon: '🇦🇺', term: 'Australien — screwcap', desc: 'Australien och Nya Zeeland använder skruvkork i stor utsträckning. Inget kvalitetsproblem — skruvkorkar är tekniskt överlägsna för unga viner.' },
      { icon: '🇿🇦', term: 'Sydafrika — WO', desc: 'Wine of Origin (WO) — Stellenbosch, Swartland, Franschhoek. Pinotage är den unika sydafrikanska druvan (Pinot Noir × Cinsault).' },
    ],
    tips: [
      'Napa Valley på etiketten = dyrt men garanterat. "California" utan AVA = enklare vin',
      'Marlborough Sauvignon Blanc: alltid på etiketten — den dominerar Nya Zeeland',
      'Malbec = Argentina, Carménère = Chile — de "egna" druvorna',
      'Single Vineyard / Block = premiumurval från en specifik vingård',
    ]
  },
  {
    id: 'portugal',
    name: 'Portugal',
    emoji: '🇵🇹',
    color: 'from-red-900 to-wine-950',
    border: 'border-red-700',
    accent: 'text-red-300',
    tagColor: 'bg-red-900/40 border-red-700/50 text-red-300',
    intro: 'Portugal har egna unika druvor och ett komplext DOC-system. Port och Vinho Verde har egna regler. Etikettspråket är portugisiska.',
    labelMock: {
      lines: [
        { text: 'QUINTA DO CRASTO', size: 'text-sm font-bold', color: 'text-stone-800' },
        { text: 'DOURO', size: 'text-base font-bold tracking-widest', color: 'text-stone-800' },
        { text: 'DENOMINAÇÃO DE ORIGEM CONTROLADA', size: 'text-[8px] tracking-wide', color: 'text-stone-600' },
        { text: 'RESERVA', size: 'text-sm font-bold', color: 'text-stone-700' },
        { text: '2019', size: 'text-lg font-bold', color: 'text-stone-800' },
        { text: 'TOURIGA NACIONAL · TINTA RORIZ', size: 'text-[8px]', color: 'text-stone-600' },
      ]
    },
    elements: [
      { icon: '📍', term: 'DOC / DOP', desc: 'Denominação de Origem Controlada — Portugals appellation-system. Douro, Alentejo, Vinho Verde, Dão, Bairrada. Varje region har sina tillåtna druvor.' },
      { icon: '🏡', term: 'Quinta', desc: 'Quinta = vingård/gods. Som Château i Bordeaux. Quinta do Crasto, Quinta de la Rosa. Anger origin och producent i ett.' },
      { icon: '🍇', term: 'Inhemska druvor', desc: 'Portugal har 250+ unika druvor. Touriga Nacional, Tinta Roriz (Tempranillo), Baga, Trincadeira, Alvarinho (Albariño). Sällan kända utomlands.' },
      { icon: '🟢', term: 'Vinho Verde', desc: '"Grönt vin" = ungt vin, inte grönt. Friskt, lätt, låg alkohol (8–11%), oftast lite pärlande. Alvarinho-baserade är bäst. Mycket prisvärt.' },
      { icon: '🍷', term: 'Port', desc: 'Från Douro. Ruby = mörk frukt, ung. Tawny = oxidativ, nötig. LBV = Late Bottled Vintage. Vintage Port = toppkvalitet, lagringsvärd 20–50 år.' },
      { icon: '⏳', term: 'Garrafeira', desc: 'Portugisisk beteckning för lång lagring — 2 år på fat + 1 år på flaska (rött). Sällsynt men indikerar seriös producent och lagringsvärd vin.' },
    ],
    tips: [
      'Alentejo gör bra prisvärd röd — sällan känd men ofta utmärkt',
      'Vinho Verde ≠ alltid billigt — Alvarinho från Monção är premiumnivå',
      'Port: Vintage Port kräver dekantring. Tawny serveras kylt som dessertvin',
      'LBV (Late Bottled Vintage) är bra mellanväg — komplex men prisvärd',
    ]
  },
];

// ─── SVG Etikett-mockup ───────────────────────────────────────────────────────
function LabelMockup({ lines }: { lines: { text: string; size: string; color: string }[] }) {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 w-48 mx-auto shadow-lg">
      <div className="border border-amber-300 rounded p-3 flex flex-col items-center gap-1.5 min-h-[160px] justify-center">
        <div className="w-8 h-1 bg-amber-300 rounded mb-1" />
        {lines.map((line, i) => (
          <div key={i} className={`text-center ${line.size} ${line.color}`}>
            {line.text}
          </div>
        ))}
        <div className="w-8 h-1 bg-amber-300 rounded mt-1" />
      </div>
    </div>
  );
}

// ─── Landkort ─────────────────────────────────────────────────────────────────
function CountryCard({ country, isActive, onToggle }: {
  country: typeof COUNTRIES[0];
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${country.border}`}>
      <button
        onClick={onToggle}
        className={`w-full text-left p-4 bg-gradient-to-r ${country.color} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country.emoji}</span>
            <span className="font-display text-xl text-wine-50">{country.name}</span>
          </div>
          <span className="text-wine-300 text-xl">{isActive ? '↑' : '↓'}</span>
        </div>
      </button>

      {isActive && (
        <div className="bg-wine-900/80 p-5 space-y-6">
          <p className={`text-sm leading-relaxed ${country.accent}`}>{country.intro}</p>

          {/* Etikett-mockup */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-3">Exempeletikett</div>
            <LabelMockup lines={country.labelMock.lines} />
          </div>

          {/* Etikett-element */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-3">Vad du ser på etiketten</div>
            <div className="space-y-3">
              {country.elements.map((el) => (
                <div key={el.term} className="flex gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{el.icon}</span>
                  <div>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${country.tagColor} mr-2`}>
                      {el.term}
                    </span>
                    <p className="text-wine-400 text-sm leading-relaxed mt-1">{el.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-wine-800/60 rounded-xl p-4 border border-wine-700">
            <div className="text-[10px] font-mono uppercase tracking-widest text-wine-500 mb-2">💡 Tips att minnas</div>
            <ul className="space-y-1.5">
              {country.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-wine-300">
                  <span className="text-amber-400 shrink-0">→</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sida ─────────────────────────────────────────────────────────────────────
export default function EtikettPage() {
  const [activeCountry, setActiveCountry] = useState<string | null>('france');

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-wine-500 mb-1">
          {COUNTRIES.length} länder
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-wine-100 leading-tight mb-2">
          Etikettläsaren
        </h1>
        <p className="text-wine-300 text-sm leading-relaxed max-w-xl">
          Hur läser man en vinflaskas etikett? Varje land har sina egna regler — appellation, klassificering och lagringsnivå. Klicka på ett land för att lära dig.
        </p>
      </div>

      {/* Snabbval */}
      <div className="flex gap-2 flex-wrap mb-6">
        {COUNTRIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCountry(activeCountry === c.id ? null : c.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeCountry === c.id
                ? 'bg-wine-600 border-wine-600 text-white'
                : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
            }`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {COUNTRIES.map((country) => (
          <CountryCard
            key={country.id}
            country={country}
            isActive={activeCountry === country.id}
            onToggle={() => setActiveCountry(activeCountry === country.id ? null : country.id)}
          />
        ))}
      </div>

      <p className="text-[10px] text-wine-700 font-mono mt-8 border-t border-wine-900 pt-4">
        Regler och klassificeringar ändras — kontrollera alltid aktuell information vid köp av äldre årgångar.
      </p>
    </div>
  );
}
