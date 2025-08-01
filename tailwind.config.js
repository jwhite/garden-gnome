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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
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