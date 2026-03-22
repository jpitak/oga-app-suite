/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 18px 60px rgba(59,130,246,.18)',
        glass: '0 10px 30px rgba(15,23,42,.35)',
        button3d: '0 10px 0 rgba(15,23,42,.20), 0 16px 28px rgba(15,23,42,.24)',
      },
      colors: {
        midnight: '#071329',
        panel: '#0d1b39',
        glass: 'rgba(255,255,255,0.10)',
      },
      backgroundImage: {
        'mesh-glow': 'radial-gradient(circle at top left, rgba(56,189,248,.18), transparent 32%), radial-gradient(circle at top right, rgba(192,132,252,.14), transparent 26%), radial-gradient(circle at bottom center, rgba(249,115,22,.18), transparent 28%)'
      }
    },
  },
  plugins: [],
};
