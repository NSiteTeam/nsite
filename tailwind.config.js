/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "marker": "#e27746",
        "primary": "#414d6c",
        "primary-light": "#556691",
        "primary-mid": "#4b5b81",
        "primary-mid-light": "#465477",
        "primary-dark": "#303950",
      }
    },
  },
  plugins: [],
}
