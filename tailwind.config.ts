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
          DEFAULT: "var(--theme-accent, #5C4033)",
          foreground: "var(--theme-primary-btn-text, #FFFFFF)",
          dark: "var(--theme-accent-secondary, #3E2A23)",
          light: "var(--theme-accent, #8B5E3C)",
        },
        secondary: {
          DEFAULT: "var(--theme-sidebar-bg, #C71585)",
          foreground: "var(--theme-sidebar-text, #FFFFFF)",
          dark: "var(--theme-sidebar-hover, #8B0A50)",
          light: "var(--theme-sidebar-accent, #FF69B4)",
        },
        brand: {
          cafe: {
            DEFAULT: "var(--theme-accent, #5C4033)",
            dark: "var(--theme-accent-secondary, #3E2A23)",
            light: "var(--theme-sidebar-accent, #8B5E3C)",
          },
          rosado: {
            DEFAULT: "var(--theme-primary-btn, #C71585)",
            dark: "var(--theme-sidebar-bg, #8B0A50)",
            light: "var(--theme-card-border, #FF69B4)",
          },
          beige: {
            DEFAULT: "var(--theme-main-bg, #F8F0E3)",
            dark: "var(--theme-card-bg, #E0D4C4)",
            light: "var(--theme-stat-1, #FFFFFF)",
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
        'brand-pink': 'var(--theme-accent, #e11d48)',
        'brand-beige': 'var(--theme-main-bg, #f5e9da)',
        'brand-cafe': 'var(--theme-sidebar-bg, #7c4f2c)',
        'brand-brown': 'var(--theme-accent-secondary, #a97c50)',
        'brand-rosado': 'var(--theme-primary-btn, #f472b6)',
        'brand-primary': 'var(--theme-accent, #e11d48)',
        'brand-secondary': 'var(--theme-header-bg, #f5e9da)',
        'brand-bg': 'var(--theme-main-bg, #f9fafb)',
        'brand-dark': 'var(--theme-text-primary, #18181b)',
        'brand-gray': 'var(--theme-card-border, #f3f4f6)',
        'brand-accent': 'var(--theme-sidebar-accent, #fbbf24)',
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