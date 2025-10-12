import React, { useState } from 'react';
import { Plus, Clock, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloralEffect } from './FloralEffect';

export function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [reminderType, setReminderType] = useState('none');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [recurringHours, setRecurringHours] = useState(24);
  const [flowerTrigger, setFlowerTrigger] = useState(0);
  const [flowerPosition, setFlowerPosition] = useState({ x: 0, y: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    let reminder = null;

    if (reminderType === 'specific' && reminderDate && reminderTime) {
      reminder = {
        type: 'specific',
        datetime: new Date(`${reminderDate}T${reminderTime}`).getTime(),
      };
    } else if (reminderType === 'recurring') {
      reminder = {
        type: 'recurring',
        intervalHours: recurringHours,
        nextTrigger: Date.now() + (recurringHours * 60 * 60 * 1000),
      };
    }

    const todo = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
      createdAt: Date.now(),
      reminder,
    };

    onAdd(todo);

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setReminderType('none');
    setReminderDate('');
    setReminderTime('');
    setRecurringHours(24);
  };

  const handlePriorityClick = (p, event) => {
    setPriority(p);

    // Ottieni la posizione del click relativa alla viewport (per fixed positioning)
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setFlowerPosition({
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2,
    });
    setFlowerTrigger(prev => prev + 1);
  };

  const priorityColors = {
    high: 'border-red-500 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 shadow-lg shadow-red-200/50 dark:shadow-red-900/20',
    medium: 'border-yellow-500 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/20',
    low: 'border-green-500 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 shadow-lg shadow-green-200/50 dark:shadow-green-900/20',
  };

  const priorityLabels = {
    high: { text: 'Alta', emoji: '🔥' },
    medium: { text: 'Media', emoji: '⚡' },
    low: { text: 'Bassa', emoji: '🌿' },
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4 overflow-visible"
    >
      <FloralEffect trigger={flowerTrigger} position={flowerPosition} />
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titolo attività..."
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
          maxLength={100}
        />
      </div>

      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione (opzionale)..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none transition-colors"
          maxLength={500}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {['high', 'medium', 'low'].map((p) => (
          <motion.button
            key={p}
            type="button"
            onClick={(e) => handlePriorityClick(p, e)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-3 rounded-xl border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
              priority === p
                ? priorityColors[p] + ' scale-105'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            <span className="text-xl">{priorityLabels[p].emoji}</span>
            <span>{priorityLabels[p].text}</span>
          </motion.button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-gray-600 dark:text-gray-400" />
          <select
            value={reminderType}
            onChange={(e) => setReminderType(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="none">Nessun promemoria</option>
            <option value="specific">Data e ora specifica</option>
            <option value="recurring">Ricorrente</option>
          </select>
        </div>

        {reminderType === 'specific' && (
          <div className="grid grid-cols-2 gap-2 pl-7">
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}

        {reminderType === 'recurring' && (
          <div className="flex items-center gap-2 pl-7">
            <Repeat size={18} className="text-gray-600 dark:text-gray-400" />
            <input
              type="number"
              value={recurringHours}
              onChange={(e) => setRecurringHours(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-20 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <span className="text-gray-600 dark:text-gray-400">ore</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!title.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={20} />
        Aggiungi Attività
      </button>
    </motion.form>
  );
}
