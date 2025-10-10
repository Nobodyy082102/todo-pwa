import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Calendar, AlertTriangle, CheckCircle2, Link2, Trash2, Plus } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function TaskDependencies({ todos, onUpdateTodo }) {
  const [dependencies, setDependencies] = useLocalStorage('taskDependencies', []);
  const [showAddDependency, setShowAddDependency] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedDependsOn, setSelectedDependsOn] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'gantt'

  // Calcola le dipendenze e il percorso critico
  const analysis = useMemo(() => {
    const pendingTodos = todos.filter(t => !t.completed);

    // Costruisci il grafo delle dipendenze
    const graph = {};
    const inDegree = {};

    pendingTodos.forEach(todo => {
      graph[todo.id] = [];
      inDegree[todo.id] = 0;
    });

    dependencies.forEach(dep => {
      if (graph[dep.dependsOn]) {
        graph[dep.dependsOn].push(dep.taskId);
        inDegree[dep.taskId] = (inDegree[dep.taskId] || 0) + 1;
      }
    });

    // Trova task bloccati (hanno dipendenze non completate)
    const blockedTasks = [];
    const readyTasks = [];

    pendingTodos.forEach(todo => {
      const deps = dependencies.filter(d => d.taskId === todo.id);
      const hasUncompletedDeps = deps.some(dep => {
        const depTask = todos.find(t => t.id === dep.dependsOn);
        return depTask && !depTask.completed;
      });

      if (hasUncompletedDeps) {
        blockedTasks.push(todo);
      } else if (deps.length > 0) {
        readyTasks.push(todo);
      }
    });

    // Calcola percorso critico (sequenza più lunga)
    const criticalPath = [];
    const visited = new Set();

    const dfs = (taskId, path = []) => {
      if (visited.has(taskId)) return path;
      visited.add(taskId);

      const currentPath = [...path, taskId];
      const children = graph[taskId] || [];

      if (children.length === 0) return currentPath;

      let longestPath = currentPath;
      children.forEach(childId => {
        const childPath = dfs(childId, currentPath);
        if (childPath.length > longestPath.length) {
          longestPath = childPath;
        }
      });

      return longestPath;
    };

    // Trova il percorso critico partendo dai task senza dipendenze
    const rootTasks = pendingTodos.filter(t => inDegree[t.id] === 0);
    let longestPath = [];

    rootTasks.forEach(task => {
      visited.clear();
      const path = dfs(task.id);
      if (path.length > longestPath.length) {
        longestPath = path;
      }
    });

    const criticalTasks = longestPath.map(id => todos.find(t => t.id === id)).filter(Boolean);

    return {
      blockedTasks,
      readyTasks,
      criticalPath: criticalTasks,
      totalDependencies: dependencies.length,
    };
  }, [todos, dependencies]);

  const addDependency = () => {
    if (!selectedTask || !selectedDependsOn || selectedTask === selectedDependsOn) return;

    // Verifica che non crei cicli
    const wouldCreateCycle = (taskId, dependsOn) => {
      const visited = new Set();
      const checkCycle = (current) => {
        if (current === taskId) return true;
        if (visited.has(current)) return false;
        visited.add(current);

        const deps = dependencies.filter(d => d.taskId === current);
        return deps.some(dep => checkCycle(dep.dependsOn));
      };
      return checkCycle(dependsOn);
    };

    if (wouldCreateCycle(selectedTask, selectedDependsOn)) {
      alert('⚠️ Questa dipendenza creerebbe un ciclo! Non è possibile.');
      return;
    }

    setDependencies([
      ...dependencies,
      {
        id: Date.now().toString(),
        taskId: selectedTask,
        dependsOn: selectedDependsOn,
        createdAt: new Date().toISOString(),
      }
    ]);

    setSelectedTask('');
    setSelectedDependsOn('');
    setShowAddDependency(false);
  };

  const removeDependency = (depId) => {
    setDependencies(dependencies.filter(d => d.id !== depId));
  };

  // Gantt Chart Data
  const ganttData = useMemo(() => {
    const tasksWithDates = todos.filter(t => !t.completed && t.deadline);

    return tasksWithDates.map(task => {
      const deps = dependencies.filter(d => d.taskId === task.id);
      const hasDependencies = deps.length > 0;

      return {
        ...task,
        hasDependencies,
        isCritical: analysis.criticalPath.some(t => t.id === task.id),
        isBlocked: analysis.blockedTasks.some(t => t.id === task.id),
      };
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [todos, dependencies, analysis]);

  const pendingTodos = todos.filter(t => !t.completed);

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GitBranch size={24} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Dependencies
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setView('gantt')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'gantt'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Gantt
            </button>
          </div>

          <button
            onClick={() => setShowAddDependency(!showAddDependency)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Aggiungi
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-1">
            <Link2 size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Collegamenti
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {analysis.totalDependencies}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-700">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-300">
              Bloccati
            </span>
          </div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">
            {analysis.blockedTasks.length}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
              Pronti
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {analysis.readyTasks.length}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
              Path Critico
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {analysis.criticalPath.length}
          </div>
        </div>
      </div>

      {/* Add Dependency Form */}
      <AnimatePresence>
        {showAddDependency && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Nuova Dipendenza
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task
                </label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleziona task...</option>
                  {pendingTodos.map(todo => (
                    <option key={todo.id} value={todo.id}>
                      {todo.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dipende da
                </label>
                <select
                  value={selectedDependsOn}
                  onChange={(e) => setSelectedDependsOn(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleziona prerequisito...</option>
                  {pendingTodos
                    .filter(t => t.id !== selectedTask)
                    .map(todo => (
                      <option key={todo.id} value={todo.id}>
                        {todo.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addDependency}
                disabled={!selectedTask || !selectedDependsOn}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Aggiungi Dipendenza
              </button>
              <button
                onClick={() => setShowAddDependency(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                Annulla
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical Path */}
      {analysis.criticalPath.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-xl">
          <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
            <GitBranch size={16} />
            Percorso Critico ({analysis.criticalPath.length} task)
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.criticalPath.map((task, index) => (
              <React.Fragment key={task.id}>
                <span className="px-3 py-1 bg-white dark:bg-gray-800 border-2 border-purple-400 dark:border-purple-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
                  {task.title}
                </span>
                {index < analysis.criticalPath.length - 1 && (
                  <span className="text-purple-600 dark:text-purple-400">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* View Content */}
      {view === 'list' ? (
        <div className="space-y-3">
          {dependencies.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Link2 size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nessuna dipendenza creata</p>
              <p className="text-xs mt-1">Collega i task per organizzare meglio il lavoro</p>
            </div>
          ) : (
            dependencies.map(dep => {
              const task = todos.find(t => t.id === dep.taskId);
              const dependsOnTask = todos.find(t => t.id === dep.dependsOn);

              if (!task || !dependsOnTask) return null;

              const isBlocked = !dependsOnTask.completed;

              return (
                <motion.div
                  key={dep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    isBlocked
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                      : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-lg ${isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                          {isBlocked ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {task.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                            <span>dipende da</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {dependsOnTask.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              dependsOnTask.completed
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {dependsOnTask.completed ? '✓ Completato' : 'In attesa'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeDependency(dep.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Rimuovi dipendenza"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        /* Gantt View */
        <div className="space-y-2">
          {ganttData.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Calendar size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nessun task con deadline</p>
              <p className="text-xs mt-1">Aggiungi deadline ai task per visualizzare il Gantt</p>
            </div>
          ) : (
            ganttData.map(task => {
              const deadline = new Date(task.deadline);
              const today = new Date();
              const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border-2 ${
                    task.isCritical
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400 dark:border-purple-600'
                      : task.isBlocked
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {task.isCritical && (
                        <span className="text-purple-600 dark:text-purple-400" title="Percorso critico">
                          <GitBranch size={16} />
                        </span>
                      )}
                      {task.isBlocked && (
                        <span className="text-red-600 dark:text-red-400" title="Bloccato">
                          <AlertTriangle size={16} />
                        </span>
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>{deadline.toLocaleDateString('it-IT')}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        daysUntil < 0
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : daysUntil <= 3
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {daysUntil < 0 ? 'Scaduto' : daysUntil === 0 ? 'Oggi' : `${daysUntil}g`}
                      </span>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        task.isCritical
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : task.isBlocked
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                      style={{
                        width: task.isBlocked ? '50%' : daysUntil < 0 ? '100%' : `${Math.min(100, 100 - (daysUntil / 30) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
