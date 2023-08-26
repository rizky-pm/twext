/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#2D3047',
        white: '#FFFDFD',
        'primary-dark': '#1878ca',
        primary: '#1E96FC',
        'primary-light': '#4babfd',
      },
    },
  },
  plugins: [],
};
