import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Flame, Gift, Star } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const QUEST_TEMPLATES = [
  {
    id: 'early_bird',
    title: 'Mattiniero',
    description: 'Completa 3 task entro le 12:00',
    icon: '🌅',
    xpReward: 50,
    coinReward: 10,
    check: (todos) => {
      const today = new Date().setHours(0, 0, 0, 0);
      const noon = new Date().setHours(12, 0, 0, 0);
      return todos.filter(t =>
        t.completed &&
        t.completedAt &&
        t.completedAt >= today &&
        t.completedAt <= noon
      ).length >= 3;
    },
  },
  {
    id: 'high_priority',
    title: 'Priorità Alta',
    description: 'Completa 5 task ad alta priorità',
    icon: '🔥',
    xpReward: 75,
    coinReward: 15,
    check: (todos) => {
      const today = new Date().setHours(0, 0, 0, 0);
      return todos.filter(t =>
        t.completed &&
        t.priority === 'high' &&
        t.completedAt &&
        t.completedAt >= today
      ).length >= 5;
    },
  },
  {
    id: 'streak_keeper',
    title: 'Mantenere la Streak',
    description: 'Completa almeno 1 task oggi',
    icon: '⚡',
    xpReward: 25,
    coinReward: 5,
    check: (todos) => {
      const today = new Date().setHours(0, 0, 0, 0);
      return todos.filter(t =>
        t.completed &&
        t.completedAt &&
        t.completedAt >= today
      ).length >= 1;
    },
  },
  {
    id: 'completionist',
    title: 'Completista',
    description: 'Completa 10 task in un giorno',
    icon: '🎯',
    xpReward: 100,
    coinReward: 25,
    check: (todos) => {
      const today = new Date().setHours(0, 0, 0, 0);
      return todos.filter(t =>
        t.completed &&
        t.completedAt &&
        t.completedAt >= today
      ).length >= 10;
    },
  },
  {
    id: 'categorizer',
    title: 'Organizzatore',
    description: 'Completa task da 3 categorie diverse',
    icon: '📁',
    xpReward: 60,
    coinReward: 12,
    check: (todos) => {
      const today = new Date().setHours(0, 0, 0, 0);
      const completed = todos.filter(t =>
        t.completed &&
        t.completedAt &&
        t.completedAt >= today &&
        t.categories &&
        t.categories.length > 0
      );
      const categories = new Set(completed.flatMap(t => t.categories));
      return categories.size >= 3;
    },
  },
];

export function DailyQuests({ todos }) {
  const [completedQuests, setCompletedQuests] = useLocalStorage('completedQuests', {});
  const [questStreak, setQuestStreak] = useLocalStorage('questStreak', 0);
  const [lastQuestDate, setLastQuestDate] = useLocalStorage('lastQuestDate', null);
  const [showClaimed, setShowClaimed] = useState(null);

  const today = new Date().toDateString();

  // Reset daily quests
  const dailyQuests = useMemo(() => {
    if (lastQuestDate !== today) {
      setCompletedQuests({});
      setLastQuestDate(today);
    }

    return QUEST_TEMPLATES.map(quest => ({
      ...quest,
      isCompleted: quest.check(todos),
      isClaimed: completedQuests[quest.id] || false,
    }));
  }, [todos, completedQuests, today]);

  const claimReward = (questId) => {
    setCompletedQuests({ ...completedQuests, [questId]: true });
    setShowClaimed(questId);
    setTimeout(() => setShowClaimed(null), 2000);

    // Update streak
    const allClaimed = dailyQuests.every(q => q.id === questId || q.isClaimed);
    if (allClaimed) {
      setQuestStreak(questStreak + 1);
    }
  };

  const totalXP = dailyQuests.filter(q => q.isClaimed).reduce((sum, q) => sum + q.xpReward, 0);
  const totalCoins = dailyQuests.filter(q => q.isClaimed).reduce((sum, q) => sum + q.coinReward, 0);
  const completedCount = dailyQuests.filter(q => q.isCompleted && q.isClaimed).length;

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Target size={24} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Quests
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <Flame size={16} className="text-orange-600" />
          <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
            {questStreak} giorni
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {completedCount}/{dailyQuests.length}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Quest</div>
        </div>
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
            {totalXP}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">XP</div>
        </div>
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
            {totalCoins}
          </div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400">Coins</div>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-2">
        {dailyQuests.map((quest) => (
          <motion.div
            key={quest.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl border-2 transition-all ${
              quest.isClaimed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                : quest.isCompleted
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{quest.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {quest.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {quest.description}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                    <Star size={12} />
                    {quest.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    💰 {quest.coinReward} Coins
                  </span>
                </div>
              </div>
              <div>
                {quest.isClaimed ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 size={24} />
                    <span className="text-xs font-medium">Raccolto</span>
                  </div>
                ) : quest.isCompleted ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => claimReward(quest.id)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg shadow-lg flex items-center gap-2"
                  >
                    <Gift size={16} />
                    Raccogli
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                    <Clock size={24} />
                    <span className="text-xs">In corso</span>
                  </div>
                )}
              </div>
            </div>

            {/* Claimed Animation */}
            {showClaimed === quest.id && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-center text-sm font-bold text-green-600 dark:text-green-400"
              >
                ✨ Ricompensa Raccolta! ✨
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bonus Info */}
      {completedCount === dailyQuests.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-center"
        >
          <h3 className="text-xl font-bold text-white mb-1">
            🎉 TUTTE LE QUEST COMPLETATE! 🎉
          </h3>
          <p className="text-sm text-white/90">
            Bonus Streak: +1 giorno! Torna domani per nuove quest!
          </p>
        </motion.div>
      )}

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
        ⏰ Le quest si rinnovano ogni giorno alle 00:00
      </p>
    </div>
  );
}
