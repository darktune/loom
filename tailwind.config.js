/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Abraham's Collection Strict Design Tokens
        burgundy: {
          DEFAULT: '#5B0F18', // Primary brand backdrop
          wine: '#5B0F18',
          cherry: '#800020', // Primary CTAs
          maroon: '#630000',
          deep: '#3B0A10',
          glow: 'rgba(128, 0, 32, 0.4)',
        },
        noir: {
          DEFAULT: '#1B1717', // Canvas backdrop
          obsidian: '#120F0D',
          card: '#181413',
        },
        cream: {
          ivory: '#FFFAEF', // Light panels & headlines
          soft: '#F8F1E7',  // Input cards
          muted: '#E6DDD0',
        },
        gold: {
          artisan: '#C9A96E', // Luxury badges & accents
          foil: '#C9A96E',
          shimmer: '#E5C989',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Inter"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(201, 169, 110, 0.25)',
        'burgundy-glow': '0 0 30px rgba(128, 0, 32, 0.35)',
        'obsidian-glow': '0 10px 40px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
