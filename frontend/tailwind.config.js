/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#0F172A',
          surface: '#1E293B',
          card: '#151D2C',
          lightCard: '#FFFDF7',
          border: '#000000',
          yellow: '#FFD12E',
          pink: '#FF6B97',
          mint: '#2DD4BF',
          green: '#22C55E',
          blue: '#38BDF8',
          cobalt: '#3B82F6',
          indigo: '#6366F1',
          purple: '#A855F7',
          cream: '#FFFBEB',
          lilac: '#E0E7FF',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #000000',
        'neo': '3.5px 3.5px 0px #000000',
        'neo-lg': '5px 5px 0px #000000',
        'neo-xl': '7px 7px 0px #000000',
        'neo-yellow': '4px 4px 0px #FFD12E',
        'neo-pink': '4px 4px 0px #FF6B97',
        'neo-mint': '4px 4px 0px #2DD4BF',
        'neo-blue': '4px 4px 0px #38BDF8',
      }
    },
  },
  plugins: [],
}
