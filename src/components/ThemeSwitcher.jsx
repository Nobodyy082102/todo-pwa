import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme, THEMES } from '../hooks/useTheme';

export function ThemeSwitcher() {
  const { currentTheme, setCurrentTheme } = useTheme();

  const themeEntries = Object.entries(THEMES);

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <Palette size={24} className="text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Temi
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {themeEntries.map(([key, theme]) => {
          const isSelected = currentTheme === key;
          const isAuto = key === 'auto';

          return (
            <motion.button
              key={key}
              onClick={() => setCurrentTheme(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative rounded-xl p-4 border-2 transition-all overflow-hidden ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-400 shadow-lg'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
              }`}
            >
              {/* Theme Preview */}
              <div className="relative h-24 rounded-lg overflow-hidden mb-3 shadow-inner">
                {isAuto ? (
                  <div className="h-full grid grid-cols-2">
                    <div className="bg-gray-100" />
                    <div className="bg-gray-800" />
                  </div>
                ) : (
                  <>
                    {/* Background */}
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: theme.background }}
                    />
                    {/* Card preview */}
                    <div
                      className="absolute inset-2 rounded opacity-90"
                      style={{ backgroundColor: theme.card }}
                    />
                    {/* Primary color accent */}
                    <div
                      className="absolute bottom-2 left-2 right-2 h-2 rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary || theme.primary})`,
                      }}
                    />
                  </>
                )}
              </div>

              {/* Theme Name */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {theme.name}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"
                  >
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {currentTheme === 'auto'
          ? 'Il tema si adatta automaticamente alle preferenze del sistema'
          : `Tema ${THEMES[currentTheme]?.name} selezionato`}
      </p>
    </div>
  );
}
