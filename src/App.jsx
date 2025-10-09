import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { FloatingActionButton } from './components/FloatingActionButton';
import { SidePanel } from './components/SidePanel';
import { Settings } from './components/Settings';
import { NotificationManager } from './components/NotificationManager';

function App() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { animationsEnabled } = useTheme();

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const snoozeTodo = (id, minutes) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id !== id || !todo.reminder) return todo;

        const snoozeTime = minutes * 60 * 1000; // Converti minuti in millisecondi

        if (todo.reminder.type === 'specific') {
          return {
            ...todo,
            reminder: {
              ...todo.reminder,
              datetime: Date.now() + snoozeTime,
            },
          };
        } else if (todo.reminder.type === 'recurring') {
          return {
            ...todo,
            reminder: {
              ...todo.reminder,
              nextTrigger: Date.now() + snoozeTime,
            },
          };
        }

        return todo;
      })
    );
  };

  const pendingTodos = todos.filter((todo) => !todo.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Notification Manager - componente invisibile che gestisce le notifiche */}
      <NotificationManager
        todos={todos}
        onSnooze={snoozeTodo}
        onComplete={toggleTodo}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐘</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Todo PWA
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gestisci le tue attività con promemoria intelligenti
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24">
        {/* Form per aggiungere nuove attività */}
        <TodoForm onAdd={addTodo} />

        {/* Lista delle attività */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onSnooze={snoozeTodo}
        />

        {/* Impostazioni */}
        <Settings />
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsPanelOpen(true)}
        pendingCount={pendingTodos.length}
        animationsEnabled={animationsEnabled}
      />

      {/* Side Panel con tutte le attività */}
      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        animationsEnabled={animationsEnabled}
      >
        <div className="space-y-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
              Riepilogo
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-indigo-700 dark:text-indigo-400">Totali</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">
                  {todos.length}
                </p>
              </div>
              <div>
                <p className="text-indigo-700 dark:text-indigo-400">Pendenti</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">
                  {pendingTodos.length}
                </p>
              </div>
            </div>
          </div>

          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onSnooze={snoozeTodo}
          />
        </div>
      </SidePanel>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>🐘 Todo PWA - Installabile come app su desktop e mobile</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
