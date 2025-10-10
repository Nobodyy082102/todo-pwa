import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Trash2, Play, Pause, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function AutomationRules({ todos, onUpdateTodo, onCreateTodo }) {
  const [rules, setRules] = useLocalStorage('automationRules', []);
  const [executionLog, setExecutionLog] = useLocalStorage('ruleExecutionLog', []);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: 'taskCompleted',
    condition: {},
    action: 'createTask',
    actionData: {},
    enabled: true,
  });

  const TRIGGERS = [
    { value: 'taskCompleted', label: 'Task completato', icon: '✓' },
    { value: 'taskCreated', label: 'Task creato', icon: '+' },
    { value: 'deadline', label: 'Deadline vicina', icon: '⏰' },
    { value: 'timeOfDay', label: 'Ora del giorno', icon: '🕐' },
    { value: 'dayOfWeek', label: 'Giorno settimana', icon: '📅' },
  ];

  const ACTIONS = [
    { value: 'createTask', label: 'Crea task', icon: '📝' },
    { value: 'updatePriority', label: 'Cambia priorità', icon: '⚡' },
    { value: 'addCategory', label: 'Aggiungi categoria', icon: '🏷️' },
    { value: 'sendNotification', label: 'Invia notifica', icon: '🔔' },
    { value: 'incrementCounter', label: 'Incrementa contatore', icon: '🔢' },
  ];

  // Esegui regole automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      executeRules();
    }, 60000); // Controlla ogni minuto

    return () => clearInterval(interval);
  }, [todos, rules]);

  const executeRules = () => {
    const now = new Date();
    const activeRules = rules.filter(r => r.enabled);

    activeRules.forEach(rule => {
      let shouldExecute = false;

      // Valuta trigger
      switch (rule.trigger) {
        case 'taskCompleted':
          // Eseguito manualmente quando si completa un task
          break;

        case 'deadline':
          todos.forEach(todo => {
            if (todo.deadline && !todo.completed) {
              const deadline = new Date(todo.deadline);
              const hoursUntil = (deadline - now) / (1000 * 60 * 60);

              if (rule.condition.hoursBefore && hoursUntil <= rule.condition.hoursBefore && hoursUntil > 0) {
                shouldExecute = true;
                executeAction(rule, todo);
              }
            }
          });
          break;

        case 'timeOfDay':
          const currentHour = now.getHours();
          if (rule.condition.hour === currentHour) {
            shouldExecute = true;
            executeAction(rule);
          }
          break;

        case 'dayOfWeek':
          const currentDay = now.getDay();
          if (rule.condition.day === currentDay) {
            shouldExecute = true;
            executeAction(rule);
          }
          break;
      }
    });
  };

  const executeAction = (rule, contextTodo = null) => {
    const now = new Date();

    try {
      switch (rule.action) {
        case 'createTask':
          if (onCreateTodo) {
            const newTask = {
              id: Date.now().toString(),
              title: rule.actionData.title || 'Task automatico',
              description: rule.actionData.description || '',
              priority: rule.actionData.priority || 'medium',
              completed: false,
              createdAt: now.toISOString(),
              categories: rule.actionData.categories || [],
            };
            onCreateTodo(newTask);
            logExecution(rule, 'success', `Task "${newTask.title}" creato`);
          }
          break;

        case 'updatePriority':
          if (contextTodo && onUpdateTodo) {
            onUpdateTodo({
              ...contextTodo,
              priority: rule.actionData.priority || 'high',
            });
            logExecution(rule, 'success', `Priorità aggiornata per "${contextTodo.title}"`);
          }
          break;

        case 'addCategory':
          if (contextTodo && onUpdateTodo) {
            const newCategories = [...(contextTodo.categories || []), rule.actionData.category];
            onUpdateTodo({
              ...contextTodo,
              categories: newCategories,
            });
            logExecution(rule, 'success', `Categoria aggiunta a "${contextTodo.title}"`);
          }
          break;

        case 'sendNotification':
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(rule.actionData.title || 'Automazione Task', {
              body: rule.actionData.message || '',
              icon: '/pwa-192x192.png',
            });
            logExecution(rule, 'success', 'Notifica inviata');
          }
          break;

        case 'incrementCounter':
          // Salva contatore in localStorage
          const counterKey = `counter_${rule.id}`;
          const currentValue = parseInt(localStorage.getItem(counterKey) || '0');
          localStorage.setItem(counterKey, (currentValue + 1).toString());
          logExecution(rule, 'success', `Contatore incrementato: ${currentValue + 1}`);
          break;
      }
    } catch (error) {
      logExecution(rule, 'error', error.message);
    }
  };

  const logExecution = (rule, status, message) => {
    const newLog = {
      id: Date.now().toString(),
      ruleId: rule.id,
      ruleName: rule.name,
      status,
      message,
      timestamp: new Date().toISOString(),
    };

    setExecutionLog([newLog, ...executionLog.slice(0, 49)]); // Mantieni solo ultimi 50
  };

  const addRule = () => {
    if (!newRule.name) return;

    const rule = {
      ...newRule,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setRules([...rules, rule]);
    setNewRule({
      name: '',
      trigger: 'taskCompleted',
      condition: {},
      action: 'createTask',
      actionData: {},
      enabled: true,
    });
    setShowAddRule(false);
  };

  const toggleRule = (ruleId) => {
    setRules(rules.map(r =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteRule = (ruleId) => {
    if (confirm('Eliminare questa regola?')) {
      setRules(rules.filter(r => r.id !== ruleId));
    }
  };

  const testRule = (rule) => {
    executeAction(rule);
  };

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap size={24} className="text-yellow-600 dark:text-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Automation Rules
          </h2>
          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
            IFTTT
          </span>
        </div>

        <button
          onClick={() => setShowAddRule(!showAddRule)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nuova Regola
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
              Regole Attive
            </span>
          </div>
          <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
            {rules.filter(r => r.enabled).length} / {rules.length}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
              Esecuzioni OK
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {executionLog.filter(l => l.status === 'success').length}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-1">
            <Play size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Ultima Esecuzione
            </span>
          </div>
          <div className="text-xs text-blue-900 dark:text-blue-100">
            {executionLog.length > 0
              ? new Date(executionLog[0].timestamp).toLocaleString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Nessuna'}
          </div>
        </div>
      </div>

      {/* Add Rule Form */}
      <AnimatePresence>
        {showAddRule && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Crea Nuova Regola di Automazione
            </h3>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Regola
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Es: Crea task review settimanale"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quando (Trigger)
                </label>
                <select
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value, condition: {} })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {TRIGGERS.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition (basato su trigger) */}
              {newRule.trigger === 'deadline' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ore prima della deadline
                  </label>
                  <input
                    type="number"
                    value={newRule.condition.hoursBefore || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      condition: { ...newRule.condition, hoursBefore: parseInt(e.target.value) }
                    })}
                    placeholder="24"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              )}

              {newRule.trigger === 'timeOfDay' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ora
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={newRule.condition.hour || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      condition: { ...newRule.condition, hour: parseInt(e.target.value) }
                    })}
                    placeholder="9"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              )}

              {/* Action */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allora (Action)
                </label>
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value, actionData: {} })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {ACTIONS.map(a => (
                    <option key={a.value} value={a.value}>
                      {a.icon} {a.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Data */}
              {newRule.action === 'createTask' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titolo task da creare
                  </label>
                  <input
                    type="text"
                    value={newRule.actionData.title || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      actionData: { ...newRule.actionData, title: e.target.value }
                    })}
                    placeholder="Nuovo task automatico"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              )}

              {newRule.action === 'sendNotification' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Messaggio notifica
                  </label>
                  <input
                    type="text"
                    value={newRule.actionData.message || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      actionData: { ...newRule.actionData, message: e.target.value }
                    })}
                    placeholder="Ricordati di..."
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={addRule}
                  disabled={!newRule.name}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Crea Regola
                </button>
                <button
                  onClick={() => setShowAddRule(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Zap size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nessuna regola di automazione</p>
            <p className="text-xs mt-1">Crea regole per automatizzare il tuo workflow</p>
          </div>
        ) : (
          rules.map((rule, index) => {
            const trigger = TRIGGERS.find(t => t.value === rule.trigger);
            const action = ACTIONS.find(a => a.value === rule.action);

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  rule.enabled
                    ? 'bg-white dark:bg-gray-800 border-yellow-300 dark:border-yellow-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {rule.enabled ? <Zap className="text-yellow-600" size={20} /> : <Pause className="text-gray-400" size={20} />}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {rule.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        rule.enabled
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {rule.enabled ? 'Attiva' : 'Pausa'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Se:</span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        {trigger?.icon} {trigger?.label}
                      </span>
                      <span>→</span>
                      <span className="font-medium">Allora:</span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                        {action?.icon} {action?.label}
                      </span>
                    </div>

                    {/* Execution count */}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Esecuzioni: {executionLog.filter(l => l.ruleId === rule.id).length}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => testRule(rule)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Testa regola"
                    >
                      <Play size={16} />
                    </button>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title={rule.enabled ? 'Disattiva' : 'Attiva'}
                    >
                      {rule.enabled ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Elimina regola"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Execution Log */}
      {executionLog.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Log Esecuzioni (ultime 10)
          </h3>
          <div className="space-y-2">
            {executionLog.slice(0, 10).map(log => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-2 text-xs bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                {log.status === 'success' ? (
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={14} />
                ) : (
                  <AlertCircle className="text-red-600 flex-shrink-0" size={14} />
                )}
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {log.ruleName}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {log.message}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-500 text-xs">
                  {new Date(log.timestamp).toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
