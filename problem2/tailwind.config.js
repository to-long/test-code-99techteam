/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '425px',
      },
    },
  },
  darkMode: 'selector',
  plugins: [],
};
