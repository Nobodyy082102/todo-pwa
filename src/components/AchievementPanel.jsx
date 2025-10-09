import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '../utils/achievements';

export function AchievementPanel({ unlockedAchievements = [] }) {
  const achievementList = Object.values(ACHIEVEMENTS);
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievementList.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy size={28} className="text-yellow-600 dark:text-yellow-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Achievement
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedCount} / {totalCount} sbloccati ({Math.round(progress)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shimmer"
        />
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementList.map((achievement) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              whileHover={isUnlocked ? { scale: 1.05 } : {}}
              className={`rounded-xl p-4 border-2 transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400 dark:border-yellow-600'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  {isUnlocked ? achievement.icon : <Lock size={20} className="text-gray-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {isUnlocked ? achievement.name : '???'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {isUnlocked ? achievement.description : 'Achievement bloccato'}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
