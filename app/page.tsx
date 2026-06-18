import Link from 'next/link';

const sections = [
  {
    href: '/druvor',
    icon: '🍇',
    title: 'Druvor',
    desc: 'Utforska druvsorter, typiska aromer och stilar.',
    color: 'from-wine-800 to-wine-900',
  },
  {
    href: '/periodisk',
    icon: '⚗️',
    title: 'Periodiska systemet',
    desc: 'Alla druvor grupperade efter typ och kropp i ett visuellt rutnät.',
    color: 'from-violet-900 to-wine-950',
  },
  {
    href: '/logg',
    icon: '📓',
    title: 'Min vinlogg',
    desc: 'Logga viner du dricker — appen minns druva, betyg och dina egna ord.',
    color: 'from-wine-800 to-stone-950',
  },
  {
    href: '/regioner',
    icon: '🌍',
    title: 'Regioner',
    desc: 'Utforska världens viktigaste vinregioner.',
    color: 'from-teal-900 to-wine-950',
  },
  {
    href: '/stilar',
    icon: '🗺️',
    title: 'Stilar',
    desc: 'Samma druva, olika regioner och uttryck.',
    color: 'from-indigo-900 to-wine-950',
  },
  {
    href: '/jamfor',
    icon: '⚖️',
    title: 'Jämför',
    desc: 'Ställ druvor och stilar mot varandra.',
    color: 'from-stone-800 to-stone-900',
  },
  {
    href: '/blanda',
    icon: '🧪',
    title: 'Blanda ditt vin',
    desc: 'Bygg din egen blend och förfina med olika druvor.',
    color: 'from-cyan-900 to-wine-950',
  },
  {
    href: '/arganger',
    icon: '📅',
    title: 'Årgångsguide',
    desc: 'Färgkodat rutnät över 12 regioners bästa årgångar.',
    color: 'from-amber-900 to-stone-950',
  },
  {
    href: '/lar-dig',
    icon: '🧠',
    title: 'Lär dig känna',
    desc: 'Förstå syra, tannin, kropp och ek.',
    color: 'from-emerald-900 to-stone-950',
  },
  {
    href: '/ordlista',
    icon: '📚',
    title: 'Ordlista',
    desc: '72 vinbegrepp förklarade — från syra till terroir.',
    color: 'from-purple-900 to-wine-950',
  },
  {
    href: '/servering',
    icon: '🌡️',
    title: 'Servering & temperatur',
    desc: 'Rätt temperatur, glasform och dekantring per vintyp.',
    color: 'from-sky-900 to-wine-950',
  },
  {
    href: '/forvaxlingar',
    icon: '🔀',
    title: 'Förväxlingar',
    desc: 'De vanligaste förväxlingarna i blindprovning.',
    color: 'from-rose-900 to-wine-950',
  },
  {
    href: '/etikett',
    icon: '🏷️',
    title: 'Etikettläsaren',
    desc: 'Hur läser man en fransk, tysk eller italiensk etikett? Guide per land.',
    color: 'from-indigo-900 to-wine-950',
  },
  {
    href: '/mat-och-vin',
    icon: '🍽️',
    title: 'Mat & Vin',
    desc: 'Hur mat påverkar vinet och smarta kombinationer.',
    color: 'from-orange-900 to-wine-950',
  },
  {
    href: '/trana',
    icon: '🎯',
    title: 'Träna',
    desc: 'Öva blindprovning med ledtrådsfrågor.',
    color: 'from-lime-900 to-stone-950',
  },
  {
    href: '/prova',
    icon: '🍷',
    title: 'Prova ett vin',
    desc: 'Guidad provning steg för steg — se, dofta och smaka.',
    color: 'from-wine-700 to-wine-950',
  },
  {
    href: '/hemma',
    icon: '🏠',
    title: 'Prova hemma',
    desc: 'Steg-för-steg guide från inköp till utvärdering — med dekanterings-timer.',
    color: 'from-teal-900 to-wine-950',
  },
  {
    href: '/aromhjul',
    icon: '🌸',
    title: 'Aromhjul',
    desc: 'Se druvors aromprofil i ett visuellt hjul.',
    color: 'from-rose-900 to-wine-950',
  },
];

export default function Home() {
  return (
    <div className="px-4 py-10 max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl text-wine-100 mb-3">
          Vin<span className="text-amber-400">Lär</span>
        </h1>
        <p className="text-wine-300 text-lg leading-relaxed max-w-md mx-auto">
          Lär dig känna igen druvsorter, förstå aromer och träna blindprovning — på ett praktiskt och pedagogiskt sätt.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sections.map((s) => (
          <li key={s.href + s.title}>
            <Link
              href={s.href}
              className={`flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br ${s.color} border border-wine-800 hover:border-wine-600 transition-all hover:scale-[1.01] active:scale-[0.99] block`}
            >
              <span className="text-3xl mt-0.5">{s.icon}</span>
              <div>
                <div className="font-display text-xl text-wine-50 mb-1">{s.title}</div>
                <div className="text-sm text-wine-300 leading-snug">{s.desc}</div>
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
