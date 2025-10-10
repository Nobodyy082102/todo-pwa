import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookTemplate, Plus, Play, Edit2, Trash2, Clock, ListChecks, Zap } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function RoutineLibrary({ onApplyRoutine }) {
  const [routines, setRoutines] = useLocalStorage('routines', []);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [expandedRoutine, setExpandedRoutine] = useState(null);

  const deleteRoutine = (id) => {
    if (confirm('Sei sicuro di voler eliminare questa routine?')) {
      setRoutines(routines.filter(r => r.id !== id));
    }
  };

  const applyRoutine = (routine) => {
    const now = Date.now();
    const newTodos = routine.tasks.map((task, index) => ({
      id: `${now}_${index}`,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      completed: false,
      createdAt: now + index, // Offset per ordine corretto
      categories: task.categories || [],
      reminder: null,
    }));

    onApplyRoutine(newTodos);

    // Update stats
    const updatedRoutines = routines.map(r =>
      r.id === routine.id
        ? { ...r, timesApplied: (r.timesApplied || 0) + 1, lastApplied: now }
        : r
    );
    setRoutines(updatedRoutines);
  };

  const startEdit = (routine) => {
    setEditingRoutine(routine);
    setShowBuilder(true);
  };

  const startCreate = () => {
    setEditingRoutine(null);
    setShowBuilder(true);
  };

  const saveRoutine = (routine) => {
    if (editingRoutine) {
      // Update existing
      setRoutines(routines.map(r => r.id === routine.id ? routine : r));
    } else {
      // Create new
      setRoutines([...routines, { ...routine, id: Date.now().toString(), timesApplied: 0 }]);
    }
    setShowBuilder(false);
    setEditingRoutine(null);
  };

  const toggleExpanded = (id) => {
    setExpandedRoutine(expandedRoutine === id ? null : id);
  };

  const getTotalDuration = (tasks) => {
    return tasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookTemplate size={24} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Routine & Template
          </h2>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={18} />
          Nuova Routine
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <BookTemplate size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">Nessuna routine creata</p>
          <p className="text-sm">Crea la tua prima routine per velocizzare il lavoro!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {routines.map((routine) => (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-400 dark:hover:border-purple-600 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{routine.icon || '📋'}</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {routine.name}
                      </h3>
                    </div>

                    {routine.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {routine.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <ListChecks size={16} />
                        <span>{routine.tasks.length} task</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{formatDuration(getTotalDuration(routine.tasks))}</span>
                      </div>
                      {routine.timesApplied > 0 && (
                        <div className="flex items-center gap-1">
                          <Zap size={16} className="text-amber-500" />
                          <span>Usata {routine.timesApplied}x</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => applyRoutine(routine)}
                      className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all"
                      title="Applica routine"
                    >
                      <Play size={18} />
                    </button>
                    <button
                      onClick={() => startEdit(routine)}
                      className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      title="Modifica"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteRoutine(routine.id)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      title="Elimina"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Expand button */}
                <button
                  onClick={() => toggleExpanded(routine.id)}
                  className="w-full mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {expandedRoutine === routine.id ? '▲ Nascondi dettagli' : '▼ Mostra dettagli'}
                </button>
              </div>

              {/* Expanded Task List */}
              <AnimatePresence>
                {expandedRoutine === routine.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
                  >
                    <div className="p-4 space-y-2">
                      {routine.tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg"
                        >
                          <span className="text-gray-400 dark:text-gray-600 font-medium text-sm">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  : task.priority === 'medium'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {task.priority === 'high' ? 'Priorità' : task.priority === 'medium' ? 'Poca priorità' : 'Task semplice'}
                              </span>
                              {task.estimatedMinutes > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ~{task.estimatedMinutes} min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <RoutineBuilder
            routine={editingRoutine}
            onSave={saveRoutine}
            onCancel={() => {
              setShowBuilder(false);
              setEditingRoutine(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// RoutineBuilder Component
function RoutineBuilder({ routine, onSave, onCancel }) {
  const [name, setName] = useState(routine?.name || '');
  const [description, setDescription] = useState(routine?.description || '');
  const [icon, setIcon] = useState(routine?.icon || '📋');
  const [tasks, setTasks] = useState(routine?.tasks || []);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskMinutes, setTaskMinutes] = useState(15);

  const addTask = () => {
    if (!taskTitle.trim()) return;

    setTasks([...tasks, {
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      priority: taskPriority,
      estimatedMinutes: taskMinutes,
    }]);

    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskMinutes(15);
    setShowTaskForm(false);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const moveTask = (index, direction) => {
    const newTasks = [...tasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;
    [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
    setTasks(newTasks);
  };

  const handleSave = () => {
    if (!name.trim() || tasks.length === 0) {
      alert('Inserisci un nome e almeno un task!');
      return;
    }

    onSave({
      ...(routine || {}),
      name: name.trim(),
      description: description.trim(),
      icon,
      tasks,
    });
  };

  const commonIcons = ['📋', '☀️', '🌙', '💼', '🏠', '🧹', '💪', '📚', '🎯', '⚡', '🔥', '✨'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {routine ? 'Modifica Routine' : 'Nuova Routine'}
          </h2>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icona
              </label>
              <div className="flex flex-wrap gap-2">
                {commonIcons.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                      icon === emoji
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome Routine *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="es. Routine Mattutina"
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrizione (opzionale)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrizione della routine..."
                rows={2}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                maxLength={200}
              />
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Task ({tasks.length})
              </h3>
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} />
                Aggiungi Task
              </button>
            </div>

            {/* Task Form */}
            {showTaskForm && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 space-y-3">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Titolo task *"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                />
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Descrizione (opzionale)"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:text-white resize-none text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                  >
                    <option value="high">Priorità</option>
                    <option value="medium">Poca priorità</option>
                    <option value="low">Task semplice</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={taskMinutes}
                      onChange={(e) => setTaskMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">min</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addTask}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Aggiungi
                  </button>
                  <button
                    onClick={() => setShowTaskForm(false)}
                    className="px-3 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            )}

            {/* Task List */}
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                Nessun task aggiunto. Clicca "Aggiungi Task" per iniziare.
              </p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveTask(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveTask(index, 'down')}
                        disabled={index === tasks.length - 1}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.priority === 'high' ? '🔴 Priorità' : task.priority === 'medium' ? '🟡 Poca priorità' : '🟢 Task semplice'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          • {task.estimatedMinutes} min
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTask(index)}
                      className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={!name.trim() || tasks.length === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
            >
              {routine ? 'Salva Modifiche' : 'Crea Routine'}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
