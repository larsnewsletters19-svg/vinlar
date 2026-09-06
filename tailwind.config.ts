import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: 'rgb(var(--wine-50) / <alpha-value>)',
          100: 'rgb(var(--wine-100) / <alpha-value>)',
          200: 'rgb(var(--wine-200) / <alpha-value>)',
          300: 'rgb(var(--wine-300) / <alpha-value>)',
          400: 'rgb(var(--wine-400) / <alpha-value>)',
          500: 'rgb(var(--wine-500) / <alpha-value>)',
          600: 'rgb(var(--wine-600) / <alpha-value>)',
          700: 'rgb(var(--wine-700) / <alpha-value>)',
          800: 'rgb(var(--wine-800) / <alpha-value>)',
          900: 'rgb(var(--wine-900) / <alpha-value>)',
          950: 'rgb(var(--wine-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;