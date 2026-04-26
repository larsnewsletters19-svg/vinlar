import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VinLär – Lär dig känna igen vin',
  description: 'Pedagogisk vinapp för druvsorter, aromer, blindprovning och smakstruktur.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${playfair.variable} ${sourceSerif.variable}`}>
      <body className="bg-wine-950 text-wine-100 font-body antialiased">
        <Nav />
        <main className="md:ml-56 pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
