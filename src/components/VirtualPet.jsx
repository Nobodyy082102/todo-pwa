import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Trophy } from 'lucide-react';

const PET_STAGES = [
  { level: 0, name: 'Uovo', emoji: '🥚', minTasks: 0, message: 'Il tuo pet sta per schiudersi!' },
  { level: 1, name: 'Cucciolo', emoji: '🐣', minTasks: 5, message: 'È nato un cucciolo!' },
  { level: 2, name: 'Giovane', emoji: '🐥', minTasks: 20, message: 'Sta crescendo forte!' },
  { level: 3, name: 'Adulto', emoji: '🐓', minTasks: 50, message: 'È diventato adulto!' },
  { level: 4, name: 'Leggenda', emoji: '🦅', minTasks: 100, message: 'Pet leggendario!' },
  { level: 5, name: 'Divino', emoji: '🦚', minTasks: 200, message: 'Potere divino raggiunto!' },
];

export function VirtualPet({ todos }) {
  const [showMessage, setShowMessage] = useState(false);

  const stats = useMemo(() => {
    const completed = todos.filter(t => t.completed);
    const totalCompleted = completed.length;

    // Trova stadio corrente
    let currentStage = PET_STAGES[0];
    for (let i = PET_STAGES.length - 1; i >= 0; i--) {
      if (totalCompleted >= PET_STAGES[i].minTasks) {
        currentStage = PET_STAGES[i];
        break;
      }
    }

    // Prossimo stadio
    const nextStageIndex = Math.min(currentStage.level + 1, PET_STAGES.length - 1);
    const nextStage = PET_STAGES[nextStageIndex];
    const tasksToNext = nextStage.minTasks - totalCompleted;

    // Felicità (streak-based)
    const today = new Date().toDateString();
    const hasTaskToday = completed.some(t => {
      if (!t.completedAt) return false;
      return new Date(t.completedAt).toDateString() === today;
    });

    const happiness = hasTaskToday ? 'felice' : 'neutro';

    return {
      currentStage,
      nextStage,
      tasksToNext: Math.max(0, tasksToNext),
      totalCompleted,
      happiness,
      isMaxLevel: currentStage.level === PET_STAGES.length - 1,
    };
  }, [todos]);

  const moodEmojis = {
    felice: '😊',
    neutro: '😐',
    triste: '😢',
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10 relative overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-2 right-2 animate-pulse">✨</div>
        <div className="absolute bottom-4 left-4 animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute top-1/2 right-8 animate-pulse" style={{ animationDelay: '1s' }}>💫</div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Heart size={24} className="text-pink-600 dark:text-pink-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Il Tuo Pet
          </h2>
        </div>

        <div className="flex flex-col items-center mb-6">
          {/* Pet Display */}
          <motion.div
            key={stats.currentStage.level}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-8xl cursor-pointer"
              onClick={() => setShowMessage(true)}
              title="Clicca per interagire!"
            >
              {stats.currentStage.emoji}
            </motion.div>

            {/* Mood indicator */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
              className="absolute -bottom-2 -right-2 text-3xl"
            >
              {moodEmojis[stats.happiness]}
            </motion.div>
          </motion.div>

          {/* Pet Name & Level */}
          <div className="text-center mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.currentStage.name}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Trophy size={16} className="text-yellow-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Livello {stats.currentStage.level}
              </span>
            </div>
          </div>
        </div>

        {/* Progress to next level */}
        {!stats.isMaxLevel && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Prossima evoluzione: {stats.nextStage.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.tasksToNext} task
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, ((stats.totalCompleted - stats.currentStage.minTasks) / (stats.nextStage.minTasks - stats.currentStage.minTasks)) * 100)}%`,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 shimmer"
              />
            </div>
          </div>
        )}

        {stats.isMaxLevel && (
          <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-300 dark:border-yellow-600 mb-4">
            <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">
              👑 Livello Massimo Raggiunto! 👑
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {stats.totalCompleted}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Task Completati
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="text-2xl">
              {stats.happiness === 'felice' ? '❤️' : '💙'}
            </div>
            <div className="text-xs text-pink-600 dark:text-pink-400">
              {stats.happiness === 'felice' ? 'Felice!' : 'Dai un task oggi!'}
            </div>
          </div>
        </div>

        {/* Interaction Message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-center"
            >
              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                "{stats.currentStage.message}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {showMessage && (
          <button
            onClick={() => setShowMessage(false)}
            className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Chiudi
          </button>
        )}
      </div>
    </div>
  );
}
