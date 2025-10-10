import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Calendar, Clock, TrendingUp, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function AISmartScheduler({ todos, onUpdateTodo }) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [appliedSuggestions, setAppliedSuggestions] = useLocalStorage('appliedSchedules', []);

  // Analizza pattern di produttività dell'utente
  const productivityPatterns = useMemo(() => {
    const completed = todos.filter(t => t.completed && t.completedAt);

    // Analizza ore di completamento
    const hourlyData = Array(24).fill(0);
    const hourlyCount = Array(24).fill(0);

    completed.forEach(todo => {
      const hour = new Date(todo.completedAt).getHours();
      hourlyCount[hour]++;
      // Assegna score basato su priorità
      const score = todo.priority === 'high' ? 3 : todo.priority === 'medium' ? 2 : 1;
      hourlyData[hour] += score;
    });

    // Trova le ore più produttive
    const productiveHours = hourlyData
      .map((score, hour) => ({ hour, score, count: hourlyCount[hour] }))
      .filter(h => h.count > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Analizza categoria più produttiva
    const categoryPerformance = {};
    completed.forEach(todo => {
      if (todo.categories && todo.categories.length > 0) {
        todo.categories.forEach(cat => {
          if (!categoryPerformance[cat]) {
            categoryPerformance[cat] = { count: 0, avgTime: 0 };
          }
          categoryPerformance[cat].count++;
        });
      }
    });

    return {
      bestHours: productiveHours,
      categoryPerformance,
      totalCompleted: completed.length,
      hasEnoughData: completed.length >= 5,
    };
  }, [todos]);

  // Genera suggerimenti intelligenti
  const suggestions = useMemo(() => {
    const pending = todos.filter(t => !t.completed && !t.scheduledFor);

    if (!productivityPatterns.hasEnoughData || pending.length === 0) {
      return [];
    }

    const now = new Date();
    const suggestions = [];

    pending.forEach(todo => {
      // Determina il miglior orario basato su priorità e pattern
      const bestHours = productivityPatterns.bestHours;

      if (bestHours.length === 0) return;

      let suggestedHour = bestHours[0].hour;
      let reason = `Sei più produttivo alle ${suggestedHour}:00`;

      // Aggiusta in base alla priorità
      if (todo.priority === 'high') {
        // Task alta priorità: suggerisci l'ora migliore
        reason = `🔥 Alta priorità - ore di picco produttività`;
      } else if (todo.priority === 'low') {
        // Task bassa priorità: ore meno produttive vanno bene
        if (bestHours.length > 2) {
          suggestedHour = bestHours[bestHours.length - 1].hour;
          reason = `Task semplice - slot meno impegnativo`;
        }
      }

      // Calcola il prossimo slot disponibile
      const suggestedDate = new Date(now);
      suggestedDate.setHours(suggestedHour, 0, 0, 0);

      // Se l'ora è già passata oggi, programma per domani
      if (suggestedDate < now) {
        suggestedDate.setDate(suggestedDate.getDate() + 1);
      }

      // Stima durata basata su priorità (in ore)
      const estimatedDuration = todo.priority === 'high' ? 2 : todo.priority === 'medium' ? 1 : 0.5;

      suggestions.push({
        todoId: todo.id,
        todo,
        suggestedTime: suggestedDate,
        reason,
        confidence: Math.min(95, 60 + productivityPatterns.totalCompleted * 2),
        estimatedDuration,
        priority: todo.priority,
      });
    });

    // Ordina per priorità e confidence
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });
  }, [todos, productivityPatterns]);

  const applySuggestion = (suggestion) => {
    // Aggiorna il todo con il tempo suggerito
    if (onUpdateTodo) {
      onUpdateTodo({
        ...suggestion.todo,
        scheduledFor: suggestion.suggestedTime.toISOString(),
      });
    }

    setAppliedSuggestions([...appliedSuggestions, suggestion.todoId]);
  };

  const applyAllSuggestions = () => {
    suggestions.forEach(suggestion => {
      applySuggestion(suggestion);
    });
  };

  if (!productivityPatterns.hasEnoughData) {
    return (
      <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 border border-white/20 dark:border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Brain size={24} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Smart Scheduler
          </h2>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Dati insufficienti per suggerimenti AI
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Completa almeno 5 task per permettere all'AI di analizzare i tuoi pattern di produttività.
              Attualmente: {productivityPatterns.totalCompleted} completati.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-light dark:glass-dark rounded-2xl shadow-lg p-6 border border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain size={24} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Smart Scheduler
          </h2>
          <Zap size={16} className="text-yellow-500 animate-pulse" />
        </div>

        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {showSuggestions ? 'Nascondi' : 'Mostra'}
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
              Ore Migliori
            </span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {productivityPatterns.bestHours.slice(0, 3).map(h => (
              <span key={h.hour} className="inline-block mr-2">
                {h.hour}:00
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Task Analizzati
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {productivityPatterns.totalCompleted}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
              Suggerimenti
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {suggestions.length}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Programmazione Ottimale
              </h3>
              {suggestions.length > 1 && (
                <button
                  onClick={applyAllSuggestions}
                  className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                >
                  Applica Tutti
                </button>
              )}
            </div>

            {suggestions.slice(0, 5).map((suggestion, index) => (
              <motion.div
                key={suggestion.todoId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          suggestion.priority === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : suggestion.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {suggestion.priority === 'high' ? 'Priorità Alta' :
                         suggestion.priority === 'medium' ? 'Priorità Media' : 'Priorità Bassa'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {suggestion.confidence}% confidence
                      </span>
                    </div>

                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {suggestion.todo.title}
                    </h4>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {suggestion.suggestedTime.toLocaleDateString('it-IT', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          {suggestion.suggestedTime.toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <span>~{suggestion.estimatedDuration}h</span>
                    </div>

                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      💡 {suggestion.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => applySuggestion(suggestion)}
                    disabled={appliedSuggestions.includes(suggestion.todoId)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-medium rounded-lg transition-all disabled:cursor-not-allowed"
                  >
                    {appliedSuggestions.includes(suggestion.todoId) ? '✓ Applicato' : 'Applica'}
                  </button>
                </div>
              </motion.div>
            ))}

            {suggestions.length > 5 && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                +{suggestions.length - 5} altri suggerimenti disponibili
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {suggestions.length === 0 && productivityPatterns.hasEnoughData && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <CheckCircle2 size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Tutti i task sono già programmati! 🎉</p>
        </div>
      )}
    </div>
  );
}
