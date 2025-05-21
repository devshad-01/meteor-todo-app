/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/**/*.{js,jsx,html}',
    './imports/ui/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
