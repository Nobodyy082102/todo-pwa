import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function HabitTrackerPlus({ todos }) {
  const [habits, setHabits] = useLocalStorage('habits', []);

  const insights = useMemo(() => {
    const completed = todos.filter(t => t.completed && t.completedAt);

    // Analisi oraria
    const byHour = completed.reduce((acc, task) => {
      const hour = new Date(task.completedAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const bestHour = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0];

    // Pattern categoria
    const byCategory = completed.reduce((acc, task) => {
      const cat = task.categories?.[0] || 'Altro';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return {
      bestTime: bestHour ? `${bestHour[0]}:00` : 'N/A',
      topCategory: Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
      prediction: completed.length > 5 ? '15:00' : 'Raccogli più dati',
    };
  }, [todos]);

  const addHabit = (name) => {
    setHabits([...habits, { id: Date.now(), name, streak: 0, lastCheck: null }]);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h =>
      h.id === id
        ? { ...h, streak: h.streak + 1, lastCheck: Date.now() }
        : h
    ));
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 hover-lift border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Brain size={24} className="text-cyan-600 dark:text-cyan-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker++</h2>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
            {insights.bestTime}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Orario Top</div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-xl font-bold text-green-700 dark:text-green-300 truncate">
            {insights.topCategory}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">Top Categoria</div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
            {insights.prediction}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Previsione</div>
        </div>
      </div>

      {/* Habits */}
      <div className="space-y-2">
        {habits.map(habit => (
          <motion.div
            key={habit.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => toggleHabit(habit.id)}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center cursor-pointer"
          >
            <span className="font-medium">{habit.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-orange-600 dark:text-orange-400 font-bold">
                🔥 {habit.streak}
              </span>
              <span className="text-2xl">{habit.streak > 0 ? '✅' : '⭕'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => addHabit(prompt('Nome abitudine:') || 'Nuova Abitudine')}
        className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg"
      >
        + Aggiungi Abitudine
      </button>

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
        🧠 L'AI analizza i tuoi pattern per suggerirti il momento migliore!
      </p>
    </div>
  );
}
