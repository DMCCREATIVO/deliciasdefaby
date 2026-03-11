/**
 * Configuración de tema centralizada
 * 
 * Este archivo contiene todas las configuraciones de diseño del sistema:
 * - Colores de la marca
 * - Espaciados
 * - Bordes redondeados
 * - Sombras
 * - Animaciones
 * 
 * Los colores principales son:
 * - Café oscuro (#5C4033)
 * - Rosado oscuro (#C71585)
 * - Beige claro (#F8F0E3)
 */

export const theme = {
  colors: {
    primary: {
      DEFAULT: "#FF69B4", // Updated to brand pink
      dark: "#C71585",
      light: "#FFB6C1",
      hover: "#FF1493",
      muted: "#FF69B440",
    },
    secondary: {
      DEFAULT: "#5C4033", // Updated to brand cafe
      dark: "#3E2A23",
      light: "#8B5E3C",
      hover: "#6B4B3C",
      muted: "#5C403340",
    },
    brand: {
      cafe: {
        DEFAULT: "#5C4033",
        dark: "#3E2A23",
        light: "#8B5E3C",
        hover: "#6B4B3C",
        muted: "#5C403340",
      },
      pink: {
        DEFAULT: "#FF69B4",
        dark: "#C71585",
        light: "#FFB6C1",
        hover: "#FF1493",
        muted: "#FF69B440",
      },
      beige: {
        DEFAULT: "#F8F0E3",
        dark: "#E0D4C4",
        light: "#FFFFFF",
        hover: "#FFF6EA",
        muted: "#F8F0E340",
      },
    },
    gradients: {
      primary: "linear-gradient(135deg, #5C4033 0%, #8B5E3C 100%)",
      secondary: "linear-gradient(135deg, #C71585 0%, #FF69B4 100%)",
      accent: "linear-gradient(135deg, #FF69B4 0%, #FFF6EA 100%)",
      dark: "linear-gradient(135deg, #3E2A23 0%, #5C4033 100%)",
      glow: "radial-gradient(circle at center, #C7158540 0%, transparent 70%)",
      glass: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    },
  },
  spacing: {
    container: "2rem",
    section: "6rem",
    small: "0.5rem",
    medium: "1rem",
    large: "2rem",
    xlarge: "4rem",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "16px",
    full: "9999px",
  },
  shadows: {
    small: "0 1px 3px rgba(0, 0, 0, 0.12)",
    medium: "0 4px 6px rgba(0, 0, 0, 0.12)",
    large: "0 10px 20px rgba(0, 0, 0, 0.15)",
    xlarge: "0 20px 40px rgba(0, 0, 0, 0.2)",
  },
  animations: {
    wave: "wave 1.5s ease-in-out infinite",
    "wave-fast": "wave 1s ease-in-out infinite",
    "wave-slow": "wave 2s ease-in-out infinite",
  },
};