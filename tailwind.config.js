import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      colors: {
        // 🎨 Paleta moderna inspirada en el global.css de Vercel v0
        background: "oklch(0.98 0.002 264)", // fondo claro gris-azulado
        foreground: "oklch(0.15 0.01 264)", // texto oscuro
        card: "oklch(1 0 0)", // blanco puro
        cardForeground: "oklch(0.15 0.01 264)",
        popover: "oklch(1 0 0)",
        popoverForeground: "oklch(0.15 0.01 264)",

        primary: "oklch(0.45 0.18 264)", // azul eléctrico profundo
        onPrimary: "oklch(0.98 0.002 264)", // texto claro sobre azul

        secondary: "oklch(0.92 0.01 264)", // gris-azulado suave
        onSecondary: "oklch(0.15 0.01 264)",

        muted: "oklch(0.94 0.01 264)",
        onMuted: "oklch(0.5 0.02 264)",

        accent: "oklch(0.92 0.01 264)",
        onAccent: "oklch(0.15 0.01 264)",

        destructive: "oklch(0.577 0.245 27.325)", // rojo moderno
        onDestructive: "oklch(0.98 0.002 264)",

        border: "oklch(0.88 0.01 264)",
        input: "oklch(0.88 0.01 264)",
        ring: "oklch(0.45 0.18 264)",

        sidebar: "oklch(0.98 0.002 264)",
        sidebarForeground: "oklch(0.15 0.01 264)",
        sidebarPrimary: "oklch(0.45 0.18 264)",
        sidebarPrimaryForeground: "oklch(0.98 0.002 264)",
        sidebarAccent: "oklch(0.92 0.01 264)",
        sidebarAccentForeground: "oklch(0.15 0.01 264)",
        sidebarBorder: "oklch(0.88 0.01 264)",
        sidebarRing: "oklch(0.45 0.18 264)",

        dark: {
          background: "oklch(0.12 0.02 264)",
          foreground: "oklch(0.95 0.01 264)",
          card: "oklch(0.16 0.02 264)",
          cardForeground: "oklch(0.95 0.01 264)",
          popover: "oklch(0.16 0.02 264)",
          popoverForeground: "oklch(0.95 0.01 264)",
          primary: "oklch(0.6 0.22 264)",
          onPrimary: "oklch(0.98 0.002 264)",
          secondary: "oklch(0.22 0.02 264)",
          onSecondary: "oklch(0.95 0.01 264)",
          muted: "oklch(0.22 0.02 264)",
          onMuted: "oklch(0.65 0.02 264)",
          accent: "oklch(0.22 0.02 264)",
          onAccent: "oklch(0.95 0.01 264)",
          destructive: "oklch(0.55 0.25 27)",
          onDestructive: "oklch(0.98 0.002 264)",
          border: "oklch(0.24 0.02 264)",
          input: "oklch(0.24 0.02 264)",
          ring: "oklch(0.6 0.22 264)",
          sidebar: "oklch(0.14 0.02 264)",
          sidebarForeground: "oklch(0.95 0.01 264)",
          sidebarPrimary: "oklch(0.6 0.22 264)",
          sidebarPrimaryForeground: "oklch(0.98 0.002 264)",
          sidebarAccent: "oklch(0.22 0.02 264)",
          sidebarAccentForeground: "oklch(0.95 0.01 264)",
          sidebarBorder: "oklch(0.24 0.02 264)",
          sidebarRing: "oklch(0.6 0.22 264)",
        },
      },
      borderRadius: {
        sm: "calc(0.75rem - 4px)",
        md: "calc(0.75rem - 2px)",
        lg: "0.75rem",
        xl: "calc(0.75rem + 4px)",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents }) {

      addBase({
        "*": {
          borderColor: "theme('colors.border')",
          outlineColor: "theme('colors.ring / 50%')",
        },
        body: {
          backgroundColor: "theme('colors.background')",
          color: "theme('colors.foreground')",
        },
        ".dark body": {
          backgroundColor: "theme('colors.dark.background')",
          color: "theme('colors.dark.foreground')",
        },
      });
      
      addComponents({
        // 🌟 Botones
        ".btn": {
          width: "20rem",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          borderRadius: "0.5rem",
          transitionProperty: "all",
          transitionDuration: "200ms",
          fontWeight: "500",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        ".btn-primary": {
          backgroundColor: "oklch(0.45 0.18 264)",
          color: "oklch(0.98 0.002 264)",
          "&:hover": {
            backgroundColor: "oklch(0.6 0.22 264)", // azul más brillante en hover
          },
        },
        ".btn-dark": {
          backgroundColor: "oklch(0.45 0.18 264)",
          color: "oklch(0.98 0.002 264)",
          "&:hover": {
            backgroundColor: "oklch(0.6 0.22 264)", // azul más brillante en hover
          },
        },
        ".btn-secondary": {
          backgroundColor: "oklch(0.92 0.01 264)",
          color: "oklch(0.15 0.01 264)",
          "&:hover": {
            backgroundColor: "oklch(0.88 0.01 264)",
          },
        },
        ".btn-destructive": {
          backgroundColor: "oklch(0.577 0.245 27.325)",
          color: "oklch(0.98 0.002 264)",
          "&:hover": {
            backgroundColor: "oklch(0.55 0.25 27)",
          },
        },
        // 🧾 Formularios / Headers
        ".form-header": {
          backgroundImage: "linear-gradient(to right, oklch(0.6 0.22 264), oklch(0.25 0.18 264))",
          color: "oklch(0.98 0.002 264)",
          padding: "0.75rem",
          borderTopLeftRadius: "0.60rem",
          borderTopRightRadius: "0.60rem",
        },
        ".form-title": {
          fontSize: "1.5rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#fffffff", 
        },
        ".consultar-icon": {
          width: "1.5rem",
          height: "1.5rem",
          color: "#ffffff", // marrón/dorado oscuro
        },


        
      });
    }),
  ],
};
