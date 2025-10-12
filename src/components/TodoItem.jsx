import React, { useState } from 'react';
import { Check, Trash2, Clock, Repeat, Bell, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_CATEGORIES } from './CategorySelector';
import { ShareButton } from './ShareButton';
import { PomodoroTimer } from './PomodoroTimer';

export function TodoItem({ todo, onToggle, onDelete, onSnooze }) {
  const [showPomodoro, setShowPomodoro] = useState(false);
  const priorityColors = {
    high: 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10',
    medium: 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10',
    low: 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10',
  };

  const priorityBadgeColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  };

  // Get text color for task title
  const getTextColor = () => {
    if (!todo.color || todo.color === 'default') {
      return null; // Use default text color
    }

    const colorMap = {
      red: '#dc2626',      // red-600
      orange: '#ea580c',   // orange-600
      yellow: '#ca8a04',   // yellow-600
      green: '#16a34a',    // green-600
      blue: '#2563eb',     // blue-600
      indigo: '#4f46e5',   // indigo-600
      purple: '#9333ea',   // purple-600
      pink: '#db2777',     // pink-600
    };

    return colorMap[todo.color] || null;
  };

  // Get size classes - using explicit conditionals for Tailwind compilation
  const getSizeClasses = () => {
    switch(todo.size) {
      case 'small':
        return {
          container: 'p-3',
          title: 'text-sm font-semibold',
          description: 'text-xs',
          badge: 'text-xs px-1.5 py-0.5',
        };
      case 'large':
        return {
          container: 'p-5',
          title: 'text-xl font-semibold',
          description: 'text-base',
          badge: 'text-sm px-2.5 py-1',
        };
      case 'medium':
      default:
        return {
          container: 'p-4',
          title: 'text-lg font-semibold',
          description: 'text-sm',
          badge: 'text-xs px-2 py-1',
        };
    }
  };

  const textColor = getTextColor();
  const taskSize = getSizeClasses();

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (categoryName) => {
    const predefined = DEFAULT_CATEGORIES.find(c => c.name === categoryName);
    return predefined?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -100 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      className={`border-l-4 rounded-xl ${taskSize.container} shadow-lg transition-all hover-lift glass-light dark:glass-dark border-r border-t border-b border-white/20 dark:border-white/10 ${priorityColors[todo.priority]} ${todo.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            todo.completed
              ? 'bg-indigo-600 border-indigo-600'
              : 'border-gray-400 hover:border-indigo-500'
          }`}
        >
          {todo.completed && <Check size={16} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`${taskSize.title} ${
                todo.completed
                  ? 'line-through text-gray-500 dark:text-gray-500'
                  : ''
              }`}
              style={!todo.completed && textColor ? { color: textColor } : {}}
            >
              {todo.title}
            </h3>
            <span
              className={`${taskSize.badge} rounded-full whitespace-nowrap ${
                priorityBadgeColors[todo.priority]
              }`}
            >
              {todo.priority === 'high' ? 'Alta' : todo.priority === 'medium' ? 'Media' : 'Bassa'}
            </span>
          </div>

          {todo.description && (
            <p className={`${taskSize.description} text-gray-600 dark:text-gray-400 mb-2`}>{todo.description}</p>
          )}

          {todo.categories && todo.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {todo.categories.map((category) => (
                <span
                  key={category}
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {todo.reminder && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              {todo.reminder.type === 'specific' ? (
                <>
                  <Clock size={14} />
                  <span>{formatDateTime(todo.reminder.datetime)}</span>
                </>
              ) : (
                <>
                  <Repeat size={14} />
                  <span>Ogni {todo.reminder.intervalHours}h</span>
                </>
              )}
            </div>
          )}

          {!todo.completed && todo.reminder && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => onSnooze(todo.id, 5)}
                className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
              >
                <Bell size={12} className="inline mr-1" />
                +5min
              </button>
              <button
                onClick={() => onSnooze(todo.id, 30)}
                className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
              >
                <Bell size={12} className="inline mr-1" />
                +30min
              </button>
              <button
                onClick={() => onSnooze(todo.id, 60)}
                className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
              >
                <Bell size={12} className="inline mr-1" />
                +1h
              </button>
              <button
                onClick={() => onSnooze(todo.id, 120)}
                className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
              >
                <Bell size={12} className="inline mr-1" />
                +2h
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 flex-shrink-0 mt-1">
          {!todo.completed && (
            <button
              onClick={() => setShowPomodoro(!showPomodoro)}
              className={`transition-colors ${
                showPomodoro
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              title="Timer Pomodoro"
            >
              <Timer size={20} />
            </button>
          )}
          <ShareButton todo={todo} />
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Pomodoro Timer */}
      <AnimatePresence>
        {showPomodoro && !todo.completed && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PomodoroTimer
              taskId={todo.id}
              taskTitle={todo.title}
              onSessionComplete={(taskId, timeSpent) => {
                console.log(`Task ${taskId} - Session complete: ${timeSpent}s`);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
