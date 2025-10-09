import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, Sparkles } from 'lucide-react';
import { PomodoroTimer } from './PomodoroTimer';

export function FocusMode({ isOpen, onClose, todos, onToggle }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pendingTodos = todos.filter(t => !t.completed);
  const currentTodo = pendingTodos[currentIndex];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleNext = () => {
    if (currentIndex < pendingTodos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleComplete = () => {
    if (currentTodo) {
      onToggle(currentTodo.id);
      // Stay on same index, as the list will shift
    }
  };

  if (!isOpen || !currentTodo) return null;

  const priorityGradients = {
    high: 'from-red-400/20 via-pink-400/20 to-purple-400/20',
    medium: 'from-amber-400/20 via-yellow-400/20 to-orange-400/20',
    low: 'from-green-400/20 via-emerald-400/20 to-teal-400/20',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-gray-900/95 dark:bg-black/95 backdrop-blur-lg"
      >
        {/* Breathing Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial ${
              priorityGradients[currentTodo.priority]
            } blur-3xl`}
          />
        </div>

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        >
          <X size={24} />
        </motion.button>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-400" />
              <span className="text-sm text-gray-400">
                Modalità Focus
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Task {currentIndex + 1} di {pendingTodos.length}
            </div>
          </motion.div>

          {/* Task Card */}
          <motion.div
            key={currentTodo.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-full max-w-2xl"
          >
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
              {/* Priority Badge */}
              <div className="flex justify-center mb-6">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    currentTodo.priority === 'high'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : currentTodo.priority === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}
                >
                  {currentTodo.priority === 'high' ? 'Alta' : currentTodo.priority === 'medium' ? 'Media' : 'Bassa'} Priorità
                </span>
              </div>

              {/* Task Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6 leading-tight">
                {currentTodo.title}
              </h1>

              {/* Task Description */}
              {currentTodo.description && (
                <p className="text-lg text-gray-300 text-center mb-8 leading-relaxed">
                  {currentTodo.description}
                </p>
              )}

              {/* Categories */}
              {currentTodo.categories && currentTodo.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {currentTodo.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300 border border-white/20"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Pomodoro Timer */}
              <div className="mb-8">
                <PomodoroTimer
                  taskId={currentTodo.id}
                  taskTitle={currentTodo.title}
                  onSessionComplete={() => {}}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all"
                >
                  <Check size={20} />
                  <span>Completa</span>
                </motion.button>

                {currentIndex < pendingTodos.length - 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20"
                  >
                    <span>Prossimo</span>
                    <ChevronRight size={20} />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Breathing Guide */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500 mb-4">Respira profondamente</p>
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-sm"
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
