import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { ListTodo, CheckCircle2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

export function TodoList({ todos, onToggle, onDelete, onSnooze, onReorder }) {
  const [showCompleted, setShowCompleted] = useState(false);

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const displayTodos = showCompleted ? completedTodos : pendingTodos;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2">
          <ListTodo className="text-indigo-600 dark:text-indigo-400" size={24} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {showCompleted ? 'Attività Completate' : 'Attività Pendenti'}
          </h2>
          <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
            {displayTodos.length}
          </span>
        </div>

        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">
            {showCompleted ? `Pendenti (${pendingTodos.length})` : `Completate (${completedTodos.length})`}
          </span>
        </button>
      </div>

      {displayTodos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {showCompleted ? 'Nessuna attività completata' : 'Nessuna attività pendente'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            {showCompleted ? 'Completa alcune attività per vederle qui!' : 'Aggiungi una nuova attività per iniziare!'}
          </p>
        </motion.div>
      ) : (
        <Reorder.Group
          axis="y"
          values={displayTodos}
          onReorder={(newOrder) => onReorder && onReorder(newOrder, showCompleted)}
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {displayTodos.map((todo) => (
              <Reorder.Item
                key={todo.id}
                value={todo}
                drag={!showCompleted}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                className="cursor-grab active:cursor-grabbing"
              >
                <div className="relative group">
                  {!showCompleted && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity z-10">
                      <GripVertical size={20} className="text-gray-400" />
                    </div>
                  )}
                  <TodoItem
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onSnooze={onSnooze}
                  />
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </div>
  );
}
