// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // use camelCase keys here
        darkBg:     "#04110E",
        emeraldNeon:"#00FF9E",
      },
    },
  },
  plugins: [],
};
