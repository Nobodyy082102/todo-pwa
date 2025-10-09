import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

export function ZenGarden({ todos }) {
  const garden = useMemo(() => {
    const completed = todos.filter(t => t.completed);

    // Genera posizioni casuali ma consistenti per ogni task
    return completed.slice(0, 30).map((task, index) => {
      const random = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

      const seed = parseInt(task.id) || index * 1000;

      return {
        id: task.id,
        x: random(seed) * 90 + 5, // 5-95%
        y: random(seed + 1) * 90 + 5,
        emoji: task.priority === 'high' ? '🌳' :
               task.priority === 'medium' ? '🌿' : '🌸',
        size: task.priority === 'high' ? 2 : task.priority === 'medium' ? 1.5 : 1,
      };
    });
  }, [todos]);

  const completed = todos.filter(t => t.completed).length;

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Sprout size={24} className="text-green-600 dark:text-green-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Giardino Zen
        </h2>
      </div>

      {/* Garden View */}
      <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl h-64 overflow-hidden border-2 border-green-200 dark:border-green-800">
        {/* Ground */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-100/50 dark:to-green-900/30" />

        {/* Zen lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-green-200/30 dark:bg-green-700/30"
            style={{ top: `${20 + i * 15}%` }}
          />
        ))}

        {/* Plants */}
        {garden.map((plant, index) => (
          <motion.div
            key={plant.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05, type: 'spring' }}
            className="absolute cursor-pointer"
            style={{
              left: `${plant.x}%`,
              top: `${plant.y}%`,
              fontSize: `${plant.size}rem`,
            }}
            whileHover={{ scale: plant.size * 1.3 }}
            title="Task completato"
          >
            {plant.emoji}
          </motion.div>
        ))}

        {/* Decorations */}
        {garden.length > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              y: [0, -5, 0],
            }}
            className="absolute bottom-4 right-4 text-3xl"
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            💧
          </motion.div>
        )}

        {garden.length > 20 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 text-2xl"
          >
            🪨
          </motion.div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-xl font-bold text-green-700 dark:text-green-300">
            {garden.filter(p => p.emoji === '🌳').length}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Alberi
          </div>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
            {garden.filter(p => p.emoji === '🌿').length}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400">
            Piante
          </div>
        </div>
        <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
          <div className="text-xl font-bold text-pink-700 dark:text-pink-300">
            {garden.filter(p => p.emoji === '🌸').length}
          </div>
          <div className="text-xs text-pink-600 dark:text-pink-400">
            Fiori
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-center text-gray-600 dark:text-gray-400">
        {completed === 0
          ? 'Il tuo giardino attende... Completa task per farlo crescere! 🌱'
          : completed < 10
          ? 'Il giardino sta germogliando! Continua così! 🌱'
          : completed < 30
          ? 'Un bellissimo giardino sta prendendo forma! 🌿'
          : 'Il tuo giardino è magnifico! Un\'oasi di pace. 🌳✨'}
      </p>
    </div>
  );
}
