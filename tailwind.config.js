/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'garden': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'earth': {
          50: '#fefcf3',
          100: '#fef7e0',
          200: '#fcefc7',
          300: '#f9e3a1',
          400: '#f5d371',
          500: '#f1c232',
          600: '#e2a422',
          700: '#bc7f1e',
          800: '#996420',
          900: '#7d541e',
        }
      }
    },
  },
  plugins: [],
}