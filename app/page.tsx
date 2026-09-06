import Link from 'next/link';

const sections = [
  {
    href: '/druvor',
    icon: '🍇',
    title: 'Druvor',
    desc: 'Utforska druvsorter, typiska aromer och stilar.',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    href: '/periodisk',
    icon: '⚗️',
    title: 'Periodiska systemet',
    desc: 'Alla druvor grupperade efter typ och kropp i ett visuellt rutnät.',
    badge: 'bg-violet-100 text-violet-700',
  },
  {
    href: '/logg',
    icon: '📓',
    title: 'Min vinlogg',
    desc: 'Logga viner du dricker — appen minns druva, betyg och dina egna ord.',
    badge: 'bg-stone-100 text-stone-700',
  },
  {
    href: '/regioner',
    icon: '🌍',
    title: 'Regioner',
    desc: 'Utforska världens viktigaste vinregioner.',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    href: '/stilar',
    icon: '🗺️',
    title: 'Stilar',
    desc: 'Samma druva, olika regioner och uttryck.',
    badge: 'bg-violet-100 text-violet-700',
  },
  {
    href: '/jamfor',
    icon: '⚖️',
    title: 'Jämför',
    desc: 'Ställ druvor och stilar mot varandra.',
    badge: 'bg-stone-100 text-stone-700',
  },
  {
    href: '/blanda',
    icon: '🧪',
    title: 'Blanda ditt vin',
    desc: 'Bygg din egen blend och förfina med olika druvor.',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    href: '/arganger',
    icon: '📅',
    title: 'Årgångsguide',
    desc: 'Färgkodat rutnät över 12 regioners bästa årgångar.',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    href: '/lar-dig',
    icon: '🧠',
    title: 'Lär dig känna',
    desc: 'Förstå syra, tannin, kropp och ek.',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    href: '/ordlista',
    icon: '📚',
    title: 'Ordlista',
    desc: '72 vinbegrepp förklarade — från syra till terroir.',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    href: '/servering',
    icon: '🌡️',
    title: 'Servering & temperatur',
    desc: 'Rätt temperatur, glasform och dekantring per vintyp.',
    badge: 'bg-sky-100 text-sky-700',
  },
  {
    href: '/forvaxlingar',
    icon: '🔀',
    title: 'Förväxlingar',
    desc: 'De vanligaste förväxlingarna i blindprovning.',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    href: '/etikett',
    icon: '🏷️',
    title: 'Etikettläsaren',
    desc: 'Hur läser man en fransk, tysk eller italiensk etikett? Guide per land.',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    href: '/mat-och-vin',
    icon: '🍽️',
    title: 'Mat & Vin',
    desc: 'Hur mat påverkar vinet och smarta kombinationer.',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    href: '/trana',
    icon: '🎯',
    title: 'Träna',
    desc: 'Öva blindprovning med ledtrådsfrågor.',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    href: '/prova',
    icon: '🍷',
    title: 'Prova ett vin',
    desc: 'Guidad provning steg för steg — se, dofta och smaka.',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    href: '/hemma',
    icon: '🏠',
    title: 'Prova hemma',
    desc: 'Steg-för-steg guide från inköp till utvärdering — med dekanterings-timer.',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    href: '/aromhjul',
    icon: '🌸',
    title: 'Aromhjul',
    desc: 'Se druvors aromprofil i ett visuellt hjul.',
    badge: 'bg-rose-100 text-rose-700',
  },
];

export default function Home() {
  return (
    <div className="px-4 py-10 max-w-2xl lg:max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl lg:text-6xl text-wine-100 mb-3">
          Vin<span className="text-amber-600">Lär</span>
        </h1>
        <p className="text-wine-300 text-lg leading-relaxed max-w-md mx-auto">
          Lär dig känna igen druvsorter, förstå aromer och träna blindprovning — på ett praktiskt och pedagogiskt sätt.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <li key={s.href + s.title}>
            <Link
              href={s.href}
              className="flex items-start gap-4 p-5 rounded-2xl bg-wine-900 border border-wine-800 hover:border-wine-600 transition-all hover:scale-[1.01] active:scale-[0.99] block"
            >
              <span className={`text-2xl mt-0.5 w-12 h-12 shrink-0 flex items-center justify-center rounded-xl ${s.badge}`}>{s.icon}</span>
              <div>
                <div className="font-display text-xl text-wine-100 mb-1">{s.title}</div>
                <div className="text-sm text-wine-400 leading-snug">{s.desc}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-center text-wine-500 text-xs mt-10">
        Version 1.6 · Data lagras lokalt · Ingen inloggning krävs
      </p>
    </div>
  );
}
