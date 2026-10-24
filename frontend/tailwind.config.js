/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academia: {
          charcoal: "#121316",
          dark: "#18191e",
          surface: "#21222a",
          border: "#323440",
          burgundy: {
            DEFAULT: "#6b1d2f",
            hover: "#822439",
            dark: "#45121e",
            glow: "#a32f48"
          },
          gold: {
            DEFAULT: "#d4af37",
            light: "#f3e5ab",
            dark: "#997d26",
            muted: "#c5a059"
          },
          parchment: "#f4ede2",
          parchmentMuted: "#c8beaf"
        }
      },
      fontFamily: {
        serif: ["Cinzel", "Georgia", "serif"],
        mono: ["Fira Code", "Courier New", "monospace"],
        sans: ["Outfit", "Inter", "sans-serif"]
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.25)',
        'burgundy-glow': '0 0 20px rgba(107, 29, 47, 0.35)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)'
      }
    },
  },
  plugins: [],
}
