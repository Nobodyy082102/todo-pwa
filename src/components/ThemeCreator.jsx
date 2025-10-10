import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Save, Sparkles } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function ThemeCreator({ onThemeCreated }) {
  const [customThemes, setCustomThemes] = useLocalStorage('customThemes', []);
  const [themeName, setThemeName] = useState('');
  const [colors, setColors] = useState({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#1f2937',
    text: '#f9fafb',
    card: '#374151',
  });

  const handleSave = () => {
    if (!themeName.trim()) {
      alert('Inserisci un nome per il tema!');
      return;
    }

    const newTheme = {
      id: `custom-${Date.now()}`,
      name: themeName,
      ...colors,
      isDark: true,
      custom: true,
    };

    setCustomThemes([...customThemes, newTheme]);
    alert(`Tema "${themeName}" salvato! 🎨\n\nPuoi selezionarlo dalla sezione "Temi" qui sotto.`);

    // Reset
    setThemeName('');
    setColors({
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#1f2937',
      text: '#f9fafb',
      card: '#374151',
    });
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <Palette size={24} className="text-purple-600 dark:text-purple-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Theme Creator
        </h2>
        <Sparkles size={20} className="text-yellow-600 animate-pulse" />
      </div>

      <div className="space-y-4">
        {/* Theme Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome Tema
          </label>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Es: Midnight Blue"
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            maxLength={30}
          />
        </div>

        {/* Color Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                {key === 'primary' ? 'Colore Primario' :
                 key === 'secondary' ? 'Colore Secondario' :
                 key === 'background' ? 'Sfondo' :
                 key === 'text' ? 'Testo' :
                 'Card'}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="w-16 h-10 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white text-sm font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Anteprima
          </label>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl p-6 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.background}, ${colors.card})`,
              color: colors.text,
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
              {themeName || 'Il Tuo Tema'}
            </h3>
            <div className="flex gap-2 mb-3">
              <div
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: colors.primary, color: '#fff' }}
              >
                Primary
              </div>
              <div
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: colors.secondary, color: '#fff' }}
              >
                Secondary
              </div>
            </div>
            <p className="text-sm opacity-80">
              Questa è un'anteprima del tuo tema personalizzato! 🎨
            </p>
          </motion.div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!themeName.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          <Save size={20} />
          <span>Salva Tema</span>
        </button>

        {/* Info message */}
        {customThemes.length > 0 && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg">
            <p className="text-sm text-indigo-700 dark:text-indigo-300 text-center">
              ✨ {customThemes.length} tema{customThemes.length > 1 ? 'i' : ''} personalizzato{customThemes.length > 1 ? 'i' : ''} salvato{customThemes.length > 1 ? 'i' : ''}!<br />
              <span className="text-xs">Selezionalo dalla sezione "Temi" qui sotto 👇</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
