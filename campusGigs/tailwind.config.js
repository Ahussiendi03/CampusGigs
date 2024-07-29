/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          700: '#800000', // Define your maroon color here
        },
        gold: {
          DEFAULT: '#FFD700',
        },
      },
    },
  },
  plugins: [],
}

