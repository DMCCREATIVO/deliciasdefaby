import { useMemo } from 'react';

interface AdminThemeConfig {
  // Colores de fondo
  backgrounds: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    accent: string;
    accentLight: string;
    surface: string;
    surfaceHover: string;
  };
  
  // Colores de texto
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  
  // Bordes y sombras
  borders: {
    default: string;
    light: string;
  };
  
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  // Gradientes
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
  
  // Estados
  states: {
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;
    info: string;
    infoLight: string;
  };
  
  // Componentes comunes
  components: {
    card: string;
    cardHover: string;
    cardHeader: string;
    buttonPrimary: string;
    buttonSecondary: string;
    input: string;
    badgeSuccess: string;
    badgeWarning: string;
    badgeError: string;
    badgeInfo: string;
  };
}

export const useAdminTheme = (): AdminThemeConfig => {
  const theme = useMemo<AdminThemeConfig>(() => ({
    backgrounds: {
      primary: 'admin-bg-primary',
      primaryLight: 'admin-bg-primary-light',
      primaryDark: 'admin-bg-primary-dark',
      secondary: 'admin-bg-secondary',
      secondaryLight: 'admin-bg-secondary-light',
      secondaryDark: 'admin-bg-secondary-dark',
      accent: 'admin-bg-accent',
      accentLight: 'admin-bg-accent-light',
      surface: 'bg-white',
      surfaceHover: 'hover:bg-gray-50',
    },
    
    text: {
      primary: 'admin-text-primary',
      secondary: 'admin-text-secondary',
      muted: 'admin-text-muted',
      inverse: 'admin-text-inverse',
    },
    
    borders: {
      default: 'admin-border',
      light: 'admin-border-light',
    },
    
    shadows: {
      sm: 'admin-shadow-sm',
      md: 'admin-shadow-md',
      lg: 'admin-shadow-lg',
      xl: 'admin-shadow-xl',
    },
    
    gradients: {
      primary: 'admin-gradient-primary',
      secondary: 'admin-gradient-secondary',
      accent: 'admin-gradient-accent',
    },
    
    states: {
      success: 'admin-bg-success',
      successLight: 'admin-bg-success-light',
      warning: 'admin-bg-warning',
      warningLight: 'admin-bg-warning-light',
      error: 'admin-bg-error',
      errorLight: 'admin-bg-error-light',
      info: 'admin-bg-info',
      infoLight: 'admin-bg-info-light',
    },
    
    components: {
      card: 'admin-card',
      cardHover: 'admin-card:hover',
      cardHeader: 'admin-card-header',
      buttonPrimary: 'admin-button-primary admin-hover-primary',
      buttonSecondary: 'admin-button-secondary admin-hover-secondary',
      input: 'admin-input',
      badgeSuccess: 'admin-badge-success',
      badgeWarning: 'admin-badge-warning',
      badgeError: 'admin-badge-error',
      badgeInfo: 'admin-badge-info',
    },
  }), []);

  return theme;
};

// Utilidades adicionales para combinar clases
export const combineAdminClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Presets comunes para componentes del admin
export const adminComponentPresets = {
  // Cards mejoradas
  statsCard: 'admin-card p-6 admin-hover-secondary',
  actionCard: 'admin-card p-4 cursor-pointer admin-hover-primary',
  infoCard: 'admin-card admin-card-header',
  
  // Botones
  primaryButton: 'admin-button-primary',
  secondaryButton: 'admin-button-secondary',
  dangerButton: 'admin-bg-error admin-text-inverse px-4 py-2 rounded-lg hover:opacity-90 transition-all',
  
  // Inputs y formularios
  formInput: 'admin-input w-full',
  formLabel: 'admin-text-secondary font-medium mb-2 block',
  formGroup: 'mb-4',
  
  // Navegación
  navItem: 'admin-text-secondary hover:admin-text-primary p-3 rounded-lg transition-all admin-hover-secondary',
  navItemActive: 'admin-bg-primary admin-text-inverse p-3 rounded-lg',
  
  // Tablas
  tableHeader: 'admin-bg-secondary-light admin-text-primary font-semibold p-3 border-b admin-border-light',
  tableCell: 'p-3 border-b admin-border-light admin-text-secondary',
  tableRow: 'hover:admin-bg-secondary-light transition-colors',
  
  // Estados
  statusSuccess: 'admin-badge-success',
  statusWarning: 'admin-badge-warning',
  statusError: 'admin-badge-error',
  statusInfo: 'admin-badge-info',
  
  // Contenedores principales
  pageContainer: 'min-h-screen admin-bg-secondary-light p-6',
  contentContainer: 'max-w-7xl mx-auto',
  sectionContainer: 'admin-card p-6 mb-6',
}; 