/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        samaj: {
          50: '#f0f4fe',
          100: '#ddc0b0',
          500: '#1e3a8a',
          600: '#1d4ed8',
          700: '#1e40af',
          gold: '#eab308',
          goldLight: '#fef08a'
        }
      }
    },
  },
  plugins: [],
};
