import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",   // Azul oscuro profesional
        secondary: "#0F172A", // Azul petróleo para secciones contrastadas
      },
    },
  },
  plugins: [typography],
};
