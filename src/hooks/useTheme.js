import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const THEMES = {
  auto: {
    name: 'Automatico',
    primary: 'auto',
    background: 'auto',
    text: 'auto',
    card: 'auto',
    isDark: 'auto',
  },
  light: {
    name: 'Chiaro',
    primary: '#2563eb',
    secondary: '#8b5cf6',
    background: '#f9fafb',
    text: '#111827',
    card: '#ffffff',
    isDark: false,
  },
  dark: {
    name: 'Scuro',
    primary: '#60a5fa',
    secondary: '#a78bfa',
    background: '#111827',
    text: '#f9fafb',
    card: '#1f2937',
    isDark: true,
  },
  ocean: {
    name: 'Oceano',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    background: '#0c4a6e',
    text: '#f0f9ff',
    card: '#075985',
    isDark: true,
  },
  sunset: {
    name: 'Tramonto',
    primary: '#f97316',
    secondary: '#ec4899',
    background: '#7c2d12',
    text: '#fff7ed',
    card: '#9a3412',
    isDark: true,
  },
  forest: {
    name: 'Foresta',
    primary: '#22c55e',
    secondary: '#84cc16',
    background: '#14532d',
    text: '#f0fdf4',
    card: '#166534',
    isDark: true,
  },
  cosmic: {
    name: 'Cosmico',
    primary: '#a855f7',
    secondary: '#ec4899',
    background: '#2e1065',
    text: '#faf5ff',
    card: '#4c1d95',
    isDark: true,
  },
  nord: {
    name: 'Nord',
    primary: '#88c0d0',
    secondary: '#5e81ac',
    background: '#2e3440',
    text: '#eceff4',
    card: '#3b4252',
    isDark: true,
  },
  autumn: {
    name: 'Autunno',
    primary: '#d97706',
    secondary: '#dc2626',
    background: '#fef3c7',
    text: '#78350f',
    card: '#fef9e7',
    isDark: false,
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useLocalStorage('theme', 'auto');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 'medium');
  const [animationsEnabled, setAnimationsEnabled] = useLocalStorage('animations', true);

  useEffect(() => {
    const html = document.documentElement;

    // Determina il tema effettivo da applicare
    let effectiveTheme = currentTheme;

    if (currentTheme === 'auto') {
      // Segui le preferenze del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    const theme = THEMES[effectiveTheme] || THEMES.light;

    // Aggiungi classe per transizione smooth
    html.style.transition = 'background-color 0.5s ease, color 0.5s ease';

    // Rimuovi tutte le classi tema precedenti
    Object.keys(THEMES).forEach(key => {
      html.classList.remove(`theme-${key}`);
    });
    html.classList.remove('dark');

    // Applica la classe del tema effettivo
    if (theme.isDark === true || (theme.isDark === 'auto' && effectiveTheme === 'dark')) {
      html.classList.add('dark');
    }
    html.classList.add(`theme-${effectiveTheme}`);

    // Applica le variabili CSS personalizzate con transizione
    html.style.setProperty('--color-primary', theme.primary);
    html.style.setProperty('--color-secondary', theme.secondary || theme.primary);
    html.style.setProperty('--color-background', theme.background);
    html.style.setProperty('--color-text', theme.text);
    html.style.setProperty('--color-card', theme.card);

    // Applica i colori direttamente per i temi custom
    if (currentTheme !== 'auto' && currentTheme !== 'light' && currentTheme !== 'dark') {
      // Tema custom - applica colori specifici
      document.body.style.backgroundColor = theme.background;
      document.body.style.color = theme.text;
    } else {
      // Temi standard - rimuovi stili inline
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }

    // Applica font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    html.style.setProperty('font-size', fontSizes[fontSize] || fontSizes.medium);

    // Disabilita animazioni se richiesto
    if (!animationsEnabled) {
      html.style.setProperty('--animation-duration', '0s');
    } else {
      html.style.setProperty('--animation-duration', '0.3s');
    }

    // Listener per cambiamenti nelle preferenze del sistema (solo se tema auto)
    if (currentTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const newEffectiveTheme = e.matches ? 'dark' : 'light';
        const newTheme = THEMES[newEffectiveTheme];

        html.classList.remove('dark', 'light');
        if (newEffectiveTheme === 'dark') {
          html.classList.add('dark');
        }

        html.style.setProperty('--color-primary', newTheme.primary);
        html.style.setProperty('--color-background', newTheme.background);
        html.style.setProperty('--color-text', newTheme.text);
        html.style.setProperty('--color-card', newTheme.card);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [currentTheme, fontSize, animationsEnabled]);

  return {
    currentTheme,
    setCurrentTheme,
    fontSize,
    setFontSize,
    animationsEnabled,
    setAnimationsEnabled,
    themes: THEMES,
  };
}
