// tailwind.config.js
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Kantumruy Pro"', 'Inter', 'sans-serif'], // Khmer + English fallback
      },
    },
  },
  plugins: [],
}
