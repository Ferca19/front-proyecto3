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
        // 🎨 Nueva Paleta: Violeta/Indigo Moderno (Aesthetic & Deep)
        // Se cambió del azul (hue 264) al violeta (hue 285-290) para un look más "tech" y creativo.
        
        background: "oklch(0.97 0.01 290)", // Lavanda muy pálido / grisaceo
        foreground: "oklch(0.14 0.05 285)", // Violeta muy oscuro

        card: "oklch(1 0 0)", 
        cardForeground: "oklch(0.14 0.05 285)",
        
        popover: "oklch(1 0 0)",
        popoverForeground: "oklch(0.14 0.05 285)",

        primary: "oklch(0.55 0.22 285)", // Violeta Eléctrico
        onPrimary: "oklch(0.98 0.005 290)",

        secondary: "oklch(0.94 0.03 285)", // Lavanda suave
        onSecondary: "oklch(0.25 0.1 285)",

        muted: "oklch(0.96 0.01 285)",
        onMuted: "oklch(0.5 0.05 285)",

        accent: "oklch(0.94 0.03 285)",
        onAccent: "oklch(0.25 0.1 285)",

        destructive: "oklch(0.6 0.2 20)", // Rojo coral
        onDestructive: "oklch(0.98 0 0)",

        border: "oklch(0.92 0.02 285)",
        input: "oklch(0.92 0.02 285)",
        ring: "oklch(0.55 0.22 285)",

        sidebar: "oklch(0.98 0.005 290)",
        sidebarForeground: "oklch(0.14 0.05 285)",
        sidebarPrimary: "oklch(0.55 0.22 285)",
        sidebarPrimaryForeground: "oklch(0.98 0.005 290)",
        sidebarAccent: "oklch(0.94 0.03 285)",
        sidebarAccentForeground: "oklch(0.25 0.1 285)",
        sidebarBorder: "oklch(0.92 0.02 285)",
        sidebarRing: "oklch(0.55 0.22 285)",

        dark: {
          background: "oklch(0.15 0.01 260)",         // ≈ #0d1117
          foreground: "oklch(0.85 0.01 260)",         // ≈ #c9d1d9 (texto principal)

          card: "oklch(0.18 0.01 260)",               // ≈ #161b22
          cardForeground: "oklch(0.88 0.01 260)",

          popover: "oklch(0.18 0.01 260)", 
          popoverForeground: "oklch(0.88 0.01 260)",

          primary: "oklch(0.62 0.12 255)",            // Azul GitHub ≈ #2f81f7
          onPrimary: "oklch(0.98 0.01 260)",

          secondary: "oklch(0.32 0.02 260)",          // ≈ #30363d
          onSecondary: "oklch(0.85 0.02 260)",

          muted: "oklch(0.32 0.015 260)",             // ≈ #30363d
          onMuted: "oklch(0.70 0.015 260)",           // ≈ #8b949e

          accent: "oklch(0.32 0.02 260)",             
          onAccent: "oklch(0.85 0.02 260)",

          destructive: "oklch(0.55 0.25 27)",         // rojo moderno GitHub-ish
          onDestructive: "oklch(0.98 0.01 260)",

          border: "oklch(0.34 0.015 260)",            // ≈ GitHub border
          input: "oklch(0.34 0.015 260)",

          ring: "oklch(0.62 0.12 255)",               // igual que primary
        },
      },
      borderRadius: {
        sm: "calc(0.5rem - 2px)",
        md: "calc(0.75rem - 2px)",
        lg: "1rem",     // Más redondeado
        xl: "1.5rem",   // Aún más redondeado para tarjetas grandes
        "2xl": "2rem",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
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
          width: "100%", // Cambiado a 100% por defecto para mejor respuesta en móviles
          padding: "0.75rem 1.5rem",
          borderRadius: "1rem", // Border radius actualizado
          transitionProperty: "all",
          transitionDuration: "300ms", // Transición un poco más suave
          fontWeight: "600",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          letterSpacing: "0.025em",
        },
        ".btn-primary": {
          backgroundColor: "theme('colors.primary')",
          color: "theme('colors.onPrimary')",
          boxShadow: "0 4px 14px 0 rgba(124, 58, 237, 0.3)", // Sombra coloreada (violeta)
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 6px 20px 0 rgba(124, 58, 237, 0.45)",
            filter: "brightness(1.1)",
          },
          "&:active": {
             transform: "translateY(0px)",
          }
        },
        ".btn-secondary": {
          backgroundColor: "theme('colors.secondary')",
          color: "theme('colors.onSecondary')",
          "&:hover": {
            backgroundColor: "theme('colors.muted')", // Un poco más oscuro
          },
        },
        // 🧾 Formularios / Headers Modernizados
        ".form-header": {
          // Gradiente Violeta a Azul Profundo
          backgroundImage: "linear-gradient(135deg, theme('colors.primary'), oklch(0.4 0.15 270))",
          color: "theme('colors.onPrimary')",
          padding: "1.5rem",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
        },
        ".btn-dark": {
          backgroundColor: "oklch(0.45 0.18 264)",
          color: "oklch(0.98 0.002 264)",
          "&:hover": {
            backgroundColor: "oklch(0.6 0.22 264)", // azul más brillante en hover
          },
        },
        ".btn-destructive": {
          backgroundColor: "oklch(0.577 0.245 27.325)",
          color: "oklch(0.98 0.002 264)",
          "&:hover": {
            backgroundColor: "oklch(0.55 0.25 27)",
          },
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
