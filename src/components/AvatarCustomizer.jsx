import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const OPTIONS = {
  face: ['😊', '😎', '🤓', '😸', '🐶', '🦊', '🐼', '🦁'],
  hair: ['👨', '👩', '🧔', '👴', '👵', '🧑‍🦰', '🧑‍🦱', '🧑‍🦳'],
  accessory: ['🎩', '👑', '🧢', '🎓', '⛑️', '🪖', '👒', '🎭'],
};

export function AvatarCustomizer({ todos }) {
  const [avatar, setAvatar] = useLocalStorage('customAvatar', {
    face: '😊',
    hair: '👨',
    accessory: '🎩',
  });
  const [celebrating, setCelebrating] = useState(false);

  const completedTasks = todos.filter(t => t.completed).length;
  const level = Math.floor(completedTasks / 5) + 1;

  const celebrate = () => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <User size={24} className="text-pink-600 dark:text-pink-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Avatar Customizer</h2>
      </div>

      {/* Avatar Display */}
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl p-8 mb-4 relative">
        <motion.div
          animate={celebrating ? {
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
          } : {}}
          onClick={celebrate}
          className="text-center cursor-pointer"
        >
          <div className="relative inline-block">
            <div className="text-9xl">{avatar.face}</div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">
              {avatar.accessory}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Level {level}
          </div>
        </motion.div>

        {celebrating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl"
          >
            ✨🎉✨
          </motion.div>
        )}
      </div>

      {/* Customization */}
      {Object.entries(OPTIONS).map(([part, options]) => (
        <div key={part} className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
            {part}
          </h3>
          <div className="grid grid-cols-8 gap-2">
            {options.map(option => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAvatar({ ...avatar, [part]: option })}
                className={`text-3xl p-2 rounded-lg ${
                  avatar[part] === option
                    ? 'bg-pink-100 dark:bg-pink-900/30 ring-2 ring-pink-500'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
        💃 Clicca l'avatar per farlo celebrare! Sblocca outfit con task completati!
      </p>
    </div>
  );
}
