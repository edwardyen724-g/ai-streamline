const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[600],
        secondary: colors.green[500],
        accent: colors.purple[600],
        neutral: colors.gray[800],
        'base-100': colors.white,
        'info': colors.blue[300],
        'success': colors.green[300],
        'warning': colors.yellow[300],
        'error': colors.red[600],
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};