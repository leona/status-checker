const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./views/**'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        red: colors.red,
        gray: colors.gray,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: []
}