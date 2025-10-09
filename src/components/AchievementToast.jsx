import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

export function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
        >
          <div className="glass-light dark:glass-dark rounded-2xl shadow-2xl p-6 border-2 border-yellow-400 dark:border-yellow-500 min-w-[300px] max-w-md hover-lift">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg animate-bounce">
                {achievement.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy size={16} className="text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                        Achievement Sbloccato!
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
