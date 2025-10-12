import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export function BrowserCompatibility() {
  const [warnings, setWarnings] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checks = [];

    // Check Notification API
    if (typeof Notification === 'undefined') {
      checks.push({
        id: 'notifications',
        title: 'Notifiche non supportate',
        message: 'Il tuo browser non supporta le notifiche. Aggiorna il browser per usare i promemoria.',
      });
    }

    // Check Service Worker
    if (!('serviceWorker' in navigator)) {
      checks.push({
        id: 'serviceWorker',
        title: 'Service Worker non supportato',
        message: 'Il tuo browser non supporta i service worker. L\'app potrebbe non funzionare offline.',
      });
    }

    // Check localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      checks.push({
        id: 'localStorage',
        title: 'localStorage non disponibile',
        message: 'I tuoi dati non verranno salvati. Abilita i cookie o usa un browser diverso.',
      });
    }

    // Check vibrate API (warning only, not critical)
    if (!('vibrate' in navigator)) {
      checks.push({
        id: 'vibrate',
        title: 'Vibrazione non supportata',
        message: 'Il tuo dispositivo non supporta la vibrazione per le notifiche.',
        severity: 'info',
      });
    }

    // Check IndexedDB (per future features)
    if (!('indexedDB' in window)) {
      checks.push({
        id: 'indexedDB',
        title: 'IndexedDB non supportato',
        message: 'Alcune funzionalità avanzate potrebbero non essere disponibili.',
        severity: 'info',
      });
    }

    setWarnings(checks);
  }, []);

  if (warnings.length === 0 || dismissed) return null;

  const criticalWarnings = warnings.filter(w => w.severity !== 'info');
  const infoWarnings = warnings.filter(w => w.severity === 'info');

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-md space-y-2">
      {/* Critical warnings */}
      {criticalWarnings.map((warning) => (
        <div
          key={warning.id}
          className="bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-red-900 dark:text-red-200 text-sm">
                {warning.title}
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                {warning.message}
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Info warnings */}
      {infoWarnings.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">
                Funzionalità limitate
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                {infoWarnings.map((w) => (
                  <li key={w.id}>• {w.title}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
