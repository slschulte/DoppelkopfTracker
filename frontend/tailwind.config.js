/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'doppelkopf': {
          'red': '#DC2626',
          'black': '#1F2937',
          'table': '#065F46',
          'card': '#FEF3C7',
        }
      }
    },
  },
  plugins: [],
}
