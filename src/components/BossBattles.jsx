import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Sword, Heart, Trophy, Zap, Gift } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BOSSES = [
  {
    id: 'slime',
    name: 'Slime Gigante',
    emoji: '💧',
    hp: 100,
    requiredSubtasks: 5,
    difficulty: 'Facile',
    color: 'from-blue-400 to-cyan-500',
    rewards: ['50 XP', 'Tema Acquatico', '1 Gacha Ticket'],
  },
  {
    id: 'goblin',
    name: 'Re Goblin',
    emoji: '👹',
    hp: 250,
    requiredSubtasks: 10,
    difficulty: 'Medio',
    color: 'from-green-400 to-emerald-500',
    rewards: ['100 XP', 'Pet Goblin', '3 Gacha Tickets'],
  },
  {
    id: 'dragon',
    name: 'Drago Antico',
    emoji: '🐲',
    hp: 500,
    requiredSubtasks: 20,
    difficulty: 'Difficile',
    color: 'from-red-400 to-orange-500',
    rewards: ['300 XP', 'Spada Leggendaria', '5 Gacha Tickets', 'Tema Drago'],
  },
  {
    id: 'demon',
    name: 'Demone Oscuro',
    emoji: '😈',
    hp: 1000,
    requiredSubtasks: 50,
    difficulty: 'Epico',
    color: 'from-purple-500 to-pink-600',
    rewards: ['1000 XP', 'Corona Demoniaca', '10 Gacha Tickets', 'Abilità Speciale'],
  },
];

export function BossBattles({ todos, onTaskCreate }) {
  const [defeatedBosses, setDefeatedBosses] = useLocalStorage('defeatedBosses', []);
  const [activeBoss, setActiveBoss] = useLocalStorage('activeBoss', null);
  const [bossHp, setBossHp] = useLocalStorage('bossHp', 0);
  const [showBattle, setShowBattle] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [damageNumber, setDamageNumber] = useState(null);
  const [showRewards, setShowRewards] = useState(false);

  const currentBoss = BOSSES.find(b => b.id === activeBoss);

  // Conta subtask completati per boss attivo
  const completedSubtasks = useMemo(() => {
    if (!activeBoss) return 0;

    const bossTask = todos.find(t => t.bossId === activeBoss && !t.completed);
    if (!bossTask || !bossTask.subtasks) return 0;

    return bossTask.subtasks.filter(s => s.completed).length;
  }, [todos, activeBoss]);

  // Attacco automatico quando completi subtask
  useEffect(() => {
    if (currentBoss && completedSubtasks > 0) {
      const damage = Math.floor(currentBoss.hp / currentBoss.requiredSubtasks);
      const newHp = Math.max(0, currentBoss.hp - (damage * completedSubtasks));

      if (newHp !== bossHp) {
        setBossHp(newHp);

        // Animazione attacco
        setAttackAnimation(true);
        setDamageNumber(damage);
        setTimeout(() => {
          setAttackAnimation(false);
          setDamageNumber(null);
        }, 1000);

        // Boss sconfitto!
        if (newHp === 0) {
          setTimeout(() => {
            setDefeatedBosses([...defeatedBosses, activeBoss]);
            setShowRewards(true);
            setTimeout(() => {
              setActiveBoss(null);
              setBossHp(0);
              setShowRewards(false);
              setShowBattle(false);
            }, 5000);
          }, 1500);
        }
      }
    }
  }, [completedSubtasks]);

  const startBossFight = (boss) => {
    // Crea task epico per il boss
    const bossTask = {
      id: `boss-${boss.id}-${Date.now()}`,
      title: `⚔️ BOSS: Sconfiggi ${boss.name}`,
      description: `Completa tutti i subtask per sconfiggere il boss!`,
      priority: 'high',
      completed: false,
      createdAt: Date.now(),
      categories: ['Boss Battle'],
      bossId: boss.id,
      subtasks: Array.from({ length: boss.requiredSubtasks }, (_, i) => ({
        id: `subtask-${i}`,
        text: `Attacco ${i + 1}: Danneggia il boss!`,
        completed: false,
      })),
    };

    onTaskCreate(bossTask);
    setActiveBoss(boss.id);
    setBossHp(boss.hp);
    setShowBattle(true);
  };

  const availableBosses = BOSSES.filter(b => !defeatedBosses.includes(b.id));

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Skull size={24} className="text-red-600 dark:text-red-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Boss Battles
        </h2>
      </div>

      {/* Active Boss Battle */}
      <AnimatePresence>
        {showBattle && currentBoss && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`mb-6 p-6 rounded-xl bg-gradient-to-br ${currentBoss.color} relative overflow-hidden`}
          >
            {/* Boss Display */}
            <motion.div
              className="text-9xl text-center mb-4"
              animate={attackAnimation ? {
                x: [0, -20, 20, -10, 10, 0],
                rotate: [0, -5, 5, -3, 3, 0],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {currentBoss.emoji}
            </motion.div>

            {/* Damage Number */}
            <AnimatePresence>
              {damageNumber && (
                <motion.div
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -100, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-yellow-300 pointer-events-none"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                >
                  -{damageNumber}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boss Info */}
            <div className="text-center mb-4">
              <h3 className="text-3xl font-bold text-white mb-2">
                {currentBoss.name}
              </h3>
              <p className="text-sm text-white/80">
                {currentBoss.difficulty}
              </p>
            </div>

            {/* HP Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white mb-1">
                <span className="flex items-center gap-1">
                  <Heart size={16} />
                  HP
                </span>
                <span className="font-bold">{bossHp} / {currentBoss.hp}</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-6 overflow-hidden border-2 border-white/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(bossHp / currentBoss.hp) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
            </div>

            {/* Progress */}
            <div className="text-center text-white">
              <p className="text-sm mb-2">
                <Sword className="inline mr-1" size={16} />
                Attacchi: {completedSubtasks} / {currentBoss.requiredSubtasks}
              </p>
              <p className="text-xs opacity-80">
                Completa i subtask nella lista per attaccare!
              </p>
            </div>

            {/* Rewards Preview */}
            {showRewards && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-white/20 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 justify-center mb-3">
                  <Trophy className="text-yellow-300" size={24} />
                  <h4 className="text-xl font-bold text-white">VITTORIA!</h4>
                  <Trophy className="text-yellow-300" size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm text-white mb-2">Ricompense Ottenute:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentBoss.rewards.map((reward, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold"
                      >
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boss Selection */}
      {!showBattle && (
        <>
          <div className="space-y-3 mb-4">
            {availableBosses.length === 0 ? (
              <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                <Trophy size={48} className="mx-auto mb-3 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Tutti i Boss Sconfitti! 👑
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sei un vero eroe! Attendi nuovi boss...
                </p>
              </div>
            ) : (
              availableBosses.map((boss) => (
                <motion.div
                  key={boss.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl bg-gradient-to-br ${boss.color} cursor-pointer relative overflow-hidden`}
                  onClick={() => startBossFight(boss)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{boss.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {boss.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/90 mb-2">
                        <Heart size={14} />
                        <span>{boss.hp} HP</span>
                        <span>•</span>
                        <Sword size={14} />
                        <span>{boss.requiredSubtasks} Attacchi</span>
                      </div>
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                        {boss.difficulty}
                      </span>
                    </div>
                    <Zap size={24} className="text-yellow-300" />
                  </div>

                  {/* Rewards */}
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-white/80 mb-1 flex items-center gap-1">
                      <Gift size={12} />
                      Ricompense:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {boss.rewards.map((reward, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white/30 rounded text-xs text-white"
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {defeatedBosses.length}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Boss Sconfitti
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {availableBosses.length}
              </div>
              <div className="text-xs text-red-600 dark:text-red-400">
                Boss Rimanenti
              </div>
            </div>
          </div>
        </>
      )}

      {!showBattle && availableBosses.length > 0 && (
        <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
          💡 Clicca su un boss per iniziare la battaglia!
        </p>
      )}
    </div>
  );
}
