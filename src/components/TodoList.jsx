import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { ListTodo, CheckCircle2 } from 'lucide-react';

export function TodoList({ todos, onToggle, onDelete, onSnooze }) {
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

      <div className="space-y-3">
        {displayTodos.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {showCompleted ? 'Nessuna attività completata' : 'Nessuna attività pendente'}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {showCompleted ? 'Completa alcune attività per vederle qui!' : 'Aggiungi una nuova attività per iniziare!'}
            </p>
          </div>
        ) : (
          displayTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onSnooze={onSnooze}
            />
          ))
        )}
      </div>
    </div>
  );
}
