import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { FloatingActionButton } from './components/FloatingActionButton';
import { SidePanel } from './components/SidePanel';
import { Settings } from './components/Settings';
import { NotificationManager } from './components/NotificationManager';
import { Download, Upload } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 transition-colors">
      {/* Notification Manager - componente invisibile che gestisce le notifiche */}
      <NotificationManager
        todos={todos}
        onSnooze={snoozeTodo}
        onComplete={toggleTodo}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 dark:from-purple-800 dark:via-pink-700 dark:to-indigo-800 shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="text-5xl animate-bounce">🌈</span>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Todo PWA ✨
              </h1>
              <p className="text-sm text-purple-100 dark:text-purple-200">
                Gestisci le tue attività con promemoria intelligenti 🎯
              </p>
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg shadow-blue-300/50 dark:shadow-blue-900/30 transition-all hover:shadow-xl hover:scale-105 active:scale-95 font-semibold"
          >
            <Download size={20} />
            <span>💾 Esporta Dati</span>
          </button>
          <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg shadow-green-300/50 dark:shadow-green-900/30 transition-all hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer font-semibold">
            <Upload size={20} />
            <span>📂 Importa Dati</span>
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
