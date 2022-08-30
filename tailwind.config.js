/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'mono': ['ui-monospace', 'SFMono-Regular',  ...defaultTheme.fontFamily.mono]
    },
    extend: {
      height: {
        'header': '4rem',
        'main': 'calc(100vh - 4rem)',
      },
      minHeight: {
        'header': '4rem',
        'main': 'calc(100vh - 4rem)',
      },
      colors: {
        "primary": "#2d82b7",
        "secondary": "#42e2b8",
        "tertiary": "#ff8c42",
        "dark": "#12130f",
      },
      animation: {
        'pop-out': 'pop-out 0.125s ease-in-out',
      },
      keyframes: {
        'pop-out': {
          '0%': {
            'transform': 'scale(50%)',
            'opacity': '0%'
          },
          '100%': {
            'transform': 'scale(100%)',
            'opacity': '100%'
          },
        }
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    },
    require('@tailwindcss/typography'),
  ],
}
