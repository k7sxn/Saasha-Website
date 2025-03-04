/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        saasha: {
          brown: '#604119',
          rose: '#9b6a5f',
          cream: '#e4e2dd',
        },
      },
    },
  },
  plugins: [],
};