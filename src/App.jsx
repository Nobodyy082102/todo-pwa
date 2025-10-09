import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { FloatingActionButton } from './components/FloatingActionButton';
import { SidePanel } from './components/SidePanel';
import { Settings } from './components/Settings';
import { NotificationManager } from './components/NotificationManager';
import { BottomNav } from './components/BottomNav';
import { OnlineStatus } from './components/OnlineStatus';
import { Download, Upload } from 'lucide-react';

function App() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeView, setActiveView] = useState('active');
  const [showSettings, setShowSettings] = useState(false);
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

  const reorderTodos = (newOrder, isCompleted) => {
    const pendingTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    if (isCompleted) {
      setTodos([...pendingTodos, ...newOrder]);
    } else {
      setTodos([...newOrder, ...completedTodos]);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTodos = JSON.parse(e.target.result);
        if (Array.isArray(importedTodos)) {
          setTodos(importedTodos);
          alert('Dati importati con successo!');
        } else {
          alert('Formato file non valido');
        }
      } catch (error) {
        alert('Errore durante l\'importazione: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const pendingTodos = todos.filter((todo) => !todo.completed);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Notification Manager - componente invisibile che gestisce le notifiche */}
      <NotificationManager
        todos={todos}
        onSnooze={snoozeTodo}
        onComplete={toggleTodo}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Task Manager
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Gestisci le tue attività in modo efficiente
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {pendingTodos.length} attive
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24">
        {/* Form per aggiungere nuove attività */}
        <TodoForm onAdd={addTodo} />

        {/* Pulsanti Esporta/Importa */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm transition-all font-medium"
          >
            <Download size={18} />
            <span>Esporta</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm transition-all cursor-pointer font-medium">
            <Upload size={18} />
            <span>Importa</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>

        {/* Lista delle attività */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onSnooze={snoozeTodo}
          onReorder={reorderTodos}
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
            onReorder={reorderTodos}
          />
        </div>
      </SidePanel>

      {/* Online Status Indicator */}
      <OnlineStatus />

      {/* Bottom Navigation (solo mobile) */}
      <BottomNav
        activeView={activeView}
        onAddClick={() => {
          setActiveView('add');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onListClick={(view) => {
          setActiveView(view);
          if (view === 'completed') {
            setIsPanelOpen(true);
          }
        }}
        onSettingsClick={() => {
          setActiveView('settings');
          setShowSettings(!showSettings);
        }}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Task Manager - Funziona offline</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
