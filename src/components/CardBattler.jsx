import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Swords } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-500 to-pink-600',
};

export function CardBattler({ todos }) {
  const [deck, setDeck] = useLocalStorage('cardDeck', []);
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState(null);

  const cards = useMemo(() => {
    return todos.filter(t => t.completed).map(task => ({
      id: task.id,
      name: task.title.substring(0, 20),
      power: task.priority === 'high' ? 10 : task.priority === 'medium' ? 7 : 5,
      rarity: task.priority === 'high' ? 'epic' : task.priority === 'medium' ? 'rare' : 'common',
      element: task.categories?.[0] || 'Neutral',
    }));
  }, [todos]);

  const addToDeck = (card) => {
    if (deck.length < 5 && !deck.find(c => c.id === card.id)) {
      setDeck([...deck, card]);
    }
  };

  const removeFromDeck = (cardId) => {
    setDeck(deck.filter(c => c.id !== cardId));
  };

  const battle = () => {
    if (deck.length === 0) return;

    setBattling(true);
    const playerPower = deck.reduce((sum, card) => sum + card.power, 0);
    const enemyPower = Math.floor(Math.random() * 50) + 20;

    setTimeout(() => {
      setBattleResult({
        win: playerPower > enemyPower,
        playerPower,
        enemyPower,
      });
      setBattling(false);
    }, 2000);
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Layers size={24} className="text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task Wars</h2>
      </div>

      {/* Deck */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Il Tuo Deck ({deck.length}/5)</h3>
        <div className="flex gap-2 min-h-24 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {deck.map(card => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => removeFromDeck(card.id)}
              className={`w-16 h-20 rounded-lg bg-gradient-to-br ${RARITY_COLORS[card.rarity]} p-2 text-white text-xs cursor-pointer flex flex-col justify-between`}
            >
              <div className="font-bold text-center">{card.power}</div>
              <div className="text-center truncate">{card.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Battle */}
      {battleResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-xl mb-4 ${
            battleResult.win
              ? 'bg-green-100 dark:bg-green-900/20'
              : 'bg-red-100 dark:bg-red-900/20'
          }`}
        >
          <h3 className="text-xl font-bold text-center mb-2">
            {battleResult.win ? '🎉 VITTORIA!' : '😞 SCONFITTA'}
          </h3>
          <div className="flex justify-around">
            <div>
              <div className="text-sm">Tu</div>
              <div className="text-2xl font-bold">{battleResult.playerPower}</div>
            </div>
            <div className="text-2xl">VS</div>
            <div>
              <div className="text-sm">Nemico</div>
              <div className="text-2xl font-bold">{battleResult.enemyPower}</div>
            </div>
          </div>
        </motion.div>
      )}

      <button
        onClick={battle}
        disabled={deck.length === 0 || battling}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl mb-4"
      >
        {battling ? <Swords className="inline animate-pulse" /> : 'COMBATTI!'}
      </button>

      {/* Available Cards */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Carte Disponibili</h3>
        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
          {cards.slice(0, 20).map(card => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => addToDeck(card)}
              className={`w-full aspect-[2/3] rounded-lg bg-gradient-to-br ${RARITY_COLORS[card.rarity]} p-2 text-white text-xs cursor-pointer flex flex-col justify-between`}
            >
              <div className="font-bold text-center text-lg">{card.power}</div>
              <div className="text-center truncate text-xs">{card.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
