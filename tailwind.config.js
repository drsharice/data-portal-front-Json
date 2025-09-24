/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#D71E28",   // Primary Red
          black: "#141414", // Black
          gdark: "#787070", // Dark Grey
          gmid: "#B5ADAD",  // Mid Grey
          glight: "#F4F0ED",// Light Grey
          yellow4: "#FFF7E2"// Yellow Tint 4
        }
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
