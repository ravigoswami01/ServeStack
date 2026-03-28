/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        forest: {
          950: '#061410',
          900: '#0d2218',
          800: '#163320',
          700: '#1f4a2d',
          600: '#285f38',
          500: '#2e7142',
          400: '#3d9455',
          300: '#55be6f',
        },
        saffron: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        ember: {
          500: '#ef4444',
          600: '#dc2626',
        },
        clay: {
          50: '#fdf8f3',
          100: '#f5ede0',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        bounceIn: { from: { opacity: 0, transform: 'scale(0.8)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.16)',
        'green': '0 8px 32px rgba(46,113,66,0.35)',
        'amber': '0 8px 32px rgba(251,191,36,0.35)',
      }
    },
  },
  plugins: [],
}
