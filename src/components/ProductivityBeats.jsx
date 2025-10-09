import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause } from 'lucide-react';

const INSTRUMENTS = {
  Lavoro: '🎹',
  Studio: '🎸',
  Sport: '🥁',
  Personal: '🎺',
};

export function ProductivityBeats({ todos }) {
  const [playing, setPlaying] = useState(false);

  const composition = useMemo(() => {
    const completed = todos.filter(t => t.completed);
    return completed.slice(0, 10).map(task => ({
      note: task.title.substring(0, 10),
      instrument: INSTRUMENTS[task.categories?.[0]] || '🎵',
      beat: Math.random(),
    }));
  }, [todos]);

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Music size={24} className="text-purple-600 dark:text-purple-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Productivity Beats</h2>
      </div>

      <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 mb-4">
        <div className="grid grid-cols-5 gap-2 mb-4">
          {composition.map((note, i) => (
            <motion.div
              key={i}
              animate={playing ? {
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              } : {}}
              transition={{
                duration: 0.5,
                repeat: playing ? Infinity : 0,
                delay: note.beat,
              }}
              className="text-4xl text-center"
            >
              {note.instrument}
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPlaying(!playing)}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
          {playing ? 'PAUSE' : 'PLAY'}
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {Object.entries(INSTRUMENTS).map(([cat, emoji]) => (
          <div key={cat} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="text-2xl">{emoji}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{cat}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
        🎵 Ogni task completato aggiunge una nota alla tua canzone!
      </p>
    </div>
  );
}
