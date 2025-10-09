import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const THEMES = {
  light: {
    name: 'Chiaro',
    primary: '#4F46E5',
    background: '#ffffff',
    text: '#1f2937',
    card: '#f9fafb',
  },
  dark: {
    name: 'Scuro',
    primary: '#818CF8',
    background: '#111827',
    text: '#f9fafb',
    card: '#1f2937',
  },
  ocean: {
    name: 'Oceano',
    primary: '#0EA5E9',
    background: '#f0f9ff',
    text: '#0c4a6e',
    card: '#e0f2fe',
  },
  sunset: {
    name: 'Tramonto',
    primary: '#F59E0B',
    background: '#fffbeb',
    text: '#78350f',
    card: '#fef3c7',
  },
  forest: {
    name: 'Foresta',
    primary: '#10B981',
    background: '#f0fdf4',
    text: '#064e3b',
    card: '#d1fae5',
  },
  purple: {
    name: 'Viola',
    primary: '#A855F7',
    background: '#faf5ff',
    text: '#581c87',
    card: '#f3e8ff',
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useLocalStorage('theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 'medium');
  const [animationsEnabled, setAnimationsEnabled] = useLocalStorage('animations', true);

  useEffect(() => {
    const theme = THEMES[currentTheme] || THEMES.light;
    const root = document.documentElement;

    // Applica le classi dark mode
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Applica le variabili CSS personalizzate
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-card', theme.card);

    // Applica font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.setProperty('font-size', fontSizes[fontSize] || fontSizes.medium);

    // Disabilita animazioni se richiesto
    if (!animationsEnabled) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
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
