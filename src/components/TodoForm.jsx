import React, { useState } from 'react';
import { Plus, Clock, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { CategorySelector } from './CategorySelector';

export function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [reminderType, setReminderType] = useState('none');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [recurringHours, setRecurringHours] = useState(24);
  const [categories, setCategories] = useState([]);

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
      categories,
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
    setCategories([]);
  };

  const priorityColors = {
    high: 'border-red-600 bg-red-50 dark:bg-red-900/20',
    medium: 'border-amber-600 bg-amber-50 dark:bg-amber-900/20',
    low: 'border-slate-600 bg-slate-50 dark:bg-slate-900/20',
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Bassa',
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4"
    >
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

      <div className="grid grid-cols-3 gap-2">
        {['high', 'medium', 'low'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm ${
              priority === p
                ? priorityColors[p]
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            {priorityLabels[p]}
          </button>
        ))}
      </div>

      <CategorySelector
        selectedCategories={categories}
        onChange={setCategories}
      />

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
