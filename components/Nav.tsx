'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/druvor', label: 'Druvor', icon: '🍇' },
  { href: '/jamfor', label: 'Jämför', icon: '⚖️' },
  { href: '/stilar', label: 'Stilar', icon: '🗺️' },
  { href: '/regioner', label: 'Regioner', icon: '🌍' },
  { href: '/mat-och-vin', label: 'Mat & Vin', icon: '🍽️' },
  { href: '/aromhjul', label: 'Aromhjul', icon: '🌸' },
  { href: '/trana', label: 'Träna', icon: '🎯' },
  { href: '/lar-dig', label: 'Lär dig', icon: '🧠' },
  { href: '/ordlista', label: 'Ordlista', icon: '📚' },
];

const mobileNavItems = [
  { href: '/druvor', label: 'Druvor', icon: '🍇' },
  { href: '/jamfor', label: 'Jämför', icon: '⚖️' },
  { href: '/stilar', label: 'Stilar', icon: '🗺️' },
  { href: '/regioner', label: 'Regioner', icon: '🌍' },
  { href: '/mat-och-vin', label: 'Mat & Vin', icon: '🍽️' },
  { href: '/aromhjul', label: 'Aromhjul', icon: '🌸' },
  { href: '/trana', label: 'Träna', icon: '🎯' },
  { href: '/lar-dig', label: 'Lär dig', icon: '🧠' },
  { href: '/ordlista', label: 'Ordlista', icon: '📚' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-56 min-h-screen bg-wine-950 border-r border-wine-800 py-8 px-4 fixed left-0 top-0">
        <Link href="/" className="block mb-10 px-2">
          <div className="text-2xl font-display text-wine-100 leading-tight">
            Vin<span className="text-amber-400">Lär</span>
          </div>
          <div className="text-xs text-wine-400 mt-0.5 tracking-widest uppercase">Vinpedagogik</div>
        </Link>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-wine-950 border-t border-wine-800 z-50">
        <ul className="flex">
          {mobileNavItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
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
        </ul>
      </nav>
    </>
  );
}