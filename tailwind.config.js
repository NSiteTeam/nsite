/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indicator: "#4a587c",
        marked: "#e27746",
        background1: "#556691",
        background2: "#10131c",
      }
    },
  },
  plugins: [],
}
