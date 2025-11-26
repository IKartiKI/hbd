/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neonPink: '#ff3bbf',
        neonYellow: '#ffe347',
        neonCyan: '#3bffec',
        roastDark: '#050816',
      },
      boxShadow: {
        'roast-lg': '0 18px 45px rgba(0,0,0,0.45)',
      },
      fontFamily: {
        display: ['system-ui', 'ui-rounded', 'SF Pro Rounded', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1) translate3d(-0.5%, -0.5%, 0)' },
          '50%': { transform: 'scale(0.95) translate3d(0.5%, 0.5%, 0)' },
          '100%': { transform: 'scale(0.85) translate3d(-0.25%, 0.25%, 0)' },
        },
        'roast-pop': {
          '0%': { transform: 'translateY(24px) scale(0.92)', opacity: 0 },
          '60%': { transform: 'translateY(-4px) scale(1.03)', opacity: 1 },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 1 },
        },
        'like-burst': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '40%': { transform: 'scale(1.4)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 0 },
        },
        'type-cursor': {
          '0%, 49%': { opacity: 1 },
          '50%, 100%': { opacity: 0 },
        },
        'confetti-fall': {
          '0%': { transform: 'translate3d(0,-100%,0) rotateZ(0deg)', opacity: 0 },
          '20%': { opacity: 1 },
          '100%': { transform: 'translate3d(0,120vh,0) rotateZ(360deg)', opacity: 0 },
        },
      },
      animation: {
        'ken-burns-slow': 'ken-burns 8s ease-in-out infinite alternate',
        'roast-pop': 'roast-pop 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        'like-burst': 'like-burst 520ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'type-cursor': 'type-cursor 900ms step-end infinite',
        'confetti-fall': 'confetti-fall 1800ms ease-out forwards',
      },
    },
  },
  plugins: [],
}


