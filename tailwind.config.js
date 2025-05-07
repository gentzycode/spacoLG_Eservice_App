// tailwind.config.js
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      keyframes: {
        subtleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        subtleBounce: 'subtleBounce 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
