import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';

export function TimeTravel({ todos }) {
  const checkpoints = useMemo(() => {
    const now = new Date();
    const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonths = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    return [
      {
        label: '1 Settimana Fa',
        date: week,
        tasks: todos.filter(t => t.createdAt && t.createdAt >= week.getTime()).length,
        completed: todos.filter(t => t.completed && t.completedAt && t.completedAt >= week.getTime()).length,
      },
      {
        label: '1 Mese Fa',
        date: month,
        tasks: todos.filter(t => t.createdAt && t.createdAt >= month.getTime()).length,
        completed: todos.filter(t => t.completed && t.completedAt && t.completedAt >= month.getTime()).length,
      },
      {
        label: '3 Mesi Fa',
        date: threeMonths,
        tasks: todos.filter(t => t.createdAt && t.createdAt >= threeMonths.getTime()).length,
        completed: todos.filter(t => t.completed && t.completedAt && t.completedAt >= threeMonths.getTime()).length,
      },
    ];
  }, [todos]);

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Clock size={24} className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Time Travel</h2>
      </div>

      <div className="space-y-3">
        {checkpoints.map((checkpoint, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white">{checkpoint.label}</h3>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {checkpoint.tasks}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Task Creati</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {checkpoint.completed}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">Completati</div>
              </div>
            </div>
            {checkpoint.tasks > 0 && (
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(checkpoint.completed / checkpoint.tasks) * 100}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl text-center">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Past vs Present</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {checkpoints[0].completed > checkpoints[2].completed / 3
            ? '🚀 Stai migliorando! Continua così!'
            : '💪 C\'è margine di crescita! Dai il massimo!'}
        </p>
      </div>

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
        ⏰ Confronta il tuo progresso nel tempo!
      </p>
    </div>
  );
}
