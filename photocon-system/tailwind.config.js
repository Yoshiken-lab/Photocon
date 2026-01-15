/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E84D1C',
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFD4C4',
          600: '#D63E0F',
        },
        text: {
          main: '#4A4A4A',
          light: '#888888',
        },
      },
      fontFamily: {
        sans: ['"Yu Gothic"', '"Meiryo"', 'sans-serif'],
        maru: ['"Kiwi Maru"', 'serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
