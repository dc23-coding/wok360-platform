/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#00BFFF',
        surfaceLight: '#F3F4F6', // Light gray for tablet container
        surfaceDark: '#1F2937', // Dark gray for tablet container
      },
    },
  },
  plugins: [],
};