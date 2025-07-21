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
      backgroundImage: {
        'starry-green-yellow': 
          'radial-gradient(circle at center, #0b1b33 0%, #1f4422 60%, #ccff66 100%)',
      }
    },
  },
  plugins: [],
};
