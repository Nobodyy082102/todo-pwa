import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dices, Coins } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function TaskCasino({ todos }) {
  const [coins, setCoins] = useLocalStorage('casinoCoins', 100);
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const completedTasks = todos.filter(t => t.completed).length;
  const earnedCoins = completedTasks * 5;

  const spinSlots = () => {
    if (coins < bet) return;

    setSpinning(true);
    setCoins(coins - bet);
    setResult(null);

    setTimeout(() => {
      const slots = [
        ['🍒', '🍋', '⭐', '💎', '7️⃣'][Math.floor(Math.random() * 5)],
        ['🍒', '🍋', '⭐', '💎', '7️⃣'][Math.floor(Math.random() * 5)],
        ['🍒', '🍋', '⭐', '💎', '7️⃣'][Math.floor(Math.random() * 5)],
      ];

      let win = 0;
      if (slots[0] === slots[1] && slots[1] === slots[2]) {
        if (slots[0] === '7️⃣') win = bet * 10;
        else if (slots[0] === '💎') win = bet * 5;
        else if (slots[0] === '⭐') win = bet * 3;
        else win = bet * 2;
      }

      setResult({ slots, win });
      setCoins(coins - bet + win);
      setSpinning(false);
    }, 1500);
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Dices size={24} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task Casino</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <Coins size={16} className="text-yellow-600" />
          <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{coins}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 mb-4">
        <div className="flex justify-center gap-4 mb-4">
          {spinning ? (
            [0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-4xl"
              >
                🎰
              </motion.div>
            ))
          ) : result ? (
            result.slots.map((slot, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-4xl"
              >
                {slot}
              </motion.div>
            ))
          ) : (
            [0, 1, 2].map(i => (
              <div
                key={i}
                className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-4xl"
              >
                ?
              </div>
            ))
          )}
        </div>

        {result && result.win > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center text-2xl font-bold text-green-600 dark:text-green-400"
          >
            🎉 HAI VINTO {result.win} COINS! 🎉
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Puntata
          </label>
          <div className="flex gap-2">
            {[10, 25, 50, 100].map(amount => (
              <button
                key={amount}
                onClick={() => setBet(amount)}
                className={`flex-1 py-2 rounded-lg font-bold ${
                  bet === amount
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={spinSlots}
          disabled={spinning || coins < bet}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl"
        >
          {spinning ? 'SPINNING...' : `SPIN (${bet} coins)`}
        </motion.button>
      </div>

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
        💰 Guadagnati {earnedCoins} coins dai task completati!
      </p>
    </div>
  );
}
