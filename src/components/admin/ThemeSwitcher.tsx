import React from 'react';
import { useThemeContext, Theme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Calendar, Palette, Sparkles, Check, RefreshCw } from 'lucide-react';

export const ThemeSwitcher = () => {
  const { themes, currentTheme, setTheme, isLoading } = useThemeContext();

  const baseThemes = themes.filter(t => t.category === 'base');
  const seasonalThemes = themes.filter(t => t.category === 'seasonal');

  const ThemeCard = ({ theme }: { theme: Theme }) => {
    const isActive = currentTheme?.id === theme.id;
    return (
      <button
        type="button"
        onClick={() => setTheme(theme.id)}
        className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 text-left w-full group
          ${isActive
            ? 'border-[var(--theme-accent)] shadow-xl shadow-[var(--theme-accent)]/20 scale-[1.02] ring-2 ring-[var(--theme-accent)]/30'
            : 'border-[var(--admin-border)] hover:border-[var(--theme-accent)]/50 hover:shadow-lg hover:scale-[1.01]'
          }`}
      >
        {/* Checkmark activo */}
        {isActive && (
          <div 
            className="absolute top-3 right-3 rounded-full p-1.5 z-10 shadow-lg"
            style={{ backgroundColor: 'var(--theme-primary-btn)', color: 'var(--theme-primary-btn-text)' }}
          >
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        )}

        {/* Vista previa del tema */}
        <div 
          className="h-24 sm:h-28 w-full flex flex-col overflow-hidden"
          style={{ backgroundColor: theme.colors.mainBg }}
        >
          {/* Header mini */}
          <div 
            className="h-7 flex items-center px-2 gap-1 shrink-0"
            style={{ backgroundColor: theme.colors.headerBg }}
          >
            <div 
              className="w-2 h-2 rounded-full shrink-0" 
              style={{ backgroundColor: theme.colors.sidebarBg }} 
            />
            <div 
              className="flex-1 h-2 rounded max-w-[60%]" 
              style={{ backgroundColor: theme.colors.headerText, opacity: 0.3 }} 
            />
          </div>
          {/* Body con sidebar y cards */}
          <div className="flex-1 flex gap-1 p-2 min-h-0">
            <div 
              className="w-7 rounded-md shrink-0 flex flex-col gap-1 py-1"
              style={{ backgroundColor: theme.colors.sidebarBg }}
            >
              <div 
                className="w-full h-1.5 rounded mx-0.5" 
                style={{ backgroundColor: theme.colors.sidebarAccent, opacity: 0.9 }} 
              />
              <div 
                className="w-4/5 h-1 rounded mx-1" 
                style={{ backgroundColor: theme.colors.sidebarText, opacity: 0.2 }} 
              />
              <div 
                className="w-4/5 h-1 rounded mx-1" 
                style={{ backgroundColor: theme.colors.sidebarText, opacity: 0.2 }} 
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <div className="flex gap-1 flex-1">
                <div 
                  className="flex-1 rounded-md border"
                  style={{ 
                    backgroundColor: theme.colors.cardBg, 
                    borderColor: theme.colors.cardBorder 
                  }}
                >
                  <div 
                    className="h-1.5 m-1 rounded" 
                    style={{ backgroundColor: theme.colors.accent, opacity: 0.8 }} 
                  />
                </div>
                <div 
                  className="flex-1 rounded-md border"
                  style={{ 
                    backgroundColor: theme.colors.cardBg, 
                    borderColor: theme.colors.cardBorder 
                  }}
                >
                  <div 
                    className="h-1.5 m-1 rounded" 
                    style={{ backgroundColor: theme.colors.accent, opacity: 0.5 }} 
                  />
                </div>
              </div>
              <div 
                className="h-5 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.colors.primaryBtn }}
              >
                <div 
                  className="h-1 w-10 rounded" 
                  style={{ backgroundColor: theme.colors.primaryBtnText, opacity: 0.7 }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info del tema */}
        <div 
          className="p-4 transition-colors"
          style={{ 
            backgroundColor: 'var(--admin-bg-card)', 
            color: 'var(--admin-text-primary)',
            borderTop: '1px solid var(--admin-border)'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl leading-none">{theme.icon}</span>
            <span className="font-semibold text-sm truncate" style={{ color: 'var(--admin-text-primary)' }}>
              {theme.name.replace(/^[\p{Emoji}\s]+/u, '').trim()}
            </span>
          </div>
          <p className="text-xs line-clamp-2" style={{ color: 'var(--admin-text-muted)' }}>
            {theme.description}
          </p>
          {theme.is_seasonal && theme.seasonal_start && (
            <div 
              className="mt-2 text-xs flex items-center gap-1"
              style={{ color: 'var(--theme-accent)' }}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{theme.seasonal_start} → {theme.seasonal_end}</span>
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'color-mix(in srgb, var(--theme-accent) 15%, transparent)' }}
          >
            <Palette className="w-6 h-6" style={{ color: 'var(--theme-accent)' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--admin-text-primary)' }}>
              Personalización del tema
            </h2>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
              Tema activo: <strong style={{ color: 'var(--theme-accent)' }}>{currentTheme?.name ?? 'Sin tema'}</strong>
            </p>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Sincronizando con el servidor...
          </div>
        )}
      </div>

      {/* Temas Base */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-5 h-5" style={{ color: 'var(--theme-accent)' }} />
          <h3 className="font-bold text-base" style={{ color: 'var(--admin-text-primary)' }}>
            Temas Base
          </h3>
          <span 
            className="text-xs rounded-full px-2.5 py-0.5 font-medium"
            style={{ 
              backgroundColor: 'color-mix(in srgb, var(--theme-accent) 15%, transparent)', 
              color: 'var(--theme-accent)' 
            }}
          >
            {baseThemes.length} temas
          </span>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--admin-text-muted)' }}>
          Temas clásicos permanentes. Se aplican al sitio público y al panel de administración.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {baseThemes.map(theme => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      </div>

      {/* Temas Estacionales */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" style={{ color: 'var(--theme-accent-secondary)' }} />
          <h3 className="font-bold text-base" style={{ color: 'var(--admin-text-primary)' }}>
            Temas Estacionales
          </h3>
          <span 
            className="text-xs rounded-full px-2.5 py-0.5 font-medium"
            style={{ 
              backgroundColor: 'color-mix(in srgb, var(--theme-accent-secondary) 15%, transparent)', 
              color: 'var(--theme-accent-secondary)' 
            }}
          >
            {seasonalThemes.length} temas
          </span>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--admin-text-muted)' }}>
          Se activan automáticamente según la fecha, o puedes seleccionarlos manualmente.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {seasonalThemes.map(theme => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
};
