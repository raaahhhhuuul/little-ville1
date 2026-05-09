/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        portal: {
          bg:   '#0F1117',
          card: '#1A1D27',
          border: '#2A2D3A'
        }
      },
      fontFamily: {
        sans:    ['Nunito', 'system-ui', 'sans-serif'],
        display: ['"Fredoka One"', 'Nunito', 'sans-serif']
      },
      width: {
        sidebar: '256px',
        'sidebar-sm': '56px'
      },
      animation: {
        'fade-in':      'fadeIn 0.35s ease-out',
        'slide-up':     'slideUp 0.35s ease-out',
        'slide-in':     'slideIn 0.3s ease-out',
        'startup-exit': 'startupExit 0.45s ease-in forwards',
        'stagger-1':    'slideUp 0.35s ease-out 0.05s both',
        'stagger-2':    'slideUp 0.35s ease-out 0.10s both',
        'stagger-3':    'slideUp 0.35s ease-out 0.15s both',
        'stagger-4':    'slideUp 0.35s ease-out 0.20s both',
        'stagger-5':    'slideUp 0.35s ease-out 0.25s both',
        'stagger-6':    'slideUp 0.35s ease-out 0.30s both',
        'spin-slow':    'spin 2.5s linear infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' },                                          to: { opacity: '1' } },
        slideUp:     { from: { transform: 'translateY(10px)', opacity: '0' },           to: { transform: 'translateY(0)', opacity: '1' } },
        slideIn:     { from: { transform: 'translateX(-10px)', opacity: '0' },          to: { transform: 'translateX(0)', opacity: '1' } },
        startupExit: { from: { opacity: '1', transform: 'scale(1)' },                   to: { opacity: '0', transform: 'scale(1.03)' } },
      },
      transitionProperty: {
        'width': 'width',
      }
    }
  },
  plugins: []
}
