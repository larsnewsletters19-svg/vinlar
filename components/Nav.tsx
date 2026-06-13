'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const mainMobileNav = [
  { href: '/druvor', label: 'Druvor', icon: '🍇' },
  { href: '/jamfor', label: 'Jämför', icon: '⚖️' },
  { href: '/stilar', label: 'Stilar', icon: '🗺️' },
  { href: '/trana', label: 'Träna', icon: '🎯' },
  { href: '/lar-dig', label: 'Lär dig', icon: '🧠' },
];

const moreMobileNav = [
  { href: '/regioner', label: 'Regioner', icon: '🌍' },
  { href: '/aromhjul', label: 'Aromhjul', icon: '🌸' },
  { href: '/mat-och-vin', label: 'Mat & Vin', icon: '🍽️' },
  { href: '/blanda', label: 'Blanda', icon: '🧪' },
  { href: '/prova', label: 'Prova', icon: '🍷' },
  { href: '/ordlista', label: 'Ordlista', icon: '📚' },
  { href: '/forvaxlingar', label: 'Förväxlingar', icon: '🔀' },
  { href: '/periodisk', label: 'Periodisk', icon: '⚗️' },
  { href: '/arganger', label: 'Årgångar', icon: '📅' },
];

const desktopSections = [
  {
    label: 'Utforska',
    items: [
      { href: '/druvor', label: 'Druvor', icon: '🍇' },
      { href: '/periodisk', label: 'Periodisk system', icon: '⚗️' },
      { href: '/regioner', label: 'Regioner', icon: '🌍' },
      { href: '/stilar', label: 'Stilar', icon: '🗺️' },
      { href: '/jamfor', label: 'Jämför', icon: '⚖️' },
      { href: '/blanda', label: 'Blanda ditt vin', icon: '🧪' },
      { href: '/arganger', label: 'Årgångsguide', icon: '📅' },
    ],
  },
  {
    label: 'Lär dig',
    items: [
      { href: '/lar-dig', label: 'Lär dig känna', icon: '🧠' },
      { href: '/ordlista', label: 'Ordlista', icon: '📚' },
      { href: '/forvaxlingar', label: 'Förväxlingar', icon: '🔀' },
      { href: '/mat-och-vin', label: 'Mat & Vin', icon: '🍽️' },
    ],
  },
  {
    label: 'Träna',
    items: [
      { href: '/trana', label: 'Träna', icon: '🎯' },
      { href: '/prova', label: 'Prova ett vin', icon: '🍷' },
      { href: '/aromhjul', label: 'Aromhjul', icon: '🌸' },
    ],
  },
];

export default function Nav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = moreMobileNav.some((item) => pathname.startsWith(item.href));

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-56 min-h-screen bg-wine-950 border-r border-wine-800 py-8 px-4 fixed left-0 top-0">
        <Link href="/" className="block mb-8 px-2">
          <div className="text-2xl font-display text-wine-100 leading-tight">
            Vin<span className="text-amber-400">Lär</span>
          </div>
          <div className="text-xs text-wine-400 mt-0.5 tracking-widest uppercase">Vinpedagogik</div>
        </Link>

        <div className="flex flex-col gap-0">
          {desktopSections.map((section, si) => (
            <div key={section.label}>
              {si > 0 && <div className="mt-6" />}
              <div className="text-xs uppercase tracking-widest text-wine-600 px-3 mb-1">
                {section.label}
              </div>
              <ul className="flex flex-col gap-0">
                {section.items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'bg-wine-800 text-wine-50'
                            : 'text-wine-300 hover:bg-wine-900 hover:text-wine-100'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-wine-950 border-t border-wine-800 z-50">
        {showMore && (
          <div className="border-b border-wine-800 grid grid-cols-6">
            {moreMobileNav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={`flex flex-col items-center py-3 px-1 text-xs font-medium transition-colors ${
                    active ? 'text-amber-400' : 'text-wine-400'
                  }`}
                >
                  <span className="text-lg mb-0.5">{item.icon}</span>
                  <span className="truncate w-full text-center" style={{ fontSize: '9px' }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <ul className="flex">
          {mainMobileNav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={`flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors ${
                    active ? 'text-amber-400' : 'text-wine-400'
                  }`}
                >
                  <span className="text-lg mb-0.5">{item.icon}</span>
                  <span className="truncate w-full text-center" style={{ fontSize: '9px' }}>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              onClick={() => setShowMore(!showMore)}
              className={`w-full flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors ${
                isMoreActive || showMore ? 'text-amber-400' : 'text-wine-400'
              }`}
            >
              <span className="text-lg mb-0.5">•••</span>
              <span style={{ fontSize: '9px' }}>Mer</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}