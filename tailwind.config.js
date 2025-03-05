/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saasha: {
          brown: '#604119',
          rose: '#9b6a5f',
          cream: '#e4e2dd',
        },
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          text: '#e4e2dd',
          accent: '#9b6a5f',
        },
      },
    },
  },
  plugins: [],
};