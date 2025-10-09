import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy } from 'lucide-react';

export function MiniGames() {
  const [game, setGame] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('miniGameScore') || '0'));
  const [timeLeft, setTimeLeft] = useState(30);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (game && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (game && timeLeft === 0) {
      if (clicks > highScore) {
        setHighScore(clicks);
        localStorage.setItem('miniGameScore', clicks.toString());
      }
      setTimeout(() => setGame(null), 2000);
    }
  }, [timeLeft, game]);

  const startGame = (type) => {
    setGame(type);
    setTimeLeft(30);
    setClicks(0);
  };

  const handleClick = () => {
    setClicks(clicks + 1);
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Gamepad2 size={24} className="text-pink-600 dark:text-pink-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mini-Games</h2>
      </div>

      {!game ? (
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame('click')}
            className="w-full p-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white"
          >
            <div className="text-4xl mb-2">👆</div>
            <h3 className="font-bold text-lg">Quick Tap</h3>
            <p className="text-sm opacity-90">Clicca più volte in 30 secondi!</p>
          </motion.button>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <Trophy size={20} className="inline mb-1 text-yellow-600" />
            <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
              {highScore}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Record</div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {timeLeft}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full text-white text-6xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            👆
          </motion.button>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {clicks}
          </div>
          {timeLeft === 0 && (
            <p className="text-green-600 dark:text-green-400 font-bold mt-2">
              {clicks > highScore ? '🎉 NUOVO RECORD! 🎉' : 'Game Over!'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
