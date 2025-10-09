import React from 'react';

export function FloatingActionButton({ onClick, pendingCount, animationsEnabled }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className={`relative w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all ${
          animationsEnabled ? 'pulse-ring' : ''
        } flex items-center justify-center group`}
        aria-label="Apri menu attività"
      >
        <span className="text-3xl">🐘</span>

        {pendingCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-bounce-in">
            {pendingCount > 99 ? '99+' : pendingCount}
          </span>
        )}
      </button>
    </div>
  );
}
