const { gray } = require('d3');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:'#000000',
        secondary: '#53170C',
        thrid:'#777777',
        fourth:'#F5F7FA',
        fiveth:'#1A365D',
        dark: '#2C3E50',
        indigo:'#1E1B39',
        


      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      poppins: ['Poppins', 'sans-serif'],
    },
  },
  plugins: [],
}