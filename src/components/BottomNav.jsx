import React from 'react';
import { Plus, List, Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';

export function BottomNav({ onAddClick, onListClick, onSettingsClick, activeView }) {
  const navItems = [
    { id: 'add', icon: Plus, label: 'Aggiungi' },
    { id: 'active', icon: List, label: 'Attive' },
    { id: 'completed', icon: CheckCircle2, label: 'Completate' },
    { id: 'settings', icon: SettingsIcon, label: 'Impostazioni' },
  ];

  const handleClick = (id) => {
    if (id === 'add') onAddClick();
    else if (id === 'active' || id === 'completed') onListClick(id);
    else if (id === 'settings') onSettingsClick();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-3 py-2 rounded-lg transition-all ${
              activeView === id
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={label}
          >
            <Icon size={24} strokeWidth={2} />
            <span className="text-xs font-medium mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
