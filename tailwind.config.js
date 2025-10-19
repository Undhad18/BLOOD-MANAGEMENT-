/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'Arial'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
      },
      boxShadow: {
        'elev-1': '0 2px 6px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.3)',
        'elev-2': '0 8px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)',
        'neon': '0 0 0 1px rgba(244,63,94,0.4), 0 10px 30px rgba(244,63,94,0.25), inset 0 0 40px rgba(244,63,94,0.05)'
      },
      backgroundImage: {
        'grid-3d': 'radial-gradient(ellipse at 20% 10%, rgba(244,63,94,0.15), transparent 40%), radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.15), transparent 40%), linear-gradient(135deg, rgba(255,255,255,0.06) 0.5px, transparent 0.5px)',
      },
      backgroundSize: {
        'grid-3d': '32px 32px',
      },
      transformOrigin: {
        'persp': 'center center -200px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
}


