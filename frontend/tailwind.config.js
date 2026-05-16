export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff', 100: '#e0e7ff', 300: '#a5b4fc', 400: '#818cf8',
          500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3',
        },
        ink: {
          950: '#070914', 900: '#0b1020', 800: '#111728', 700: '#19213a',
          600: '#26304d', 500: '#374261',
        },
      },
      backgroundImage: {
        'app-gradient':
          'radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(168,85,247,0.14), transparent 55%), linear-gradient(180deg, #070914 0%, #0b1020 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 10px 40px -10px rgba(99,102,241,0.35)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: { float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
