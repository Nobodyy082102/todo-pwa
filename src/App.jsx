import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useSoundEffects } from './hooks/useSoundEffects';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { FloatingActionButton } from './components/FloatingActionButton';
import { SidePanel } from './components/SidePanel';
import { Settings } from './components/Settings';
import { NotificationManager } from './components/NotificationManager';
import { BottomNav } from './components/BottomNav';
import { OnlineStatus } from './components/OnlineStatus';
import { Mascot } from './components/Mascot';
import { FilterPanel } from './components/FilterPanel';
import { SearchBar } from './components/SearchBar';
import { StatsDashboard } from './components/StatsDashboard';
import { AdvancedStats } from './components/AdvancedStats';
import { GameStats } from './components/GameStats';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { ExportPanel } from './components/ExportPanel';
import { FocusMode } from './components/FocusMode';
import { VirtualPet } from './components/VirtualPet';
import { StreakFlame } from './components/StreakFlame';
import { SeasonalEffects } from './components/SeasonalEffects';
import { EnergyTracker } from './components/EnergyTracker';
import { ParticleEffect, AmbientParticles } from './components/ParticleEffect';
import { DailyQuests } from './components/DailyQuests';
import { HabitTrackerPlus } from './components/HabitTrackerPlus';
import { TimeTravel } from './components/TimeTravel';
import { CityBuilder } from './components/CityBuilder';
import { AISmartScheduler } from './components/AISmartScheduler';
import { TaskDependencies } from './components/TaskDependencies';
import { AutomationRules } from './components/AutomationRules';
import { RoutineLibrary } from './components/RoutineLibrary';
import { filterTodos, searchTodos } from './utils/filterTodos';
import { getSharedTodoFromUrl, clearShareParamFromUrl } from './utils/shareUtils';
import { checkNewAchievements } from './utils/achievements';
import { Download, Upload, Sparkles } from 'lucide-react';

function App() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeView, setActiveView] = useState('active');
  const [showSettings, setShowSettings] = useState(false);
  const [taskAddedTrigger, setTaskAddedTrigger] = useState(0);
  const [taskCompletedTrigger, setTaskCompletedTrigger] = useState(0);
  const { animationsEnabled } = useTheme();
  const { playTaskComplete, playDelete, playSnooze, playAchievement, soundEnabled, toggleSound } = useSoundEffects();

  // Achievement system
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage('achievements', []);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  // Focus Mode
  const [showFocusMode, setShowFocusMode] = useState(false);

  // Filter and search state
  const [filters, setFilters] = useState({
    priorities: [],
    categories: [],
    showCompleted: true,
    dateRange: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sharedTodoNotification, setSharedTodoNotification] = useState(null);
  const [showParticles, setShowParticles] = useState(false);

  // Check for shared TODO in URL on mount
  useEffect(() => {
    const sharedTodo = getSharedTodoFromUrl();
    if (sharedTodo) {
      // Add the shared todo
      setTodos(prevTodos => [...prevTodos, sharedTodo]);
      setSharedTodoNotification(`Attività "${sharedTodo.title}" importata con successo!`);
      clearShareParamFromUrl();

      // Clear notification after 5 seconds
      setTimeout(() => {
        setSharedTodoNotification(null);
      }, 5000);
    }
  }, []); // Only run on mount

  // Check for new achievements when todos change
  useEffect(() => {
    const newAchievements = checkNewAchievements(todos, unlockedAchievements);

    if (newAchievements.length > 0) {
      // Unlock achievements
      const newIds = newAchievements.map(a => a.id);
      setUnlockedAchievements([...unlockedAchievements, ...newIds]);

      // Show first achievement (queue if multiple)
      setCurrentAchievement(newAchievements[0]);
      playAchievement();
    }
  }, [todos]);

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
    setTaskAddedTrigger(prev => prev + 1); // Trigger elefantino
  };

  const addMultipleTodos = (newTodos) => {
    setTodos([...todos, ...newTodos]);
    setTaskAddedTrigger(prev => prev + newTodos.length); // Trigger elefantino per ogni task
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed) {
      // Trigger solo quando completi (non quando de-completi)
      setTaskCompletedTrigger(prev => prev + 1);

      // Particelle celebrative!
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1500);

      // Suono di completamento!
      playTaskComplete();

      // Aggiungi timestamp completamento per stats
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: true, completedAt: Date.now() } : t
        )
      );
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  const deleteTodo = (id) => {
    playDelete();
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (updatedTodo) => {
    setTodos(todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };

  const snoozeTodo = (id, minutes) => {
    playSnooze();
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

  // Apply filters and search
  const filteredTodos = useMemo(() => {
    let result = filterTodos(todos, filters);
    result = searchTodos(result, searchQuery);
    return result;
  }, [todos, filters, searchQuery]);

  return (
    <div className="min-h-screen relative overflow-visible">
      {/* Background gradient animato */}
      <div className="fixed inset-0 gradient-animated-slow opacity-20 dark:opacity-10 -z-10" />
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 -z-20" />

      {/* Particelle ambiente */}
      <AmbientParticles />

      {/* Seasonal Effects */}
      <SeasonalEffects />

      {/* Particelle celebrative */}
      <ParticleEffect trigger={showParticles} type="confetti" />
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFocusMode(true)}
                disabled={pendingTodos.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                title="Modalità Focus"
              >
                <span className="hidden sm:inline">Focus</span>
                <Sparkles size={16} />
              </button>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {pendingTodos.length} attive
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24 relative z-10">
        {/* Game Stats - XP e Livelli */}
        <GameStats todos={todos} />

        {/* Form per aggiungere nuove attività */}
        <TodoForm onAdd={addTodo} />

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Cerca per titolo, descrizione o categoria..."
        />

        {/* Filter Panel */}
        <FilterPanel
          activeFilters={filters}
          onFilterChange={setFilters}
        />

        {/* Statistics Dashboard */}
        {todos.length > 0 && <StatsDashboard todos={todos} />}

        {/* Advanced Statistics with Charts */}
        {todos.length > 0 && <AdvancedStats todos={todos} />}

        {/* NEW FEATURES ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VirtualPet todos={todos} />
          <StreakFlame todos={todos} />
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Energy Tracker */}
        <EnergyTracker />

        {/* Daily Quests */}
        <DailyQuests todos={todos} />

        {/* City Builder */}
        <CityBuilder todos={todos} />

        {/* Habit Tracker Plus */}
        <HabitTrackerPlus todos={todos} />

        {/* Time Travel */}
        <TimeTravel todos={todos} />

        {/* AI Smart Scheduler */}
        <AISmartScheduler todos={todos} onUpdateTodo={updateTodo} />

        {/* Task Dependencies with Gantt Chart */}
        <TaskDependencies todos={todos} onUpdateTodo={updateTodo} />

        {/* Automation Rules (IFTTT) */}
        <AutomationRules
          todos={todos}
          onUpdateTodo={updateTodo}
          onCreateTodo={addTodo}
        />

        {/* Routine Library */}
        <RoutineLibrary onApplyRoutine={addMultipleTodos} />

        {/* Export Panel */}
        <ExportPanel todos={todos} />

        {/* Import Button */}
        <div className="flex justify-center">
          <label className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-lg transition-all cursor-pointer font-medium hover-lift">
            <Upload size={20} />
            <span>Importa da JSON</span>
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
          todos={filteredTodos}
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

      {/* Shared TODO Notification */}
      {sharedTodoNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{sharedTodoNotification}</span>
        </div>
      )}

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

      {/* Mascotte Elefantino */}
      <Mascot
        onTaskAdded={taskAddedTrigger}
        onTaskCompleted={taskCompletedTrigger}
      />

      {/* Focus Mode */}
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
        todos={todos}
        onToggle={toggleTodo}
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
