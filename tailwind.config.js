/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
    screens: {
      sm: "585px",
      md: "787px",
      lg: "1024px"
    }
  },
  plugins: [require('flowbite/plugin')],
}

