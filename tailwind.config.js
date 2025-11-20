import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // el ThemeProvider ya agrega la clase "dark"
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Colores base
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#64748b",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#d7c204ff",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          dark: "#1e293b",
        },

        // 🌞 Colores de fondo según modo
        background: {
          light: "#ffffff",
          dark: "#0f172a",
        },

        // 🧾 Colores de texto según modo
        foreground: {
          light: "#0f172a",
          dark: "#f8fafc",
        },

        border: {
          light: "#e2e8f0",
          dark: "#334155",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.1)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      transitionDuration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
      },
    },
  },

  plugins: [
    plugin(function ({ addBase, theme }) {
      // 🌗 Estilos base dinámicos para el tema claro/oscuro
      addBase({
        "*": {
          borderColor: theme("colors.border.light"),
          transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
        },
        body: {
          backgroundColor: theme("colors.background.light"),
          color: theme("colors.foreground.light"),
        },
        ".dark body": {
          backgroundColor: theme("colors.background.dark"),
          color: theme("colors.foreground.dark"),
        },
      });
    }),
  ],
};
