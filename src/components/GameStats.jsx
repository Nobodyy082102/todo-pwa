import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Flame, Star, TrendingUp } from 'lucide-react';

export function GameStats({ todos }) {
  const stats = useMemo(() => {
    const completed = todos.filter(t => t.completed);
    const today = new Date().setHours(0, 0, 0, 0);
    const completedToday = completed.filter(t => t.completedAt >= today);

    // Calcolo XP: priorità alta = 50XP, media = 30XP, bassa = 10XP
    const xpPerTask = { high: 50, medium: 30, low: 10 };
    const totalXP = completed.reduce((sum, task) => {
      return sum + (xpPerTask[task.priority] || 10);
    }, 0);

    // Calcolo livello: 100 XP per livello, con scaling
    const level = Math.floor(Math.sqrt(totalXP / 50)) + 1;
    const xpForCurrentLevel = Math.pow(level - 1, 2) * 50;
    const xpForNextLevel = Math.pow(level, 2) * 50;
    const xpInCurrentLevel = totalXP - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    // Calcolo streak (giorni consecutivi con almeno 1 task completato)
    const getStreak = () => {
      if (completed.length === 0) return 0;

      const sortedDates = completed
        .map(t => new Date(t.completedAt || t.createdAt).setHours(0, 0, 0, 0))
        .sort((a, b) => b - a);

      let streak = 0;
      let currentDay = today;

      for (let i = 0; i < sortedDates.length; i++) {
        if (sortedDates[i] === currentDay) {
          streak++;
          currentDay -= 86400000; // 1 giorno in ms
        } else if (sortedDates[i] < currentDay) {
          break;
        }
      }

      return streak;
    };

    const streak = getStreak();

    // Titolo basato sul livello
    const getTitleForLevel = (lvl) => {
      if (lvl >= 20) return 'Leggenda';
      if (lvl >= 15) return 'Maestro';
      if (lvl >= 10) return 'Esperto';
      if (lvl >= 5) return 'Avanzato';
      return 'Novizio';
    };

    return {
      totalXP,
      level,
      progressPercent,
      xpInCurrentLevel,
      xpNeededForNextLevel,
      streak,
      completedToday: completedToday.length,
      totalCompleted: completed.length,
      title: getTitleForLevel(level),
    };
  }, [todos]);

  return (
    <div className="space-y-4">
      {/* Header con livello e titolo */}
      <div className="glass-light dark:glass-dark rounded-2xl p-6 hover-lift border border-indigo-200 dark:border-indigo-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl font-bold text-white text-glow-sm">{stats.level}</span>
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Livello {stats.level}
              </h3>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                {stats.title}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Streak */}
            {stats.streak > 0 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full"
              >
                <Flame size={20} className="text-orange-500" />
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {stats.streak} {stats.streak === 1 ? 'giorno' : 'giorni'}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress Bar XP */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Zap size={16} className="text-indigo-500" />
              {stats.xpInCurrentLevel} / {stats.xpNeededForNextLevel} XP
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(stats.progressPercent)}%
            </span>
          </div>

          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 shimmer" />
            </motion.div>
          </div>
        </div>

        {/* XP totali */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Star size={16} className="text-yellow-500" />
          <span>{stats.totalXP} XP totali</span>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Trophy className="text-yellow-500" />}
          label="Completate"
          value={stats.totalCompleted}
          gradient="from-yellow-400 to-orange-500"
        />
        <StatCard
          icon={<TrendingUp className="text-green-500" />}
          label="Oggi"
          value={stats.completedToday}
          gradient="from-green-400 to-emerald-500"
        />
        <StatCard
          icon={<Zap className="text-indigo-500" />}
          label="XP"
          value={stats.totalXP}
          gradient="from-indigo-400 to-purple-500"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="glass-light dark:glass-dark rounded-xl p-4 hover-glow border border-gray-200 dark:border-gray-700/30 cursor-pointer"
    >
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 shadow-md`}>
        {React.cloneElement(icon, { size: 20, className: 'text-white' })}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </div>
    </motion.div>
  );
}
