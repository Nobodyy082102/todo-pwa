import React from 'react';
import { Settings as SettingsIcon, Palette, Type, Zap, Bell, Volume2 } from 'lucide-react';
import { useTheme, THEMES } from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import { useSoundEffects } from '../hooks/useSoundEffects';

export function Settings() {
  const {
    currentTheme,
    setCurrentTheme,
    fontSize,
    setFontSize,
    animationsEnabled,
    setAnimationsEnabled,
  } = useTheme();

  const { permission, requestPermission, isSupported } = useNotifications();
  const { soundEnabled, toggleSound } = useSoundEffects();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="text-indigo-600 dark:text-indigo-400" size={24} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Impostazioni</h2>
      </div>

      {/* Notifiche */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifiche</h3>
        </div>

        {!isSupported ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            Le notifiche non sono supportate su questo browser
          </p>
        ) : permission === 'denied' ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            Permesso notifiche negato. Abilitale dalle impostazioni del browser.
          </p>
        ) : permission === 'granted' ? (
          <p className="text-sm text-green-600 dark:text-green-400">✓ Notifiche attive</p>
        ) : (
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Abilita Notifiche
          </button>
        )}
      </div>

      <hr className="border-gray-300 dark:border-gray-600" />

      {/* Tema */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tema</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setCurrentTheme(key)}
              className={`p-3 rounded-lg border-2 transition-all ${
                currentTheme === key
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {theme.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-600" />

      {/* Dimensione testo */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Type size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dimensione Testo</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                fontSize === size
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className={`font-medium text-gray-900 dark:text-white`}>
                {size === 'small' ? 'Piccolo' : size === 'medium' ? 'Medio' : 'Grande'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-600" />

      {/* Animazioni */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Animazioni</h3>
          </div>

          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              animationsEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                animationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {animationsEnabled
            ? 'Le animazioni sono attive'
            : 'Le animazioni sono disattivate per migliorare le prestazioni'}
        </p>
      </div>

      <hr className="border-gray-300 dark:border-gray-600" />

      {/* Effetti Sonori */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Effetti Sonori</h3>
          </div>

          <button
            onClick={toggleSound}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              soundEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {soundEnabled
            ? 'Effetti sonori attivi per completamento, eliminazione e snooze'
            : 'Effetti sonori disattivati'}
        </p>
      </div>
    </div>
  );
}
