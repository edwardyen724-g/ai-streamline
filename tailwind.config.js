const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "components/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "app/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Tailwind blue
        secondary: "#34d399", // Tailwind green
        accent: "#fbbf24", // Tailwind yellow
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};