import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const THEMES = {
  auto: {
    name: 'Automatico',
    primary: 'auto', // Segue il sistema
    background: 'auto',
    text: 'auto',
    card: 'auto',
  },
  light: {
    name: 'Chiaro',
    primary: '#2563eb',
    background: '#f9fafb',
    text: '#111827',
    card: '#ffffff',
  },
  dark: {
    name: 'Scuro',
    primary: '#60a5fa',
    background: '#111827',
    text: '#f9fafb',
    card: '#1f2937',
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

    // Rimuovi tutte le classi tema precedenti
    Object.keys(THEMES).forEach(key => {
      html.classList.remove(`theme-${key}`);
    });
    html.classList.remove('dark');

    // Applica la classe del tema effettivo
    if (effectiveTheme === 'dark') {
      html.classList.add('dark');
    }
    html.classList.add(`theme-${effectiveTheme}`);

    // Applica le variabili CSS personalizzate
    html.style.setProperty('--color-primary', theme.primary);
    html.style.setProperty('--color-background', theme.background);
    html.style.setProperty('--color-text', theme.text);
    html.style.setProperty('--color-card', theme.card);

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
