/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom brand colors here
        boardBlue: '#0079bf',
      },
    },
  },
  plugins: [],
}
