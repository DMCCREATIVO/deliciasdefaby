import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(45deg, #5C4033 0%, #8B5E3C 100%)",
        "gradient-secondary": "linear-gradient(45deg, #8B5E3C 0%, #C71585 100%)",
        "gradient-accent": "linear-gradient(45deg, #C71585 0%, #FF69B4 100%)",
        "gradient-light": "linear-gradient(45deg, #F8F0E3 0%, #FFFFFF 100%)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#5C4033", // Café oscuro
          foreground: "#FFFFFF",
          dark: "#3E2A23",
          light: "#8B5E3C",
        },
        secondary: {
          DEFAULT: "#C71585", // Rosado oscuro
          foreground: "#FFFFFF",
          dark: "#8B0A50",
          light: "#FF69B4",
        },
        brand: {
          cafe: {
            DEFAULT: "#5C4033",
            dark: "#3E2A23",
            light: "#8B5E3C",
          },
          rosado: {
            DEFAULT: "#C71585",
            dark: "#8B0A50",
            light: "#FF69B4",
          },
          beige: {
            DEFAULT: "#F8F0E3",
            dark: "#E0D4C4",
            light: "#FFFFFF",
          },
        },
        gradients: {
          primary: "linear-gradient(45deg, #5C4033 0%, #8B5E3C 100%)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'brand-pink': '#e11d48',
        'brand-beige': '#f5e9da',
        'brand-cafe': '#7c4f2c',
        'brand-brown': '#a97c50',
        'brand-rosado': '#f472b6',
        'brand-primary': '#e11d48',
        'brand-secondary': '#f5e9da',
        'brand-bg': '#f9fafb',
        'brand-dark': '#18181b',
        'brand-gray': '#f3f4f6',
        'brand-accent': '#fbbf24',
      },
      spacing: {
        container: "2rem",
        section: "6rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "slow-zoom": {
          "0%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1.1)",
          },
        },
        "wave": {
          "0%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        "ping-slow": {
          "0%": {
            transform: "scale(1)",
            opacity: "0.8",
          },
          "70%": {
            transform: "scale(1.5)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1.5)",
            opacity: "0",
          }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-down": "fade-down 0.5s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "slow-zoom": "slow-zoom 20s ease-out infinite alternate",
        "wave": "wave 1.5s ease-in-out infinite",
        "wave-fast": "wave 1s ease-in-out infinite",
        "wave-slow": "wave 2s ease-in-out infinite",
        "wave-delay-1": "wave 1.5s ease-in-out infinite 0.5s",
        "wave-delay-2": "wave 1.5s ease-in-out infinite 1s",
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;