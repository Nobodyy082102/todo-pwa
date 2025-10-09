import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function SidePanel({ isOpen, onClose, children, animationsEnabled }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          animationsEnabled ? 'animate-fade-in' : ''
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto scrollbar-hide ${
          animationsEnabled ? 'animate-slide-in' : ''
        }`}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐘</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tutte le Attività</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Chiudi pannello"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
