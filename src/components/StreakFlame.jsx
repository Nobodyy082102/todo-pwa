import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export function StreakFlame({ todos }) {
  const streak = useMemo(() => {
    const completed = todos.filter(t => t.completed);
    const tasksByDay = completed.reduce((acc, task) => {
      if (task.completedAt) {
        const day = new Date(task.completedAt).toDateString();
        acc[day] = (acc[day] || 0) + 1;
      }
      return acc;
    }, {});

    let currentStreak = 0;
    let checkDate = new Date();
    const today = new Date().toDateString();

    while (true) {
      const dateStr = checkDate.toDateString();
      if (tasksByDay[dateStr]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (dateStr === today) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    return currentStreak;
  }, [todos]);

  // Flame size based on streak
  const getFlameSize = () => {
    if (streak === 0) return { size: 'small', height: 40, label: 'Nessuno streak' };
    if (streak < 3) return { size: 'small', height: 60, label: 'Piccola fiamma' };
    if (streak < 7) return { size: 'medium', height: 80, label: 'Fuoco crescente' };
    if (streak < 14) return { size: 'large', height: 100, label: 'Grande fiamma' };
    if (streak < 30) return { size: 'huge', height: 120, label: 'Inferno!' };
    return { size: 'legendary', height: 140, label: 'LEGGENDARIO!' };
  };

  const flameConfig = getFlameSize();

  const flameColors = {
    small: ['#ff6b00', '#ff8800'],
    medium: ['#ff5500', '#ff9900', '#ffaa00'],
    large: ['#ff4400', '#ff6600', '#ff9900', '#ffcc00'],
    huge: ['#ff0000', '#ff4400', '#ff8800', '#ffcc00', '#ffff00'],
    legendary: ['#8b00ff', '#ff00ff', '#ff0088', '#ff4400', '#ffaa00', '#ffff00'],
  };

  const colors = flameColors[flameConfig.size];

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Flame size={24} className="text-orange-600 dark:text-orange-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Streak di Fuoco
        </h2>
      </div>

      <div className="flex flex-col items-center">
        {/* Animated Flame */}
        <div className="relative" style={{ height: flameConfig.height + 40 }}>
          {streak === 0 ? (
            // No streak - extinguished
            <motion.div
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-6xl"
            >
              💨
            </motion.div>
          ) : (
            // Active flame
            <div className="relative">
              {colors.map((color, index) => (
                <motion.div
                  key={index}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: 60 - index * 8,
                    height: flameConfig.height - index * 15,
                    background: `radial-gradient(ellipse at bottom, ${color}, transparent)`,
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    scaleY: [1, 1.2, 0.9, 1.1, 1],
                    scaleX: [1, 0.95, 1.05, 0.98, 1],
                    opacity: [0.8, 1, 0.9, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5 + index * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.1,
                  }}
                />
              ))}

              {/* Sparkles for legendary */}
              {flameConfig.size === 'legendary' && (
                <>
                  <motion.div
                    className="absolute top-0 left-1/2 text-2xl"
                    animate={{
                      y: [-10, -30],
                      x: [-20, -40],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    className="absolute top-0 left-1/2 text-2xl"
                    animate={{
                      y: [-10, -30],
                      x: [20, 40],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  >
                    ⭐
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Streak Count */}
        <motion.div
          key={streak}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 text-center"
        >
          <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 text-transparent bg-clip-text mb-2">
            {streak}
          </div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Giorni Consecutivi
          </div>
        </motion.div>

        {/* Status Label */}
        <div className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-300 dark:border-orange-700">
          <span className="text-sm font-bold text-orange-800 dark:text-orange-300">
            {flameConfig.label}
          </span>
        </div>

        {/* Motivation */}
        <p className="mt-4 text-xs text-center text-gray-600 dark:text-gray-400 max-w-xs">
          {streak === 0
            ? 'Completa un task oggi per accendere la fiamma! 🔥'
            : streak < 7
            ? 'Continua così! Ogni giorno il fuoco cresce! 💪'
            : streak < 30
            ? 'Sei in fiamme! Non fermarti ora! 🚀'
            : 'SEI UNA LEGGENDA! Questo è potere puro! ⚡'}
        </p>
      </div>
    </div>
  );
}
