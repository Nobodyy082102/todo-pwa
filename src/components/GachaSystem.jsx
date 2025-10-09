import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Star, Loader } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-500 to-pink-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const LOOT_POOL = [
  // Common (60%)
  { id: 'theme_blue', name: 'Tema Blu', rarity: 'common', type: 'theme', emoji: '🔵' },
  { id: 'theme_green', name: 'Tema Verde', rarity: 'common', type: 'theme', emoji: '🟢' },
  { id: 'emoji_smile', name: 'Emoji Sorriso', rarity: 'common', type: 'emoji', emoji: '😊' },
  { id: 'emoji_heart', name: 'Emoji Cuore', rarity: 'common', type: 'emoji', emoji: '❤️' },
  { id: 'bg_dots', name: 'Sfondo Pois', rarity: 'common', type: 'background', emoji: '🔴' },

  // Rare (25%)
  { id: 'theme_sunset', name: 'Tema Tramonto', rarity: 'rare', type: 'theme', emoji: '🌅' },
  { id: 'theme_ocean', name: 'Tema Oceano', rarity: 'rare', type: 'theme', emoji: '🌊' },
  { id: 'pet_cat', name: 'Skin Gatto', rarity: 'rare', type: 'pet_skin', emoji: '🐱' },
  { id: 'bg_gradient', name: 'Sfondo Gradiente', rarity: 'rare', type: 'background', emoji: '🌈' },

  // Epic (10%)
  { id: 'theme_cyberpunk', name: 'Tema Cyberpunk', rarity: 'epic', type: 'theme', emoji: '🤖' },
  { id: 'theme_forest', name: 'Tema Foresta', rarity: 'epic', type: 'theme', emoji: '🌲' },
  { id: 'pet_unicorn', name: 'Skin Unicorno', rarity: 'epic', type: 'pet_skin', emoji: '🦄' },
  { id: 'power_xp2x', name: 'XP Doppio 24h', rarity: 'epic', type: 'powerup', emoji: '⚡' },

  // Legendary (5%)
  { id: 'theme_galaxy', name: 'Tema Galassia', rarity: 'legendary', type: 'theme', emoji: '🌌' },
  { id: 'theme_gold', name: 'Tema Oro', rarity: 'legendary', type: 'theme', emoji: '👑' },
  { id: 'pet_dragon_skin', name: 'Skin Drago Dorato', rarity: 'legendary', type: 'pet_skin', emoji: '🐲' },
  { id: 'power_infinite', name: 'Energia Infinita', rarity: 'legendary', type: 'powerup', emoji: '♾️' },
];

export function GachaSystem({ todos }) {
  const [tickets, setTickets] = useLocalStorage('gachaTickets', 5);
  const [inventory, setInventory] = useLocalStorage('gachaInventory', []);
  const [isRolling, setIsRolling] = useState(false);
  const [currentDrop, setCurrentDrop] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const completedTasks = todos.filter(t => t.completed).length;
  const earnedTickets = Math.floor(completedTasks / 3); // 1 ticket ogni 3 task

  const rollGacha = () => {
    if (tickets <= 0) return;

    setIsRolling(true);
    setShowResult(false);
    setTickets(tickets - 1);

    // Simulate rolling animation
    setTimeout(() => {
      const drop = getRandomDrop();
      setCurrentDrop(drop);
      setInventory([...inventory, { ...drop, id: `${drop.id}-${Date.now()}` }]);
      setIsRolling(false);
      setShowResult(true);

      // Hide result after 3 seconds
      setTimeout(() => setShowResult(false), 3000);
    }, 2000);
  };

  const getRandomDrop = () => {
    const rand = Math.random() * 100;
    let rarity;

    if (rand < 60) rarity = 'common';
    else if (rand < 85) rarity = 'rare';
    else if (rand < 95) rarity = 'epic';
    else rarity = 'legendary';

    const pool = LOOT_POOL.filter(item => item.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const getRarityStars = (rarity) => {
    const stars = {
      common: 1,
      rare: 2,
      epic: 3,
      legendary: 5,
    };
    return Array(stars[rarity]).fill('⭐').join('');
  };

  const inventoryByRarity = inventory.reduce((acc, item) => {
    acc[item.rarity] = (acc[item.rarity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Gift size={24} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gacha System
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Sparkles size={16} className="text-purple-600" />
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
            {tickets} Tickets
          </span>
        </div>
      </div>

      {/* Gacha Machine */}
      <div className="relative mb-6">
        <div className="aspect-square max-w-xs mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl p-8 border-4 border-purple-300 dark:border-purple-700 shadow-2xl">
          <AnimatePresence mode="wait">
            {isRolling ? (
              <motion.div
                key="rolling"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                exit={{ scale: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full flex items-center justify-center"
              >
                <Loader size={80} className="text-purple-600" />
              </motion.div>
            ) : showResult && currentDrop ? (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-9xl mb-4"
                >
                  {currentDrop.emoji}
                </motion.div>
                <div className={`px-4 py-2 bg-gradient-to-r ${RARITY_COLORS[currentDrop.rarity]} rounded-full mb-2`}>
                  <span className="text-white font-bold text-lg">
                    {getRarityStars(currentDrop.rarity)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                  {currentDrop.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {currentDrop.rarity}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex items-center justify-center"
              >
                <Gift size={100} className="text-purple-400 dark:text-purple-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Roll Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={rollGacha}
          disabled={tickets <= 0 || isRolling}
          className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isRolling ? (
            <>
              <Loader className="animate-spin" size={24} />
              <span>Opening...</span>
            </>
          ) : tickets > 0 ? (
            <>
              <Gift size={24} />
              <span>Apri Mystery Box (1 Ticket)</span>
            </>
          ) : (
            <>
              <span>Nessun Ticket Disponibile</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {inventory.length}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            Items Totali
          </div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {earnedTickets}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Tickets Guadagnati
          </div>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Inventario per Rarità
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {['legendary', 'epic', 'rare', 'common'].map(rarity => (
            <div
              key={rarity}
              className={`p-2 rounded-lg bg-gradient-to-r ${RARITY_COLORS[rarity]} text-center`}
            >
              <div className="text-xl font-bold text-white">
                {inventoryByRarity[rarity] || 0}
              </div>
              <div className="text-xs text-white/90 capitalize">{rarity}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
        💡 Guadagna 1 ticket ogni 3 task completati!
      </p>
    </div>
  );
}
