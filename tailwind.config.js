/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Entain branding colors (purple theme)
        'entain-purple': '#7B2CBF',
        'entain-purple-light': '#9D4EDD',
        'entain-purple-dark': '#5A189A',
        'entain-dark': '#1A1A1A',
        'entain-darker': '#0D0D0D',
        'entain-gray': '#2D2D2D',
        'entain-light-gray': '#F5F5F5',
        'entain-accent': '#C77DFF',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

