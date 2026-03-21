import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pb } from '@/lib/pocketbase/client';
import { toast } from 'sonner';

export interface ThemeColors {
  accent: string;
  accentSecondary: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  headerText: string;
  mainBg: string;
  primaryBtn: string;
  primaryBtnText: string;
  sidebarAccent: string;
  sidebarBg: string;
  sidebarHover: string;
  sidebarText: string;
  textPrimary: string;
  textSecondary: string;
  statCard1?: string;
  statCard2?: string;
  statCard3?: string;
  statCard4?: string;
  festiveEmoji?: string;
  festiveMessage?: string;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: 'base' | 'seasonal' | 'special';
  colors: ThemeColors;
  is_active: boolean;
  is_seasonal: boolean;
  seasonal_start?: string;
  seasonal_end?: string;
  auto_activate: boolean;
  sort_order: number;
}

interface ThemeContextType {
  themes: Theme[];
  currentTheme: Theme | null;
  setTheme: (themeId: string) => Promise<void>;
  isLoading: boolean;
}

// ─── Temas locales de fallback (sincronizados con PocketBase) ────────────────
const FALLBACK_THEMES: Theme[] = [
  {
    id: '1wk79o4m14a435o', slug: 'cafe-canela', name: '☕ Café & Canela',
    description: 'El tema clásico y cálido de la panadería artesanal',
    icon: '☕', category: 'base', is_active: true, is_seasonal: false,
    auto_activate: false, sort_order: 1,
    colors: {
      accent: '#f59e0b', accentSecondary: '#a16207', cardBg: '#ffffff',
      cardBorder: '#e8ddd0', headerBg: '#f59e0b', headerText: '#1a0a00',
      mainBg: '#faf7f2', primaryBtn: '#f59e0b', primaryBtnText: '#1a0a00',
      sidebarAccent: '#f59e0b', sidebarBg: '#3c2415', sidebarHover: '#f59e0b1a',
      sidebarText: '#ffffff', textPrimary: '#1c1008', textSecondary: '#78573e',
      statCard1: '#fef3c7', statCard2: '#fde68a', statCard3: '#fcd34d', statCard4: '#f59e0b',
      festiveEmoji: '☕',
    },
  },
  {
    id: '2kr39719y912u48', slug: 'elegante-oscuro', name: '🌑 Elegante Oscuro',
    description: 'Modo oscuro premium con acentos dorados',
    icon: '🌑', category: 'base', is_active: false, is_seasonal: false,
    auto_activate: false, sort_order: 2,
    colors: {
      accent: '#f59e0b', accentSecondary: '#d97706', cardBg: '#1e1e30',
      cardBorder: '#2d2d45', headerBg: '#f59e0b', headerText: '#0f0f1a',
      mainBg: '#0f0f1a', primaryBtn: '#f59e0b', primaryBtnText: '#0f0f1a',
      sidebarAccent: '#f59e0b', sidebarBg: '#1a1a2e', sidebarHover: '#f59e0b1a',
      sidebarText: '#e2e8f0', textPrimary: '#f1f5f9', textSecondary: '#94a3b8',
      statCard1: '#1e1e30', statCard2: '#252540', statCard3: '#2a2a50', statCard4: '#1a1a2e',
      festiveEmoji: '🌑',
    },
  },
  {
    id: '44qmju2p7994s97', slug: 'rosa-pasteleria', name: '🌸 Rosa Pastería',
    description: 'Rosado vibrante, femenino y moderno',
    icon: '🌸', category: 'base', is_active: false, is_seasonal: false,
    auto_activate: false, sort_order: 3,
    colors: {
      accent: '#f43f5e', accentSecondary: '#e11d48', cardBg: '#ffffff',
      cardBorder: '#fecdd3', headerBg: '#be123c', headerText: '#ffffff',
      mainBg: '#fef9f0', primaryBtn: '#be123c', primaryBtnText: '#ffffff',
      sidebarAccent: '#f43f5e', sidebarBg: '#be123c', sidebarHover: '#ffffff1a',
      sidebarText: '#ffffff', textPrimary: '#1a0010', textSecondary: '#9f1239',
      statCard1: '#fff1f2', statCard2: '#ffe4e6', statCard3: '#fecdd3', statCard4: '#fda4af',
      festiveEmoji: '🌸',
    },
  },
  {
    id: '50ye2f9et9puy24', slug: 'verde-natural', name: '🌿 Verde Natural',
    description: 'Fresco y natural, estilo panadería orgánica',
    icon: '🌿', category: 'base', is_active: false, is_seasonal: false,
    auto_activate: false, sort_order: 4,
    colors: {
      accent: '#10b981', accentSecondary: '#059669', cardBg: '#ffffff',
      cardBorder: '#bbf7d0', headerBg: '#166534', headerText: '#ffffff',
      mainBg: '#f0fdf4', primaryBtn: '#166534', primaryBtnText: '#ffffff',
      sidebarAccent: '#10b981', sidebarBg: '#166534', sidebarHover: '#ffffff1a',
      sidebarText: '#ffffff', textPrimary: '#052e16', textSecondary: '#166534',
      statCard1: '#f0fdf4', statCard2: '#dcfce7', statCard3: '#bbf7d0', statCard4: '#86efac',
      festiveEmoji: '🌿',
    },
  },
  {
    id: '42o9v2nf0x15cu9', slug: 'navidad', name: '🎄 Navidad & Año Nuevo',
    description: 'El espíritu navideño con rojo, verde y dorado',
    icon: '🎄', category: 'seasonal', is_active: false, is_seasonal: true,
    auto_activate: true, sort_order: 5,
    seasonal_start: '12-01', seasonal_end: '01-06',
    colors: {
      accent: '#dc2626', accentSecondary: '#fbbf24', cardBg: '#1a2e1a',
      cardBorder: '#dc262633', headerBg: '#dc2626', headerText: '#ffffff',
      mainBg: '#0f1f0f', primaryBtn: '#dc2626', primaryBtnText: '#ffffff',
      sidebarAccent: '#dc2626', sidebarBg: '#1a4731', sidebarHover: '#dc26261a',
      sidebarText: '#d1fae5', textPrimary: '#f0fdf4', textSecondary: '#86efac',
      statCard1: '#1a2e1a', statCard2: '#1a2e1a', statCard3: '#1a2e1a', statCard4: '#1a2e1a',
      festiveEmoji: '🎄', festiveMessage: '¡Feliz Navidad y Próspero Año Nuevo! 🎄✨',
    },
  },
  {
    id: 'ryyht9so7u712v7', slug: 'dia-del-amor', name: '❤️ Día del Amor y la Amistad',
    description: 'Día del Amor, rosas y corazones (14 de Febrero)',
    icon: '❤️', category: 'seasonal', is_active: false, is_seasonal: true,
    auto_activate: true, sort_order: 6,
    seasonal_start: '02-07', seasonal_end: '02-15',
    colors: {
      accent: '#e11d48', accentSecondary: '#9f1239', cardBg: '#ffffff',
      cardBorder: '#fda4af', headerBg: '#9f1239', headerText: '#ffffff',
      mainBg: '#fce7f3', primaryBtn: '#9f1239', primaryBtnText: '#ffffff',
      sidebarAccent: '#fda4af', sidebarBg: '#881337', sidebarHover: '#ffffff1a',
      sidebarText: '#fce7f3', textPrimary: '#3b0018', textSecondary: '#9f1239',
      statCard1: '#fff1f2', statCard2: '#ffe4e6', statCard3: '#fecdd3', statCard4: '#fda4af',
      festiveEmoji: '❤️', festiveMessage: '¡Feliz Día del Amor y la Amistad! ❤️🌹',
    },
  },
  {
    id: 'x7r0053w1870ed5', slug: 'fiestas-patrias', name: '🇨🇱 Fiestas Patrias',
    description: 'Colores patrios de Chile, Rojo-Blanco-Azul (Sep 18)',
    icon: '🇨🇱', category: 'seasonal', is_active: false, is_seasonal: true,
    auto_activate: true, sort_order: 7,
    seasonal_start: '09-12', seasonal_end: '09-20',
    colors: {
      accent: '#dc2626', accentSecondary: '#1d4ed8', cardBg: '#ffffff',
      cardBorder: '#bfdbfe', headerBg: '#1d4ed8', headerText: '#ffffff',
      mainBg: '#eff6ff', primaryBtn: '#dc2626', primaryBtnText: '#ffffff',
      sidebarAccent: '#fbbf24', sidebarBg: '#1d4ed8', sidebarHover: '#ffffff1a',
      sidebarText: '#ffffff', textPrimary: '#1e3a5f', textSecondary: '#1d4ed8',
      statCard1: '#eff6ff', statCard2: '#dbeafe', statCard3: '#fef2f2', statCard4: '#fee2e2',
      festiveEmoji: '🇨🇱', festiveMessage: '¡Viva Chile! 🇨🇱 ¡Felices Fiestas Patrias! 18 de Septiembre',
    },
  },
  {
    id: 'kmot1999x638f58', slug: 'dia-madre', name: '🏵️ Día de la Madre',
    description: 'Lila y rosas para honrar a las madres (2º domingo de Mayo)',
    icon: '🏵️', category: 'seasonal', is_active: false, is_seasonal: true,
    auto_activate: true, sort_order: 8,
    seasonal_start: '05-10', seasonal_end: '05-19',
    colors: {
      accent: '#a855f7', accentSecondary: '#7c3aed', cardBg: '#ffffff',
      cardBorder: '#e9d5ff', headerBg: '#7c3aed', headerText: '#ffffff',
      mainBg: '#faf5ff', primaryBtn: '#7c3aed', primaryBtnText: '#ffffff',
      sidebarAccent: '#c084fc', sidebarBg: '#581c87', sidebarHover: '#ffffff1a',
      sidebarText: '#f3e8ff', textPrimary: '#3b0764', textSecondary: '#7c3aed',
      statCard1: '#faf5ff', statCard2: '#f3e8ff', statCard3: '#e9d5ff', statCard4: '#d8b4fe',
      festiveEmoji: '🏵️', festiveMessage: '¡Feliz Día Mamá! Te queremos mucho 🏵️❤️',
    },
  },
  {
    id: 'q5h0sxef7t77uoi', slug: 'otono', name: '🍂 Otoño Criollo',
    description: 'Colores cálidos del otoño, naranjas y marrones (Abr-Jun)',
    icon: '🍂', category: 'seasonal', is_active: false, is_seasonal: true,
    auto_activate: true, sort_order: 9,
    seasonal_start: '03-21', seasonal_end: '06-21',
    colors: {
      accent: '#f97316', accentSecondary: '#ea580c', cardBg: '#ffffff',
      cardBorder: '#fed7aa', headerBg: '#c2410c', headerText: '#ffffff',
      mainBg: '#fff7ed', primaryBtn: '#c2410c', primaryBtnText: '#ffffff',
      sidebarAccent: '#fb923c', sidebarBg: '#7c2d12', sidebarHover: '#ffffff1a',
      sidebarText: '#ffedd5', textPrimary: '#431407', textSecondary: '#c2410c',
      statCard1: '#fff7ed', statCard2: '#ffedd5', statCard3: '#fed7aa', statCard4: '#fdba74',
      festiveEmoji: '🍂', festiveMessage: '🎃 Bienvenido el Otoño 🍂 Los mejores especiales de temporada te esperan',
    },
  },
  {
    id: '13bjv2d8nhmyieq', slug: 'invierno', name: '❄️ Invierno Sereno',
    description: 'Azules fríos del invierno (Jul-Sep)',
    icon: '❄️', category: 'seasonal', is_active: false, is_seasonal: true,
    auto_activate: true, sort_order: 10,
    seasonal_start: '06-21', seasonal_end: '09-22',
    colors: {
      accent: '#06b6d4', accentSecondary: '#0891b2', cardBg: '#ffffff',
      cardBorder: '#a5f3fc', headerBg: '#0e7490', headerText: '#ffffff',
      mainBg: '#ecfeff', primaryBtn: '#0e7490', primaryBtnText: '#ffffff',
      sidebarAccent: '#22d3ee', sidebarBg: '#164e63', sidebarHover: '#ffffff1a',
      sidebarText: '#cffafe', textPrimary: '#083344', textSecondary: '#0e7490',
      statCard1: '#ecfeff', statCard2: '#cffafe', statCard3: '#a5f3fc', statCard4: '#67e8f9',
      festiveEmoji: '❄️', festiveMessage: '¡Bienvenido el Invierno! ❄️ Calienta el alma con nuestros productos artesanales',
    },
  },
  // ─── NUEVOS TEMAS BASE ───────────────────────────────────────────────────
  {
    id: 'tm-azul-marino', slug: 'azul-marino', name: '🌊 Azul Marino',
    description: 'Profesional y fresco, ideal para confianza',
    icon: '🌊', category: 'base', is_active: false, is_seasonal: false,
    auto_activate: false, sort_order: 11,
    colors: {
      accent: '#0ea5e9', accentSecondary: '#0369a1', cardBg: '#ffffff',
      cardBorder: '#bae6fd', headerBg: '#0c4a6e', headerText: '#ffffff',
      mainBg: '#f0f9ff', primaryBtn: '#0369a1', primaryBtnText: '#ffffff',
      sidebarAccent: '#38bdf8', sidebarBg: '#0c4a6e', sidebarHover: '#ffffff1a',
      sidebarText: '#e0f2fe', textPrimary: '#0c4a6e', textSecondary: '#0369a1',
      statCard1: '#f0f9ff', statCard2: '#e0f2fe', statCard3: '#bae6fd', statCard4: '#7dd3fc',
      festiveEmoji: '🌊',
    },
  },
  {
    id: 'tm-lavanda', slug: 'lavanda', name: '💜 Lavanda Suave',
    description: 'Elegante y calmante, estilo premium',
    icon: '💜', category: 'base', is_active: false, is_seasonal: false,
    auto_activate: false, sort_order: 12,
    colors: {
      accent: '#8b5cf6', accentSecondary: '#6d28d9', cardBg: '#ffffff',
      cardBorder: '#e9d5ff', headerBg: '#5b21b6', headerText: '#ffffff',
      mainBg: '#faf5ff', primaryBtn: '#6d28d9', primaryBtnText: '#ffffff',
      sidebarAccent: '#a78bfa', sidebarBg: '#4c1d95', sidebarHover: '#ffffff1a',
      sidebarText: '#ede9fe', textPrimary: '#3b0764', textSecondary: '#6d28d9',
      statCard1: '#faf5ff', statCard2: '#f3e8ff', statCard3: '#e9d5ff', statCard4: '#d8b4fe',
      festiveEmoji: '💜',
    },
  },
  {
    id: 'tm-crema-clasico', slug: 'crema-clasico', name: '🥐 Crema Clásico',
    description: 'Panadería tradicional, cálido y acogedor',
    icon: '🥐', category: 'base', is_active: false, is_seasonal: false,
    auto_activate: false, sort_order: 13,
    colors: {
      accent: '#b45309', accentSecondary: '#92400e', cardBg: '#fffbeb',
      cardBorder: '#fde68a', headerBg: '#d97706', headerText: '#ffffff',
      mainBg: '#fffbeb', primaryBtn: '#b45309', primaryBtnText: '#ffffff',
      sidebarAccent: '#f59e0b', sidebarBg: '#78350f', sidebarHover: '#fef3c71a',
      sidebarText: '#fef3c7', textPrimary: '#451a03', textSecondary: '#92400e',
      statCard1: '#fffbeb', statCard2: '#fef3c7', statCard3: '#fde68a', statCard4: '#fcd34d',
      festiveEmoji: '🥐',
    },
  },
  // ─── NUEVOS TEMAS ESTACIONALES ───────────────────────────────────────────
  {
    id: 'tm-primavera', slug: 'primavera', name: '🌷 Primavera Florida',
    description: 'Colores frescos de primavera (Sep-Dic)',
    icon: '🌷', category: 'seasonal', is_active: false, is_seasonal: true,
    auto_activate: true, sort_order: 14,
    seasonal_start: '09-22', seasonal_end: '12-21',
    colors: {
      accent: '#ec4899', accentSecondary: '#db2777', cardBg: '#ffffff',
      cardBorder: '#fbcfe8', headerBg: '#be185d', headerText: '#ffffff',
      mainBg: '#fdf2f8', primaryBtn: '#db2777', primaryBtnText: '#ffffff',
      sidebarAccent: '#f472b6', sidebarBg: '#9d174d', sidebarHover: '#ffffff1a',
      sidebarText: '#fce7f3', textPrimary: '#831843', textSecondary: '#be185d',
      statCard1: '#fdf2f8', statCard2: '#fce7f3', statCard3: '#fbcfe8', statCard4: '#f9a8d4',
      festiveEmoji: '🌷', festiveMessage: '¡Bienvenida la Primavera! 🌷 Flores y dulzura en cada bocado',
    },
  },
  {
    id: 'tm-halloween', slug: 'halloween', name: '🎃 Halloween',
    description: 'Noche de brujas, naranja y negro (Oct 25 - Nov 2)',
    icon: '🎃', category: 'seasonal', is_active: false, is_seasonal: true,
    auto_activate: true, sort_order: 15,
    seasonal_start: '10-25', seasonal_end: '11-02',
    colors: {
      accent: '#ea580c', accentSecondary: '#c2410c', cardBg: '#1c1917',
      cardBorder: '#57534e', headerBg: '#292524', headerText: '#fbbf24',
      mainBg: '#0c0a09', primaryBtn: '#ea580c', primaryBtnText: '#ffffff',
      sidebarAccent: '#fbbf24', sidebarBg: '#1c1917', sidebarHover: '#ea580c1a',
      sidebarText: '#a8a29e', textPrimary: '#fafaf9', textSecondary: '#fbbf24',
      statCard1: '#292524', statCard2: '#1c1917', statCard3: '#44403c', statCard4: '#57534e',
      festiveEmoji: '🎃', festiveMessage: '¡Feliz Halloween! 🎃 Dulces y sustos en cada pedido',
    },
  },
];
// ────────────────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState<Theme[]>(FALLBACK_THEMES);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const applyColorsToRoot = (colors: ThemeColors) => {
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-accent-secondary', colors.accentSecondary);
    root.style.setProperty('--theme-card-bg', colors.cardBg);
    root.style.setProperty('--theme-card-border', colors.cardBorder);
    root.style.setProperty('--theme-header-bg', colors.headerBg);
    root.style.setProperty('--theme-header-text', colors.headerText);
    root.style.setProperty('--theme-main-bg', colors.mainBg);
    root.style.setProperty('--theme-primary-btn', colors.primaryBtn);
    root.style.setProperty('--theme-primary-btn-text', colors.primaryBtnText);
    root.style.setProperty('--theme-sidebar-accent', colors.sidebarAccent);
    root.style.setProperty('--theme-sidebar-bg', colors.sidebarBg);
    root.style.setProperty('--theme-sidebar-hover', colors.sidebarHover);
    root.style.setProperty('--theme-sidebar-text', colors.sidebarText);
    root.style.setProperty('--theme-text-primary', colors.textPrimary);
    root.style.setProperty('--theme-text-secondary', colors.textSecondary);
    if (colors.statCard1) root.style.setProperty('--theme-stat-1', colors.statCard1);
    if (colors.statCard2) root.style.setProperty('--theme-stat-2', colors.statCard2);
    if (colors.statCard3) root.style.setProperty('--theme-stat-3', colors.statCard3);
    if (colors.statCard4) root.style.setProperty('--theme-stat-4', colors.statCard4);
    if (colors.festiveEmoji) root.style.setProperty('--theme-festive-emoji', colors.festiveEmoji);
    if (colors.festiveMessage) root.style.setProperty('--theme-festive-message', `"${colors.festiveMessage}"`);
  };

  const checkSeasonalDates = (start?: string, end?: string): boolean => {
    if (!start || !end) return false;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const [startMonth, startDay] = start.split('-').map(Number);
    const [endMonth, endDay] = end.split('-').map(Number);
    const numericDate = currentMonth * 100 + currentDay;
    const numericStart = startMonth * 100 + startDay;
    const numericEnd = endMonth * 100 + endDay;
    if (numericStart <= numericEnd) {
      return numericDate >= numericStart && numericDate <= numericEnd;
    } else {
      return numericDate >= numericStart || numericDate <= numericEnd;
    }
  };

  const pickAndApplyTheme = useCallback((records: Theme[]) => {
    let themeToApply: Theme | undefined;
    const localPrefId = localStorage.getItem('theme_preference_id');
    if (localPrefId) {
      themeToApply = records.find(t => t.id === localPrefId);
    }
    if (!themeToApply) {
      themeToApply = records.find(t =>
        t.is_seasonal && t.auto_activate && checkSeasonalDates(t.seasonal_start, t.seasonal_end)
      );
    }
    if (!themeToApply) {
      themeToApply = records.find(t => t.is_active && t.category === 'base');
    }
    if (!themeToApply && records.length > 0) {
      themeToApply = records[0];
    }
    if (themeToApply) {
      setCurrentTheme(themeToApply);
      applyColorsToRoot(themeToApply.colors);
    }
  }, []);

  // Intentar cargar desde PocketBase (solo si el usuario está autenticado)
  const loadFromPocketBase = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    try {
      setIsLoading(true);
      const records = await pb.collection('themes').getFullList<Theme>({ sort: 'sort_order' });
      if (records.length > 0) {
        setThemes(records);
        pickAndApplyTheme(records);
      }
    } catch {
      // Silently fail — ya tenemos los fallback themes cargados
    } finally {
      setIsLoading(false);
    }
  }, [pickAndApplyTheme]);

  // Al montar: aplicar tema desde fallbacks inmediatamente
  useEffect(() => {
    pickAndApplyTheme(FALLBACK_THEMES);
  }, []);

  // Cuando el usuario se autentica, intentar cargar desde PocketBase
  useEffect(() => {
    loadFromPocketBase();

    // Escuchar cambios de auth para recargar temas
    const unsubAuth = pb.authStore.onChange(() => {
      loadFromPocketBase();
    });

    return () => {
      unsubAuth();
    };
  }, [loadFromPocketBase]);

  const setTheme = async (themeId: string) => {
    const selected = themes.find(t => t.id === themeId);
    if (!selected) return;
    setCurrentTheme(selected);
    applyColorsToRoot(selected.colors);
    localStorage.setItem('theme_preference_id', themeId);
    toast.success(`Tema aplicado: ${selected.name}`);
  };

  return (
    <ThemeContext.Provider value={{ themes, currentTheme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
