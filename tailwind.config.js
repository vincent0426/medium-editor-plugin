/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './stories/*'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter var', 'sans-serif'],
        default: ['serif', 'sans-serif']
      },
      colors: {
        white: 'var(--editor-white)',
        prime: {
          50: 'var(--editor-prime-50)',
          100: 'var(--editor-prime-100)',
          200: 'var(--editor-prime-200)',
          300: 'var(--editor-prime-300)',
          400: 'var(--editor-prime-400)',
          500: 'var(--editor-prime-500)',
          600: 'var(--editor-prime-600)',
          700: 'var(--editor-prime-700)',
          800: 'var(--editor-prime-800)',
          900: 'var(--editor-prime-900)'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}

