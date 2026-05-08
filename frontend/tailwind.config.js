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
        kinder: {
          cream:  '#FFFBEB',
          red:    '#F87171',
          orange: '#FB923C',
          yellow: '#FCD34D',
          green:  '#4ADE80',
          blue:   '#60A5FA',
          purple: '#C084FC',
          pink:   '#F472B6',
          violet: '#7C3AED',
          teal:   '#2DD4BF'
        }
      },
      fontFamily: {
        sans:    ['Nunito', 'system-ui', 'sans-serif'],
        display: ['"Fredoka One"', 'Nunito', 'sans-serif']
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      boxShadow: {
        kinder: '0 4px 24px -4px rgba(124, 58, 237, 0.15)',
        card:   '0 2px 16px -2px rgba(249, 115, 22, 0.10), 0 0 0 1px rgba(253, 186, 116, 0.2)'
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease-in-out',
        'slide-in':  'slideIn 0.3s ease-out',
        'wiggle':    'wiggle 2.5s ease-in-out infinite',
        'float':     'float 3.5s ease-in-out infinite',
        'float-slow':'float 5s ease-in-out infinite',
        'pop':       'pop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        'spin-slow': 'spin 3s linear infinite',
        'blob':      'blob 7s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-12px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%':      { transform: 'rotate(5deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' }
        },
        pop: {
          '0%':   { transform: 'scale(0.75)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' }
        },
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%':      { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }
        }
      }
    }
  },
  plugins: []
}
